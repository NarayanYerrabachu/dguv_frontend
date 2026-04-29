#!/bin/bash

echo "🚀 Starting DGUV Chat (Next.js)..."
echo ""

# Change to project directory
cd "$(dirname "$0")/.."

# Function to find free port
find_free_port() {
  local port=$1
  local max_port=$((port + 10))

  while [ $port -le $max_port ]; do
    if ! lsof -i:$port >/dev/null 2>&1; then
      echo $port
      return 0
    fi
    port=$((port + 1))
  done

  echo "❌ Could not find free port between 3000-$max_port"
  exit 1
}

# Try to find a free port starting from 3000
PORT=$(find_free_port 3000)

if [ $PORT -ne 3000 ]; then
  echo "⚠️  Port 3000 is busy, using port $PORT instead"
  export PORT=$PORT
else
  echo "✅ Using default port 3000"
fi

echo ""

# Check dependencies
node scripts/check-deps.js
if [ $? -ne 0 ]; then
  exit 1
fi

# Check environment
node scripts/check-env.js
if [ $? -ne 0 ]; then
  exit 1
fi

# Start the app
echo "🎯 Starting development server on http://localhost:$PORT"
echo ""
PORT=$PORT npm run dev
