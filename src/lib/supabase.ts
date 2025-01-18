import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rhitslenrrkhmpmsgltw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoaXRzbGVucnJraG1wbXNnbHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4NDI2OTYsImV4cCI6MjA0OTQxODY5Nn0.aIt2Vm2deZRqTwsFA9CLMip-cKYmfuUrwPzuiUm4zCw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});