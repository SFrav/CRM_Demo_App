# CRM Demo - Complete Setup Guide

This guide will walk you through setting up the CRM demo from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Database Setup](#database-setup)
5. [Environment Variables](#environment-variables)
6. [Running the Application](#running-the-application)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for version control
- A **Supabase** account ([Sign up](https://supabase.com))
- A **Vercel** account for deployment (optional)

## Project Setup

### 1. Clone or Download the Project

```bash
# If using Git
git clone <repository-url>
cd crm-demo

# Or download and extract the ZIP file
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

This will install all required packages including:
- Next.js 14
- React 18
- Supabase client
- Tailwind CSS
- TypeScript
- And all other dependencies

## Supabase Configuration

### 1. Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in the project details:
   - **Name**: CRM Demo (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (2-3 minutes)

### 2. Get Your API Keys

1. In your Supabase project dashboard, click on the "Settings" icon (gear icon)
2. Navigate to "API" in the left sidebar
3. You'll need two values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`
4. Keep these values handy for the next step

## Database Setup

### 1. Access the SQL Editor

1. In your Supabase dashboard, click on "SQL Editor" in the left sidebar
2. Click "New query"

### 2. Run the Database Schema

1. Open the file `lib/database/schema.sql` in your project
2. Copy the entire contents
3. Paste it into the SQL Editor in Supabase
4. Click "Run" or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

This will create:
- All necessary tables (tasks, leads, team_members, activity_logs)
- Indexes for performance
- Row Level Security policies
- Sample data for testing
- Database triggers

### 3. Verify the Setup

1. Click on "Table Editor" in the left sidebar
2. You should see 4 tables:
   - `tasks` (8 sample tasks)
   - `leads` (8 sample leads)
   - `team_members` (8 sample members)
   - `activity_logs` (empty initially)

## Environment Variables

### 1. Create Environment File

Create a file named `.env.local` in the root of your project:

```bash
# On Windows
copy .env.example .env.local

# On Mac/Linux
cp .env.example .env.local
```

### 2. Add Your Supabase Credentials

Open `.env.local` and replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Never commit `.env.local` to version control!

## Running the Application

### 1. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

### 2. Login to the Application

1. Open your browser and navigate to `http://localhost:3000`
2. You'll be redirected to the login page
3. Use these demo credentials:
   - **Email**: `admin@demo.com`
   - **Password**: `password123`

### 3. Create Your First User (Optional)

If you want to create your own user account:

1. Go to your Supabase dashboard
2. Click on "Authentication" in the left sidebar
3. Click "Add user" → "Create new user"
4. Enter email and password
5. Click "Create user"

## Testing

### Test Each Module

1. **Dashboard**: Should show statistics and recent activities
2. **Tasks**: 
   - View all tasks
   - Create a new task
   - Edit an existing task
   - Delete a task
   - Use filters and search
3. **Leads**:
   - View all leads
   - Create a new lead with phone number
   - Edit lead status
   - Delete leads
   - Test pagination
4. **Team**:
   - View team members
   - Add new member
   - Edit member details
   - Delete members
5. **Reports**: View analytics and charts
6. **Logs**: Check activity logs

### Performance Testing

1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Run an audit
4. Check performance scores

## Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**:
   - In Vercel project settings, go to "Environment Variables"
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Use the same values from your `.env.local`

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-project.vercel.app`

### Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions

## Troubleshooting

### Common Issues

#### 1. "Cannot connect to Supabase"

**Solution**:
- Check your `.env.local` file has correct credentials
- Verify the Supabase project is active
- Check your internet connection
- Restart the development server

#### 2. "No data showing in tables"

**Solution**:
- Verify you ran the `schema.sql` script
- Check Supabase Table Editor to confirm data exists
- Check browser console for errors
- Verify RLS policies are set correctly

#### 3. "Login not working"

**Solution**:
- Verify user exists in Supabase Authentication
- Check email and password are correct
- Look for errors in browser console
- Verify Supabase URL and keys are correct

#### 4. "Build errors"

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

#### 5. "TypeScript errors"

**Solution**:
- Ensure all dependencies are installed
- Check `tsconfig.json` is correct
- Run `npm install` again
- Restart your IDE/editor

### Getting Help

If you encounter issues not covered here:

1. Check the browser console for errors
2. Check the terminal for server errors
3. Review Supabase logs in the dashboard
4. Check the README.md for additional information

## Next Steps

After successful setup:

1. **Customize the UI**: Modify colors in `tailwind.config.js`
2. **Add Features**: Extend the database schema and add new modules
3. **Configure Email**: Set up email templates in Supabase
4. **Add Analytics**: Integrate Google Analytics or similar
5. **Enhance Security**: Configure RLS policies for production
6. **Optimize Performance**: Add caching and optimize queries

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

### Project Structure
```
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main application
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── lib/                  # Utilities
│   ├── database/         # Database schema
│   ├── supabase/         # Supabase clients
│   └── types/            # TypeScript types
└── public/               # Static assets
```

### Key Features
- Server-side rendering for fast initial load
- Optimistic UI updates
- Debounced search (300ms)
- Efficient pagination
- Real-time data synchronization
- Responsive design
- Accessible forms

## Performance Optimizations

1. **Database Indexes**: All frequently queried columns are indexed
2. **Server Components**: Used where possible for better performance
3. **Debounced Search**: Reduces unnecessary API calls
4. **Pagination**: Handles large datasets efficiently
5. **Optimistic Updates**: Instant UI feedback
6. **Code Splitting**: Automatic with Next.js
7. **Image Optimization**: Built-in with Next.js

## Security Best Practices

1. **Row Level Security**: Enabled on all tables
2. **Environment Variables**: Never commit secrets
3. **Input Validation**: All forms validate input
4. **CSRF Protection**: Built-in with Next.js
5. **Secure Cookies**: HTTP-only cookies for auth
6. **SQL Injection Prevention**: Supabase client handles this

---

**Congratulations!** Your CRM demo is now set up and running. Happy coding! 🎉