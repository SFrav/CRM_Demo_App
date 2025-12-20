# Troubleshooting Guide

## "Failed to fetch" Error on Login

This error means the app cannot connect to Supabase. Here's how to fix it:

### Step 1: Get the Correct Supabase URL

Your Supabase URL should look like this:
```
https://abcdefghijklmnop.supabase.co
```

**NOT like this:**
```
https://sb_publishable_xxxxx.supabase.co  ❌ WRONG
```

### Step 2: Find Your Correct Credentials

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your CRM Demo project
3. Click **Settings** (gear icon in the left sidebar)
4. Click **API** in the settings menu
5. You'll see two sections:

#### Project URL
Look for "Project URL" - it should be:
```
https://[your-project-ref].supabase.co
```
Example: `https://czlqipbmelqoukvbazgs.supabase.co`

#### Project API keys
Look for "anon public" key under "Project API keys" section:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Update Your .env.local File

Open `.env.local` and update with the CORRECT values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://czlqipbmelqoukvbazgs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6bHFpcGJtZWxxb3VrdmJhemdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMzk1ODksImV4cCI6MjA4MTcxNTU4OX0.rDO2ZJv7yWJdq4AmAFL7EFhnTnfdkywIiRyN5RTUPfE
```

**Important**: 
- No spaces before or after the `=`
- No quotes around the values
- Make sure the URL starts with `https://`
- Make sure the URL ends with `.supabase.co`

### Step 4: Restart the Development Server

After updating `.env.local`:

1. **Stop the server**: Press `Ctrl+C` in the terminal
2. **Start it again**: 
   ```bash
   npm run dev
   ```
3. **Clear browser cache**: Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
4. **Try logging in again**

### Step 5: Verify User Exists

Make sure you created the user in Supabase:

1. Go to Supabase dashboard
2. Click **Authentication** in the left sidebar
3. You should see a user with email `admin@demo.com`
4. If not, create it:
   - Click **Add user** → **Create new user**
   - Email: `admin@demo.com`
   - Password: `password123`
   - Click **Create user**

## Other Common Issues

### Issue: "Invalid login credentials"
**Solution**: 
- Make sure the user exists in Supabase Authentication
- Check you're using the correct email and password
- Password is case-sensitive

### Issue: "Network error" or "CORS error"
**Solution**:
- Check your internet connection
- Verify the Supabase project is active (not paused)
- Make sure the URL in `.env.local` is correct
- Try accessing your Supabase URL directly in browser

### Issue: Still not working after all steps
**Solution**:

1. **Check browser console** (Press F12):
   - Look for red error messages
   - Share the error message for help

2. **Check terminal output**:
   - Look for any error messages
   - Make sure the server started successfully

3. **Verify environment variables are loaded**:
   - Add this to `app/auth/login/page.tsx` temporarily:
   ```typescript
   console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
   ```
   - Check browser console to see if it shows your URL

4. **Test Supabase connection directly**:
   - Open browser console (F12)
   - Go to Network tab
   - Try to login
   - Look for failed requests to Supabase

## Quick Checklist

- [ ] Supabase project is created and active
- [ ] Database tables are created (ran schema.sql)
- [ ] User is created in Supabase Authentication
- [ ] `.env.local` has correct URL (format: `https://xxxxx.supabase.co`)
- [ ] `.env.local` has correct anon key (starts with `eyJ`)
- [ ] Development server was restarted after updating `.env.local`
- [ ] Browser cache was cleared

## Still Need Help?

If you're still having issues:

1. Check the browser console (F12) for specific error messages
2. Check the terminal for server errors
3. Verify your Supabase project is not paused
4. Try creating a new Supabase project and starting fresh

## Testing Your Supabase Connection

You can test if your Supabase credentials are working by running this in browser console (F12):

```javascript
fetch('https://your-project-ref.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'your-anon-key',
    'Authorization': 'Bearer your-anon-key'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

Replace `your-project-ref` and `your-anon-key` with your actual values. If this works, your credentials are correct!