import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Load your environment variables
const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY as string;

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
