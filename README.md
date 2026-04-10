# CRM Demo - Fast & Responsive Customer Relationship Management

A high-performance CRM demo built with Next.js, Supabase, and Tailwind CSS. This project demonstrates modern web development practices with a focus on speed, scalability, and user experience.

## 🚀 Features

### Core Modules
- **Task Management** - Create, update, and track tasks with status and priority
- **Lead Management** - Manage sales leads with conversion tracking
- **Team Management** - Organize team members with roles and departments
- **Reports & Analytics** - Visual dashboards with key performance metrics
- **Activity Logs** - Track all system activities and changes

### UI/UX Features
- **Fast Page Transitions** - Optimized for instant navigation
- **Responsive Design** - Works perfectly on desktop and mobile
- **Real-time Updates** - Live data synchronization
- **Advanced Filtering** - Search, sort, and filter all data
- **Bulk Operations** - Select and manage multiple items
- **Phone Input** - International phone number support
- **Modal Forms** - Clean, accessible form interfaces

### Performance Features
- **Server Components** - Optimized rendering strategy
- **Database Indexing** - Fast query performance
- **Debounced Search** - Efficient search implementation
- **Pagination** - Handle large datasets efficiently
- **Optimistic Updates** - Instant UI feedback

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Styling**: Tailwind CSS, Headless UI
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Phone Input**: libphonenumber-js
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd crm-demo
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up Database
1. Go to your Supabase project dashboard and copy your project ID from the overview or settings tab
2. Run from terminal in repo path `npx supabase link --project-ref <ref string>`. You may need to run `npm install supabase --save-dev` first.
3. Run from terminal in repo path `npx supabase migration new 0init`
4. Copy and paste the contents of `lib/database/schema.sql` into the newly created supabase/migrations/<timestamp>0init.sql
5. Run `npx supabase db push`

OR

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `lib/database/schema.sql`
4. Run the SQL to create tables, indexes, and sample data

### 5. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Close using ctrl-c. If using ctrl-z in Linux, then run `fuser -k 3000/tcp` to close the port

### 6. Login to the Demo

Add a new user via the Supabase dashboard authentication tab. For example, use:
- **Email**: admin@demo.com
- **Password**: password123

## 🏗 Project Structure

```
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main CRM modules
│   │   ├── tasks/         # Task management
│   │   ├── leads/         # Lead management
│   │   ├── team/          # Team management
│   │   ├── reports/       # Analytics & reports
│   │   └── logs/          # Activity logs
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── lib/                  # Utilities and configurations
│   ├── database/         # Database schema
│   ├── supabase/         # Supabase clients
│   └── types/            # TypeScript types
└── public/               # Static assets
```

## 🎯 Key Features Explained

### Authentication
- Fast login with Supabase Auth
- Automatic session management
- Protected routes with middleware
- Secure cookie handling

### Task Management
- CRUD operations with real-time updates
- Status tracking (Todo, In Progress, Completed)
- Priority levels (Low, Medium, High)
- Due date management
- Bulk operations

### Lead Management
- Complete lead lifecycle tracking
- Status pipeline (New → Contacted → Qualified → Converted/Lost)
- Value tracking and conversion metrics
- Source attribution
- International phone number support

### Team Management
- Role and department organization
- Contact information management
- Status tracking (Active/Inactive)
- Grid and list views
- Fault tolerant search on team member names

### Reports & Analytics
- Real-time dashboard metrics
- Conversion rate tracking
- Task completion analytics
- Visual progress indicators
- Performance summaries

### Performance Optimizations
- Server-side rendering where appropriate
- Database query optimization with indexes
- Debounced search (300ms delay)
- Efficient pagination
- Optimistic UI updates
- Image optimization
- Code splitting

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Management
- Schema is in `lib/database/schema.sql`
- Types are auto-generated in `lib/types/database.ts`
- Use Supabase dashboard for data management

### Adding New Features
1. Create database tables/columns in Supabase
2. Update TypeScript types in `lib/types/database.ts`
3. Create UI components in `components/`
4. Add pages in `app/dashboard/`
5. Implement CRUD operations with Supabase client

## 📊 Performance Metrics

This CRM is optimized for:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

## 🔒 Security Features

- Row Level Security (RLS) enabled
- Secure authentication with Supabase
- Protected API routes
- Input validation and sanitization
- CSRF protection
- Secure cookie handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Open an issue on GitHub

---

Built with ❤️ using Next.js, Supabase, and Tailwind CSS