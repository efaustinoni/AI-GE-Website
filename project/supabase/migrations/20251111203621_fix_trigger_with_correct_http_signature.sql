/*
  # Fix trigger function to use correct http_post signature

  1. Changes
    - Update notify_new_submission to use correct http_post function signature
    - The http extension provides: http_post(uri varchar, content varchar, content_type varchar)
    - Convert JSONB payload to text and specify proper content type
  
  2. Important Notes
    - This uses the three-parameter version of http_post
    - Properly formats the payload as JSON string
*/

CREATE OR REPLACE FUNCTION notify_new_submission()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT;
  payload JSONB;
  response extensions.http_response;
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
  -- Using the correct signature: http_post(uri, content, content_type)
  SELECT * INTO response FROM extensions.http_post(
    webhook_url,
    payload::text,
    'application/json'
  );

  -- Log the response for debugging (optional)
  RAISE NOTICE 'Webhook response status: %', response.status;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
