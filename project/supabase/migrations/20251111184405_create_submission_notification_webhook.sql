/*
  # Create submission notification webhook

  1. Database Function
    - `notify_new_submission` - Trigger function that fires on new submission inserts
    - Sends HTTP POST request to Edge Function with submission data
    - Handles both 'contact' and 'security-scan' submission types
  
  2. Trigger Setup
    - Creates trigger on submissions table for INSERT operations
    - Fires AFTER each row is inserted
    - Passes complete submission data to Edge Function
  
  3. Important Notes
    - Edge Function URL must be configured with your Supabase project URL
    - Edge Function will handle email formatting and sending
    - Webhook fires asynchronously to avoid blocking form submissions
*/

-- Create function to notify about new submissions
CREATE OR REPLACE FUNCTION notify_new_submission()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT;
  payload JSONB;
BEGIN
  -- Construct the Edge Function URL
  webhook_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/notify-submission';
  
  -- Build the payload with all submission data
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'submissions',
    'record', row_to_json(NEW)::jsonb
  );

  -- Make async HTTP request to Edge Function
  PERFORM
    net.http_post(
      url := webhook_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := payload
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on submissions table
DROP TRIGGER IF EXISTS on_submission_created ON submissions;

CREATE TRIGGER on_submission_created
  AFTER INSERT ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_submission();
