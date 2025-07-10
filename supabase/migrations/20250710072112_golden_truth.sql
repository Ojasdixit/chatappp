/*
  # Chat Application Database Schema

  1. New Tables
    - `user_sessions`
      - `id` (uuid, primary key)
      - `username` (text, not null)
      - `session_id` (text, unique, not null)
      - `status` (text, default 'waiting')
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    - `chat_rooms`
      - `id` (uuid, primary key)
      - `user1_session_id` (text, not null)
      - `user2_session_id` (text, not null)
      - `created_at` (timestamptz, default now())
      - `ended_at` (timestamptz, nullable)
      - Unique constraint on (user1_session_id, user2_session_id)
    - `messages`
      - `id` (uuid, primary key)
      - `room_id` (uuid, foreign key to chat_rooms)
      - `sender_session_id` (text, not null)
      - `message_text` (text, not null)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (guest-based chat)

  3. Functions and Triggers
    - Update timestamp function
    - Trigger for automatic timestamp updates

  4. Realtime
    - Enable realtime replication for live updates
*/

-- Create user sessions table to track active users waiting for matches
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  session_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'waiting', -- 'waiting', 'matched', 'disconnected'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat rooms table to track active conversations
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_session_id TEXT NOT NULL,
  user2_session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user1_session_id, user2_session_id)
);

-- Create messages table to store chat messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL,
  sender_session_id TEXT NOT NULL,
  message_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'messages_room_id_fkey' 
    AND table_name = 'messages'
  ) THEN
    ALTER TABLE public.messages 
    ADD CONSTRAINT messages_room_id_fkey 
    FOREIGN KEY (room_id) REFERENCES public.chat_rooms(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable Row Level Security (these are guest users, so we'll allow public access)
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is guest-based chat)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_sessions' 
    AND policyname = 'Allow all operations on user_sessions'
  ) THEN
    CREATE POLICY "Allow all operations on user_sessions" ON public.user_sessions FOR ALL USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'chat_rooms' 
    AND policyname = 'Allow all operations on chat_rooms'
  ) THEN
    CREATE POLICY "Allow all operations on chat_rooms" ON public.chat_rooms FOR ALL USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' 
    AND policyname = 'Allow all operations on messages'
  ) THEN
    CREATE POLICY "Allow all operations on messages" ON public.messages FOR ALL USING (true);
  END IF;
END $$;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_user_sessions_updated_at'
  ) THEN
    CREATE TRIGGER update_user_sessions_updated_at
      BEFORE UPDATE ON public.user_sessions
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Enable realtime for live updates
ALTER TABLE public.user_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.chat_rooms REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Add tables to realtime publication (safely)
DO $$
BEGIN
  -- Check if tables are already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'user_sessions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_sessions;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'chat_rooms'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_rooms;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;
END $$;