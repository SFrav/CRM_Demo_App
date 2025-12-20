#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking CRM Demo Setup...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  console.log('   Create it by copying .env.example and adding your Supabase credentials\n');
  process.exit(1);
}

// Read environment variables
const envContent = fs.readFileSync(envPath, 'utf8');
const hasUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=') && !envContent.includes('your-project-id');
const hasKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=') && !envContent.includes('your-anon-key');

console.log('📁 Environment Variables:');
console.log(`   SUPABASE_URL: ${hasUrl ? '✅' : '❌'}`);
console.log(`   SUPABASE_KEY: ${hasKey ? '✅' : '❌'}`);

if (!hasUrl || !hasKey) {
  console.log('\n❌ Please update .env.local with your actual Supabase credentials');
  console.log('   1. Go to https://supabase.com/dashboard');
  console.log('   2. Select your project');
  console.log('   3. Go to Settings → API');
  console.log('   4. Copy Project URL and anon public key');
  console.log('   5. Update .env.local file\n');
  process.exit(1);
}

// Check if required files exist
const requiredFiles = [
  'lib/database/schema.sql',
  'lib/supabase/client.ts',
  'lib/supabase/server.ts',
  'middleware.ts',
  'app/dashboard/page.tsx'
];

console.log('\n📄 Required Files:');
let allFilesExist = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`   ${file}: ${exists ? '✅' : '❌'}`);
  if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing');
  process.exit(1);
}

// Check package.json dependencies
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const requiredDeps = [
    'next',
    'react',
    '@supabase/supabase-js',
    'tailwindcss',
    'typescript'
  ];
  
  console.log('\n📦 Dependencies:');
  let allDepsInstalled = true;
  requiredDeps.forEach(dep => {
    const installed = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
    console.log(`   ${dep}: ${installed ? '✅' : '❌'}`);
    if (!installed) allDepsInstalled = false;
  });
  
  if (!allDepsInstalled) {
    console.log('\n❌ Some dependencies are missing. Run: npm install');
    process.exit(1);
  }
}

console.log('\n✅ Setup looks good!');
console.log('\n🚀 Next steps:');
console.log('   1. Make sure you ran the SQL script in Supabase');
console.log('   2. Created a user in Supabase Authentication');
console.log('   3. Run: npm run dev');
console.log('   4. Open: http://localhost:3000');
console.log('   5. Login with your credentials\n');

console.log('📚 For detailed instructions, see:');
console.log('   - QUICK_START.md (5-minute setup)');
console.log('   - SETUP_GUIDE.md (comprehensive guide)');
console.log('   - README.md (project overview)\n');