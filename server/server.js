const WebSocket = require('ws');
const { fastify, setWebSocketServer, broadcastToWebSocketClients } = require('./mcp-server');

// Load environment variables
require('dotenv').config();

const PORT = process.env.PORT || 8080;
const MCP_PORT = process.env.MCP_PORT || 8387;
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const WEBSOCKET_MAX_CONNECTIONS = parseInt(process.env.WEBSOCKET_MAX_CONNECTIONS) || 100;

// Store connected clients (for backward compatibility)
let clients = new Set();

// Create WebSocket server (legacy implementation for direct connections)
const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server started on port ${PORT}`);
if (LOG_LEVEL === 'debug') {
  console.log(`Max connections: ${WEBSOCKET_MAX_CONNECTIONS}`);
  console.log(`Log level: ${LOG_LEVEL}`);
}

// Store connected clients
// const clients = new Set();

wss.on('connection', (ws, req) => {
  // Check connection limit
  if (clients.size >= WEBSOCKET_MAX_CONNECTIONS) {
    if (LOG_LEVEL !== 'silent') {
      console.log(`Connection rejected: Max connections (${WEBSOCKET_MAX_CONNECTIONS}) reached`);
    }
    ws.close(1008, 'Server full');
    return;
  }

  if (LOG_LEVEL === 'debug') {
    console.log(`New client connected from ${req.socket.remoteAddress}`);
  } else if (LOG_LEVEL !== 'silent') {
    console.log(`New client connected (${clients.size + 1}/${WEBSOCKET_MAX_CONNECTIONS})`);
  }

  // Add client to the set
  clients.add(ws);

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to Spreadsheet WebSocket Server',
    timestamp: new Date().toISOString()
  }));

  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      if (LOG_LEVEL === 'debug') {
        console.log('Received message:', data);
      }

      // Handle different message types
      switch (data.type) {
        case 'ping':
          ws.send(JSON.stringify({
            type: 'pong',
            timestamp: new Date().toISOString()
          }));
          break;

        case 'command_echo':
          ws.send(JSON.stringify({
            type: 'command',
            command: data.command,
            params: data.params,
            timestamp: new Date().toISOString()
          }));
          break;

        case 'command':
          // Forward command to all other clients (broadcast)
          let broadcastCount = 0;
          clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'command',
                command: data.command,
                params: data.params,
                timestamp: new Date().toISOString()
              }));
              broadcastCount++;
            }
          });

          // Send acknowledgment to sender
          ws.send(JSON.stringify({
            type: 'command_ack',
            command: data.command,
            status: 'sent',
            broadcastCount: broadcastCount,
            timestamp: new Date().toISOString()
          }));

          if (LOG_LEVEL === 'debug') {
            console.log(`Command "${data.command}" broadcasted to ${broadcastCount} clients`);
          }
          break;

        case 'command_ack':
          // Just log acknowledgment messages
          if (LOG_LEVEL === 'debug') {
            console.log('Received command acknowledgment:', data);
          }
          break;

        default:
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Unknown message type',
            receivedType: data.type,
            timestamp: new Date().toISOString()
          }));
      }
    } catch (error) {
      console.error('Error parsing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid JSON format',
        timestamp: new Date().toISOString()
      }));
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    clients.delete(ws);
    if (LOG_LEVEL !== 'silent') {
      console.log(`Client disconnected (${clients.size}/${WEBSOCKET_MAX_CONNECTIONS})`);
    }
  });

  // Handle errors
  ws.on('error', (error) => {
    clients.delete(ws);
    if (LOG_LEVEL !== 'silent') {
      console.error('WebSocket client error:', error.message);
    }
  });
});

// Handle server errors
wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  if (LOG_LEVEL !== 'silent') {
    console.log('Shutting down servers...');
  }

  // Close WebSocket server
  wss.close();

  // Close Fastify server
  await fastify.close();

  if (LOG_LEVEL !== 'silent') {
    console.log('Servers closed');
  }
  process.exit(0);
});

// Start the MCP Fastify server
async function startServers() {
  try {
    // Start Fastify server with MCP endpoints first
    await fastify.listen({ port: MCP_PORT, host: '0.0.0.0' });
    console.log(`MCP server started on port ${MCP_PORT}`);

    // Connect MCP server to the WebSocket server instance
    setWebSocketServer(wss, clients);

    if (LOG_LEVEL !== 'silent') {
      console.log('Spreadsheet MCP + WebSocket Server is running...');
      console.log('Available MCP endpoints:');
      console.log(`  GET  /health - Health check`);
      console.log(`  GET  /mcp/spreadsheet/status - Get server status`);
      console.log(`  GET  /mcp/spreadsheet/operations - List available operations`);
      console.log(`  POST /mcp/spreadsheet/set-cell - Set cell value`);
      console.log(`  POST /mcp/spreadsheet/set-formula - Set cell formula`);
      console.log(`  POST /mcp/spreadsheet/add-sheet - Add new sheet`);
      console.log(`  POST /mcp/spreadsheet/set-active-sheet - Set active sheet`);
      console.log(`  POST /mcp/spreadsheet/clear-sheet - Clear sheet`);
      console.log(`  POST /mcp/spreadsheet/load-template - Load template`);
      console.log('');
      console.log('WebSocket connections available on port', PORT);
      console.log('MCP REST API available on port', MCP_PORT);
    }
  } catch (err) {
    console.error('Error starting servers:', err);
    process.exit(1);
  }
}

// Start MCP server first, then WebSocket server will be connected
startServers();