#!/bin/bash

echo "🛑 Stopping DGUV Chat (Next.js)..."
echo ""

# Kill Next.js dev server
echo "   Stopping Next.js dev server..."
pkill -f "next dev" 2>/dev/null && echo "   ✅ Next.js stopped" || echo "   ℹ️  No Next.js process found"

# Kill Next.js production server
pkill -f "next start" 2>/dev/null && echo "   ✅ Next.js production stopped" || true

# Kill any process on port 3000
echo ""
echo "   Freeing port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo "   ✅ Port 3000 freed" || echo "   ℹ️  Port 3000 already free"

echo ""
echo "✅ All processes stopped!"
echo ""
