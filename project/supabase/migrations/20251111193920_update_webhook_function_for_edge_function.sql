/*
  # Update webhook function to work with Edge Functions
  
  1. Changes
    - Modify notify_new_submission function to construct webhook URL directly
    - Remove dependency on runtime configuration parameters
    - Use hardcoded Supabase URL (safe for webhook calls)
    - Use service role key from Supabase secrets (handled by Edge Function)
  
  2. Important Notes
    - Edge Function will validate incoming requests
    - The function makes an async HTTP call that won't block form submissions
*/

-- Update function to use direct URL construction
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

  -- Make async HTTP request to Edge Function
  -- Note: We don't include Authorization header as the Edge Function will be public
  PERFORM
    net.http_post(
      url := webhook_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json'
      ),
      body := payload
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
