# Quick Start Guide - Get Running in 5 Minutes

## ⚠️ Current Error Fix

You're seeing the Supabase error because the environment variables aren't set up yet. Follow these steps:

## Step 1: Create Supabase Project (2 minutes)

1. Go to **https://supabase.com**
2. Click **"New Project"**
3. Fill in:
   - **Name**: CRM Demo
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup

## Step 2: Get Your API Keys (1 minute)

1. In your Supabase dashboard, click **Settings** (gear icon)
2. Click **"API"** in the left sidebar
3. Copy these two values:
   - **Project URL**: Should look like `https://abcdefghijklmnop.supabase.co`
     - ⚠️ **NOT** `https://sb_publishable_xxxxx.supabase.co`
     - Find it under "Project URL" section
   - **anon public key**: Long string starting with `eyJ...`
     - Find it under "Project API keys" → "anon public"

## Step 3: Update Environment Variables (30 seconds)

1. Open the file `.env.local` in your project root
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzOTU4NzIwMCwiZXhwIjoxOTU1MTYzMjAwfQ.example-signature-here
```

## Step 4: Set Up Database (1 minute)

1. In Supabase dashboard, click **"SQL Editor"**
2. Click **"New query"**
3. Open `lib/database/schema.sql` from your project
4. Copy ALL the content
5. Paste into Supabase SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)

✅ You should see: "Success. No rows returned"

**Note**: If you get a permission error about "app.jwt_secret", that's been fixed in the schema file. Just re-copy the updated content.

## Step 5: Create Demo User (30 seconds)

1. In Supabase dashboard, click **"Authentication"**
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   - **Email**: `admin@demo.com`
   - **Password**: `password123`
4. Click **"Create user"**

## Step 6: Start the App (30 seconds)

1. **Stop the current dev server** (Ctrl+C in terminal)
2. **Restart it**:
   ```bash
   npm run dev
   ```
3. Open **http://localhost:3000**
4. Login with:
   - **Email**: `admin@demo.com`
   - **Password**: `password123`

## ✅ You're Done!

The app should now work perfectly. You'll see:
- Dashboard with statistics
- Sample tasks, leads, and team members
- All CRUD operations working
- Fast, responsive interface

## 🎯 What to Test

1. **Dashboard**: View statistics and recent activities
2. **Tasks**: Create, edit, delete tasks
3. **Leads**: Add leads with phone numbers
4. **Team**: Manage team members
5. **Reports**: View analytics
6. **Logs**: Check activity logs

## 🚨 Still Having Issues?

### Error: "Cannot connect to Supabase"
- Double-check your `.env.local` file
- Make sure there are no extra spaces
- Restart the dev server

### Error: "No data showing"
- Verify you ran the SQL script in Supabase
- Check Supabase → Table Editor to see if tables exist
- Make sure sample data was inserted

### Error: "Login not working"
- Verify user was created in Supabase Authentication
- Check email and password are correct
- Look for errors in browser console (F12)

## 📞 Need Help?

Check these files for more details:
- `SETUP_GUIDE.md` - Comprehensive setup instructions
- `README.md` - Project overview and features
- `TECHNICAL_DOCUMENTATION.md` - Architecture details

---

**Pro Tip**: Once everything is working, you can customize the UI colors in `tailwind.config.js` and add your own features!