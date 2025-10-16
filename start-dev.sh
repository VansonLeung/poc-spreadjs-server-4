#!/bin/bash

# Development startup script for Financial Spreadsheet Application
# This script starts both the WebSocket server and React client

echo "🚀 Starting Financial Spreadsheet Application..."

# Check if we're in the right directory
if [ ! -d "client" ] || [ ! -d "server" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

echo "📦 Installing dependencies if needed..."

# Install server dependencies if node_modules doesn't exist
if [ ! -d "server/node_modules" ]; then
    echo "Installing server dependencies..."
    cd server && npm install && cd ..
fi

# Install client dependencies if node_modules doesn't exist
if [ ! -d "client/node_modules" ]; then
    echo "Installing client dependencies..."
    cd client && npm install && cd ..
fi

echo "🌐 Starting WebSocket server..."
cd server && npm start &
SERVER_PID=$!

echo "⚛️  Starting React development server..."
cd client && npm run dev &
CLIENT_PID=$!

echo ""
echo "✅ Servers starting up..."
echo "   WebSocket Server: http://localhost:8080"
echo "   React Client:     http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for background processes
wait