#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Checking dependencies...\n');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');

// Check if package.json exists
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found!');
  process.exit(1);
}

// Check if node_modules exists
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 node_modules not found. Installing dependencies...\n');
  try {
    execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('\n✅ Dependencies installed successfully!\n');
  } catch (error) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
  }
} else {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

  let missingDeps = [];

  for (const dep in dependencies) {
    const depPath = path.join(nodeModulesPath, dep);
    if (!fs.existsSync(depPath)) {
      missingDeps.push(dep);
    }
  }

  if (missingDeps.length > 0) {
    console.log(`⚠️  Missing dependencies: ${missingDeps.join(', ')}\n`);
    console.log('📦 Installing missing dependencies...\n');
    try {
      execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
      console.log('\n✅ Dependencies installed successfully!\n');
    } catch (error) {
      console.error('❌ Failed to install dependencies');
      process.exit(1);
    }
  } else {
    console.log('✅ All dependencies are installed!\n');
  }
}
