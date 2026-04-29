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

# === CORS / Security ===
ALLOWED_DOMAINS=localhost
ALLOW_HTTP=true
ALLOW_LOCALHOST=true
ALLOWED_METHODS=GET,POST,OPTIONS

# === Auth (empty = simulation mode) ===
# Leave empty for simulation mode (test@test.com / 1234)
AUTH_URL=
AUTH_HEADER=
JWT_SECRET=avatar-webcomp-jwt-secret
JWT_EXPIRES_IN=8h

# === LLM Backend ===
# Leave empty for echo/mock mode
LLM_URL=
LLM_HEADER=

# === Transcription (V3 preferred) ===
# Leave empty for mock mode
STT_FORWARD_URL=
STT_FORWARD_TOKEN=

# === Transcription (V2 legacy) ===
TRANSCRIPTION_URL=
TRANSCRIPTION_HEADER=

# === HeyGen Video Avatar ===
# Required for /api/get-access-token
HEYGEN_API_KEY=
HEYGEN_AVATAR_ID=
HEYGEN_VOICE_ID=
HEYGEN_QUALITY=high
AVATAR_LANGUAGE=de
AVATAR_CONTEXT_ID=

# === Voice ===
VOICE_RATE=1.2

# === Throttle ===
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
THROTTLE_AUTH_TTL=60000
THROTTLE_AUTH_LIMIT=100

# === Theme Overrides (optional) ===
# THEME_tenantId=dguv
# THEME_feedbackUrl=https://example.com/feedback
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
console.log('   🔐 Authentication:');
console.log(`      ${envVars.AUTH_URL ? '✅' : '⚠️ '} AUTH_URL: ${envVars.AUTH_URL || '(mock mode)'}`);
console.log(`      ${envVars.AUTH_HEADER ? '✅' : '⚠️ '} AUTH_HEADER: ${envVars.AUTH_HEADER ? 'configured' : '(mock mode)'}`);

console.log('\n   🤖 LLM Backend:');
console.log(`      ${envVars.LLM_URL ? '✅' : '⚠️ '} LLM_URL: ${envVars.LLM_URL || '(echo mode)'}`);
console.log(`      ${envVars.LLM_HEADER ? '✅' : '⚠️ '} LLM_HEADER: ${envVars.LLM_HEADER ? 'configured' : '(echo mode)'}`);

console.log('\n   🎤 Transcription:');
console.log(`      ${envVars.STT_FORWARD_URL ? '✅' : '⚠️ '} STT_FORWARD_URL: ${envVars.STT_FORWARD_URL || '(mock mode)'}`);
console.log(`      ${envVars.STT_FORWARD_TOKEN ? '✅' : '⚠️ '} STT_FORWARD_TOKEN: ${envVars.STT_FORWARD_TOKEN ? 'configured' : '(mock mode)'}`);

console.log('\n   🎬 HeyGen:');
console.log(`      ${envVars.HEYGEN_API_KEY ? '✅' : '⚠️ '} HEYGEN_API_KEY: ${envVars.HEYGEN_API_KEY ? 'configured' : 'not set'}`);
console.log(`      ${envVars.HEYGEN_AVATAR_ID ? '✅' : '⚠️ '} HEYGEN_AVATAR_ID: ${envVars.HEYGEN_AVATAR_ID ? 'configured' : 'not set'}`);
console.log(`      ${envVars.HEYGEN_VOICE_ID ? '✅' : '⚠️ '} HEYGEN_VOICE_ID: ${envVars.HEYGEN_VOICE_ID ? 'configured' : 'not set'}`);

console.log('\n💡 Note: Empty URLs enable mock/simulation modes for development\n');

// Check for common issues
const warnings = [];

if (!envVars.JWT_SECRET || envVars.JWT_SECRET === 'avatar-webcomp-jwt-secret') {
  warnings.push('JWT_SECRET is using default value. Change it in production!');
}

if (envVars.NODE_ENV === 'production') {
  if (!envVars.LLM_URL) {
    warnings.push('LLM_URL is not set in production mode!');
  }
  if (!envVars.AUTH_URL) {
    warnings.push('AUTH_URL is not set in production mode!');
  }
}

if (warnings.length > 0) {
  console.log('⚠️  Warnings:\n');
  warnings.forEach(warning => console.log(`   - ${warning}`));
  console.log('');
}

console.log('✅ Environment check complete!\n');
