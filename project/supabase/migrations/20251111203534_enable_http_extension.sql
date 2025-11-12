/*
  # Enable HTTP Extension for Webhooks

  1. Purpose
    - Enables the `http` extension required for database triggers to make HTTP requests
    - This extension provides `http_post()` function used by the notification trigger
  
  2. Changes
    - Install `http` extension in the `extensions` schema
    - Required for the `notify_new_submission()` trigger function to work
  
  3. Security
    - Extension is installed in the `extensions` schema (not public) for better organization
    - Only database functions can use this extension
*/

-- Enable the http extension for making HTTP requests from database triggers
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;
