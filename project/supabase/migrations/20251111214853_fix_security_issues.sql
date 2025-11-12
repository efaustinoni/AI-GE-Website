/*
  # Fix Security Issues

  1. Performance Optimization
    - Add index on `page_blocks.page_id` foreign key
    - Improves query performance for joins and lookups on this foreign key
  
  2. Security Enhancement
    - Fix function search path mutability for `notify_new_submission`
    - Add `SET search_path = ''` to make the function search path immutable
    - Prevents potential security issues from search path manipulation
    - Use fully qualified names for all function calls
  
  3. Important Notes
    - The index will speed up queries that filter or join on page_id
    - The search path fix ensures the function cannot be exploited via search path attacks
*/

-- Add index for the foreign key on page_blocks.page_id
CREATE INDEX IF NOT EXISTS idx_page_blocks_page_id ON page_blocks(page_id);

-- Fix the notify_new_submission function to have immutable search path
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
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = '';
