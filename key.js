// key.js
const SUPABASE_URL = 'https://wmhweeeyulhmoilypklz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtaHdlZWV5dWxobW9pbHlwa2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDEzMDYsImV4cCI6MjEwMTU3NzMwNn0._X3dAzw24Yi1gPAlG7PFJMSRiZgcOVE3x2zlu9yVU-4';

// สร้าง Supabase Client ไว้ตรงนี้เพื่อให้ทุกไฟล์ดึงไปใช้ร่วมกันได้เลย
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
