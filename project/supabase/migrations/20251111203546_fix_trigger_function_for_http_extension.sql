/*
  # Fix trigger function to use extensions.http_post

  1. Changes
    - Update notify_new_submission function to use extensions.http_post
    - Previously was calling net.http_post which doesn't exist
    - The correct function name from the http extension is extensions.http_post
  
  2. Important Notes
    - This fixes the webhook trigger that wasn't firing due to missing function reference
    - The trigger will now properly call the Edge Function when new submissions are created
*/

-- Update function to use correct http extension function
CREATE OR REPLACE FUNCTION notify_new_submission()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT;
  payload JSONB;
BEGIN
  -- Construct the Edge Function URL directly
  webhook_url := 'https://chbgtwjweisifwpyysau.supabase.co/functions/v1/notify-submission';
  
  -- Build the payload with all submission data
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'submissions',
    'record', row_to_json(NEW)::jsonb
  );

  -- Make async HTTP request to Edge Function using the http extension
  PERFORM
    extensions.http_post(
      url := webhook_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json'
      ),
      body := payload::text
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
