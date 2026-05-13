#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking environment configuration...\n');

const envLocalPath = path.join(__dirname, '..', '.env.local');
const envExamplePath = path.join(__dirname, '..', '.env.example');

// Check if .env.local exists
if (!fs.existsSync(envLocalPath)) {
  console.log('⚠️  .env.local not found!\n');

  // Try to create from .env.example
  if (fs.existsSync(envExamplePath)) {
    console.log('📝 Creating .env.local from .env.example...\n');
    fs.copyFileSync(envExamplePath, envLocalPath);
    console.log('✅ .env.local created!\n');
  } else {
    console.log('📝 Creating default .env.local...\n');

    const defaultEnv = `# === Server ===
PORT=3000
NODE_ENV=development

# === LLM Backend ===
# Leave empty for echo/mock mode
LLM_URL=
LLM_HEADER=
BUILD_TIME=${new Date().toISOString()}
`;

    fs.writeFileSync(envLocalPath, defaultEnv);
    console.log('✅ Default .env.local created!\n');
  }
}

// Parse and validate .env.local
const envContent = fs.readFileSync(envLocalPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

console.log('📋 Current Configuration:\n');
console.log('   🤖 LLM Backend:');
console.log(`      ${envVars.LLM_URL ? '✅' : '⚠️ '} LLM_URL: ${envVars.LLM_URL || '(echo mode)'}`);
console.log(`      ${envVars.LLM_HEADER ? '✅' : '⚠️ '} LLM_HEADER: ${envVars.LLM_HEADER ? 'configured' : '(echo mode)'}`);

console.log('\n💡 Note: Empty LLM_URL enables echo/mock mode for development\n');

// Check for common issues
const warnings = [];

if (envVars.NODE_ENV === 'production') {
  if (!envVars.LLM_URL) {
    warnings.push('LLM_URL is not set in production mode!');
  }
}

if (warnings.length > 0) {
  console.log('⚠️  Warnings:\n');
  warnings.forEach(warning => console.log(`   - ${warning}`));
  console.log('');
}

console.log('✅ Environment check complete!\n');
