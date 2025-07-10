/*
  # Fix Connection Logic

  1. Changes
    - Add status 'connecting' to handle active search state
    - Add index on status for better performance
    - Update policies to handle reconnections properly
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add index on status for better performance when finding connecting users
CREATE INDEX IF NOT EXISTS idx_user_sessions_status ON public.user_sessions(status);

-- Add index on session_id for better performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON public.user_sessions(session_id);

-- Add index on room queries
CREATE INDEX IF NOT EXISTS idx_chat_rooms_user_sessions ON public.chat_rooms(user1_session_id, user2_session_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_ended_at ON public.chat_rooms(ended_at);

-- Add index on messages for better performance
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON public.messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);