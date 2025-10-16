const fastify = require('fastify')({ logger: true });
const WebSocket = require('ws');

// WebSocket server and clients will be set from the main server
let wss;
let clients = new Set();

// Function to set WebSocket server instance from main server
function setWebSocketServer(webSocketServer, clientSet) {
  wss = webSocketServer;
  clients = clientSet;
  console.log('MCP server connected to WebSocket server, clients:', clients.size);
}

// Function to broadcast message to all connected WebSocket clients
function broadcastToWebSocketClients(message) {
  console.log('Broadcasting message to', clients.size, 'clients:', message);
  let broadcastCount = 0;
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
      broadcastCount++;
    }
  });
  console.log('Broadcast completed, sent to', broadcastCount, 'clients');
  return broadcastCount;
}

// MCP Endpoints for Spreadsheet Operations

// Get spreadsheet status
fastify.get('/mcp/spreadsheet/status', async (request, reply) => {
  const connectedClients = clients.size;
  return {
    status: 'active',
    connectedClients,
    timestamp: new Date().toISOString()
  };
});

// Set cell data
fastify.post('/mcp/spreadsheet/set-cell', async (request, reply) => {
  const { row, col, value, sheetIndex = 0 } = request.body;

  if (row === undefined || col === undefined || value === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameters: row, col, value'
    });
  }

  const message = {
    type: 'command',
    command: 'setProcessedData',
    params: { sheetIndex, row, col, values: [[value]] },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'setProcessedData',
    params: { sheetIndex, row, col, values: [[value]] },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Set formula
fastify.post('/mcp/spreadsheet/set-formula', async (request, reply) => {
  const { row, col, formula, sheetIndex = 0 } = request.body;

  if (row === undefined || col === undefined || formula === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameters: row, col, formula'
    });
  }

  const message = {
    type: 'command',
    command: 'setRawData',
    params: { sheetIndex, row, col, formulas: [[formula]] },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'setRawData',
    params: { sheetIndex, row, col, formulas: [[formula]] },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Add new sheet
fastify.post('/mcp/spreadsheet/add-sheet', async (request, reply) => {
  const { sheetName } = request.body;

  const message = {
    type: 'command',
    command: 'addSheet',
    params: { sheetName },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'addSheet',
    params: { sheetName },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Set active sheet
fastify.post('/mcp/spreadsheet/set-active-sheet', async (request, reply) => {
  const { sheetIndex } = request.body;

  if (sheetIndex === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameter: sheetIndex'
    });
  }

  const message = {
    type: 'command',
    command: 'setActiveSheetIndex',
    params: { sheetIndex },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'setActiveSheetIndex',
    params: { sheetIndex },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Clear sheet
fastify.post('/mcp/spreadsheet/clear-sheet', async (request, reply) => {
  const { sheetIndex = 0 } = request.body;

  const message = {
    type: 'command',
    command: 'clearSheets',
    params: { sheetIndex },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'clearSheets',
    params: { sheetIndex },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Set sheet JSON
fastify.post('/mcp/spreadsheet/set-sheet-json', async (request, reply) => {
  const { json, sheetIndex = 0 } = request.body;

  if (!json) {
    return reply.code(400).send({
      error: 'Missing required parameter: json'
    });
  }

  const message = {
    type: 'command',
    command: 'setSheetJSON',
    params: { sheetIndex, template: json },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'setSheetJSON',
    params: { sheetIndex, template: json },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Remove sheet
fastify.post('/mcp/spreadsheet/remove-sheet', async (request, reply) => {
  const { sheet } = request.body;

  if (sheet === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameter: sheet'
    });
  }

  const message = {
    type: 'command',
    command: 'removeSheet',
    params: { sheet },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'removeSheet',
    params: { sheet },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Set active sheet index
fastify.post('/mcp/spreadsheet/set-active-sheet-index', async (request, reply) => {
  const { index } = request.body;

  if (index === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameter: index'
    });
  }

  const message = {
    type: 'command',
    command: 'setActiveSheetIndex',
    params: { index },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'setActiveSheetIndex',
    params: { index },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Clear sheets
fastify.post('/mcp/spreadsheet/clear-sheets', async (request, reply) => {
  const message = {
    type: 'command',
    command: 'clearSheets',
    params: {},
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'clearSheets',
    params: {},
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Set sheet CSV
fastify.post('/mcp/spreadsheet/set-sheet-csv', async (request, reply) => {
  const { csv, sheetName } = request.body;

  if (!csv) {
    return reply.code(400).send({
      error: 'Missing required parameter: csv'
    });
  }

  const message = {
    type: 'command',
    command: 'setSheetCSV',
    params: { csv, sheetName },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'setSheetCSV',
    params: { csv, sheetName },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Get sheet CSV of range
fastify.get('/mcp/spreadsheet/get-sheet-csv-of-range', async (request, reply) => {
  const { startRow, startCol, rowCount, colCount, newLine = '\r', delimiter = ',', sheetName } = request.query;

  if (startRow === undefined || startCol === undefined || rowCount === undefined || colCount === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameters: startRow, startCol, rowCount, colCount'
    });
  }

  return {
    success: true,
    command: 'getSheetCSVOfRange',
    params: { startRow: parseInt(startRow), startCol: parseInt(startCol), rowCount: parseInt(rowCount), colCount: parseInt(colCount), newLine, delimiter, sheetName },
    result: '', // This would need to be implemented to query actual spreadsheet state
    timestamp: new Date().toISOString(),
    note: 'This endpoint requires server-side spreadsheet state access'
  };
});

// Set sheet CSV of range
fastify.post('/mcp/spreadsheet/set-sheet-csv-of-range', async (request, reply) => {
  const { startRow, startCol, csv, newLine = '\r', delimiter = ',', sheetName } = request.body;

  if (startRow === undefined || startCol === undefined || !csv) {
    return reply.code(400).send({
      error: 'Missing required parameters: startRow, startCol, csv'
    });
  }

  const message = {
    type: 'command',
    command: 'setSheetCSVOfRange',
    params: { startRow, startCol, csv, newLine, delimiter, sheetName },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'setSheetCSVOfRange',
    params: { startRow, startCol, csv, newLine, delimiter, sheetName },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Set processed data
fastify.post('/mcp/spreadsheet/set-processed-data', async (request, reply) => {
  const { startRow, startCol, values, sheetName } = request.body;

  if (startRow === undefined || startCol === undefined || !values) {
    return reply.code(400).send({
      error: 'Missing required parameters: startRow, startCol, values'
    });
  }

  const message = {
    type: 'command',
    command: 'setProcessedData',
    params: { startRow, startCol, values, sheetName },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'setProcessedData',
    params: { startRow, startCol, values, sheetName },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Set raw data (formulas)
fastify.post('/mcp/spreadsheet/set-raw-data', async (request, reply) => {
  const { startRow, startCol, formulas, sheetName } = request.body;

  if (startRow === undefined || startCol === undefined || !formulas) {
    return reply.code(400).send({
      error: 'Missing required parameters: startRow, startCol, formulas'
    });
  }

  const message = {
    type: 'command',
    command: 'setRawData',
    params: { startRow, startCol, formulas, sheetName },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'setRawData',
    params: { startRow, startCol, formulas, sheetName },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Set styles and merges
fastify.post('/mcp/spreadsheet/set-styles-merges', async (request, reply) => {
  const { startRow, startCol, rowCount, colCount, styles, merges, sheetName } = request.body;

  if (startRow === undefined || startCol === undefined || rowCount === undefined || colCount === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameters: startRow, startCol, rowCount, colCount'
    });
  }

  const message = {
    type: 'command',
    command: 'setStylesAndMerges',
    params: { startRow, startCol, rowCount, colCount, styles, merges, sheetName },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'setStylesAndMerges',
    params: { startRow, startCol, rowCount, colCount, styles, merges, sheetName },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Set charts
fastify.post('/mcp/spreadsheet/set-charts', async (request, reply) => {
  const { chartsData, sheetName } = request.body;

  const message = {
    type: 'command',
    command: 'setCharts',
    params: { chartsData, sheetName },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'setCharts',
    params: { chartsData, sheetName },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Add rows
fastify.post('/mcp/spreadsheet/add-rows', async (request, reply) => {
  const { row, count, sheetName } = request.body;

  if (row === undefined || count === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameters: row, count'
    });
  }

  const message = {
    type: 'command',
    command: 'addRows',
    params: { row, count, sheetName },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'addRows',
    params: { row, count, sheetName },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Add columns
fastify.post('/mcp/spreadsheet/add-columns', async (request, reply) => {
  const { col, count, sheetName } = request.body;

  if (col === undefined || count === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameters: col, count'
    });
  }

  const message = {
    type: 'command',
    command: 'addColumns',
    params: { col, count, sheetName },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'addColumns',
    params: { col, count, sheetName },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Delete rows
fastify.post('/mcp/spreadsheet/delete-rows', async (request, reply) => {
  const { row, count, sheetName } = request.body;

  if (row === undefined || count === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameters: row, count'
    });
  }

  const message = {
    type: 'command',
    command: 'deleteRows',
    params: { row, count, sheetName },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'deleteRows',
    params: { row, count, sheetName },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Delete columns
fastify.post('/mcp/spreadsheet/delete-columns', async (request, reply) => {
  const { col, count, sheetName } = request.body;

  if (col === undefined || count === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameters: col, count'
    });
  }

  const message = {
    type: 'command',
    command: 'deleteColumns',
    params: { col, count, sheetName },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'deleteColumns',
    params: { col, count, sheetName },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Auto fit row
fastify.post('/mcp/spreadsheet/auto-fit-row', async (request, reply) => {
  const { row, sheetName } = request.body;

  if (row === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameter: row'
    });
  }

  const message = {
    type: 'command',
    command: 'autoFitRow',
    params: { row, sheetName },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'autoFitRow',
    params: { row, sheetName },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Auto fit column
fastify.post('/mcp/spreadsheet/auto-fit-column', async (request, reply) => {
  const { col, sheetName } = request.body;

  if (col === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameter: col'
    });
  }

  const message = {
    type: 'command',
    command: 'autoFitColumn',
    params: { col, sheetName },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'autoFitColumn',
    params: { col, sheetName },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Set row height
fastify.post('/mcp/spreadsheet/set-row-height', async (request, reply) => {
  const { row, height, sheetName } = request.body;

  if (row === undefined || height === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameters: row, height'
    });
  }

  const message = {
    type: 'command',
    command: 'setRowHeight',
    params: { row, height, sheetName },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'setRowHeight',
    params: { row, height, sheetName },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Set column width
fastify.post('/mcp/spreadsheet/set-column-width', async (request, reply) => {
  const { col, width, sheetName } = request.body;

  if (col === undefined || width === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameters: col, width'
    });
  }

  const message = {
    type: 'command',
    command: 'setColumnWidth',
    params: { col, width, sheetName },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'setColumnWidth',
    params: { col, width, sheetName },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Set formatter
fastify.post('/mcp/spreadsheet/set-formatter', async (request, reply) => {
  const { row, col, format, sheetName } = request.body;

  if (row === undefined || col === undefined || format === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameters: row, col, format'
    });
  }

  const message = {
    type: 'command',
    command: 'setFormatter',
    params: { row, col, format, sheetName },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'setFormatter',
    params: { row, col, format, sheetName },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Copy to
fastify.post('/mcp/spreadsheet/copy-to', async (request, reply) => {
  const { fromRow, fromColumn, toRow, toColumn, rowCount, columnCount, option, sheetName } = request.body;

  if (fromRow === undefined || fromColumn === undefined || toRow === undefined || toColumn === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameters: fromRow, fromColumn, toRow, toColumn'
    });
  }

  const message = {
    type: 'command',
    command: 'copyTo',
    params: { fromRow, fromColumn, toRow, toColumn, rowCount, columnCount, option, sheetName },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'copyTo',
    params: { fromRow, fromColumn, toRow, toColumn, rowCount, columnCount, option, sheetName },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// Reset merging status
fastify.post('/mcp/spreadsheet/reset-merging-status', async (request, reply) => {
  const { startRow, startCol, rowCount, colCount, sheetName } = request.body;

  if (startRow === undefined || startCol === undefined || rowCount === undefined || colCount === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameters: startRow, startCol, rowCount, colCount'
    });
  }

  const message = {
    type: 'command',
    command: 'resetMergingStatus',
    params: { startRow, startCol, rowCount, colCount, sheetName },
    timestamp: new Date().toISOString(),
    source: 'mcp'
  };

  const broadcastCount = broadcastToWebSocketClients(message);

  return {
    success: true,
    command: 'resetMergingStatus',
    params: { startRow, startCol, rowCount, colCount, sheetName },
    broadcastCount,
    timestamp: new Date().toISOString()
  };
});

// GET endpoints for retrieving data

// Get sheet names
fastify.get('/mcp/spreadsheet/get-sheet-names', async (request, reply) => {
  // This endpoint doesn't broadcast commands, just returns information
  return {
    success: true,
    command: 'getSheetNames',
    result: [], // This would need to be implemented to query actual spreadsheet state
    timestamp: new Date().toISOString(),
    note: 'This endpoint requires server-side spreadsheet state access'
  };
});

// Get sheet count
fastify.get('/mcp/spreadsheet/get-sheet-count', async (request, reply) => {
  return {
    success: true,
    command: 'getSheetCount',
    result: 0, // This would need to be implemented to query actual spreadsheet state
    timestamp: new Date().toISOString(),
    note: 'This endpoint requires server-side spreadsheet state access'
  };
});

// Get active sheet
fastify.get('/mcp/spreadsheet/get-active-sheet', async (request, reply) => {
  return {
    success: true,
    command: 'getActiveSheet',
    result: null, // This would need to be implemented to query actual spreadsheet state
    timestamp: new Date().toISOString(),
    note: 'This endpoint requires server-side spreadsheet state access'
  };
});

// Get active sheet index
fastify.get('/mcp/spreadsheet/get-active-sheet-index', async (request, reply) => {
  return {
    success: true,
    command: 'getActiveSheetIndex',
    result: 0, // This would need to be implemented to query actual spreadsheet state
    timestamp: new Date().toISOString(),
    note: 'This endpoint requires server-side spreadsheet state access'
  };
});

// Get sheet JSON
fastify.get('/mcp/spreadsheet/get-sheet-json', async (request, reply) => {
  const { sheetName } = request.query;

  return {
    success: true,
    command: 'getSheetJSON',
    params: { sheetName },
    result: null, // This would need to be implemented to query actual spreadsheet state
    timestamp: new Date().toISOString(),
    note: 'This endpoint requires server-side spreadsheet state access'
  };
});

// Get sheet CSV
fastify.get('/mcp/spreadsheet/get-sheet-csv', async (request, reply) => {
  const { sheetName } = request.query;

  return {
    success: true,
    command: 'getSheetCSV',
    params: { sheetName },
    result: '', // This would need to be implemented to query actual spreadsheet state
    timestamp: new Date().toISOString(),
    note: 'This endpoint requires server-side spreadsheet state access'
  };
});

// Get processed data of whole sheet
fastify.get('/mcp/spreadsheet/get-processed-data-whole-sheet', async (request, reply) => {
  const { sheetName } = request.query;

  return {
    success: true,
    command: 'getProcessedDataOfWholeSheet',
    params: { sheetName },
    result: [], // This would need to be implemented to query actual spreadsheet state
    timestamp: new Date().toISOString(),
    note: 'This endpoint requires server-side spreadsheet state access'
  };
});

// Get raw data of whole sheet
fastify.get('/mcp/spreadsheet/get-raw-data-whole-sheet', async (request, reply) => {
  const { sheetName } = request.query;

  return {
    success: true,
    command: 'getRawDataOfWholeSheet',
    params: { sheetName },
    result: [], // This would need to be implemented to query actual spreadsheet state
    timestamp: new Date().toISOString(),
    note: 'This endpoint requires server-side spreadsheet state access'
  };
});

// Get processed data
fastify.get('/mcp/spreadsheet/get-processed-data', async (request, reply) => {
  const { startRow, startCol, rowCount, colCount, sheetName } = request.query;

  if (startRow === undefined || startCol === undefined || rowCount === undefined || colCount === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameters: startRow, startCol, rowCount, colCount'
    });
  }

  return {
    success: true,
    command: 'getProcessedData',
    params: { startRow: parseInt(startRow), startCol: parseInt(startCol), rowCount: parseInt(rowCount), colCount: parseInt(colCount), sheetName },
    result: [], // This would need to be implemented to query actual spreadsheet state
    timestamp: new Date().toISOString(),
    note: 'This endpoint requires server-side spreadsheet state access'
  };
});

// Get raw data
fastify.get('/mcp/spreadsheet/get-raw-data', async (request, reply) => {
  const { startRow, startCol, rowCount, colCount, sheetName } = request.query;

  if (startRow === undefined || startCol === undefined || rowCount === undefined || colCount === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameters: startRow, startCol, rowCount, colCount'
    });
  }

  return {
    success: true,
    command: 'getRawData',
    params: { startRow: parseInt(startRow), startCol: parseInt(startCol), rowCount: parseInt(rowCount), colCount: parseInt(colCount), sheetName },
    result: [], // This would need to be implemented to query actual spreadsheet state
    timestamp: new Date().toISOString(),
    note: 'This endpoint requires server-side spreadsheet state access'
  };
});

// Get styles and merges
fastify.get('/mcp/spreadsheet/get-styles-merges', async (request, reply) => {
  const { startRow, startCol, rowCount, colCount, sheetName } = request.query;

  if (startRow === undefined || startCol === undefined || rowCount === undefined || colCount === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameters: startRow, startCol, rowCount, colCount'
    });
  }

  return {
    success: true,
    command: 'getStylesAndMerges',
    params: { startRow: parseInt(startRow), startCol: parseInt(startCol), rowCount: parseInt(rowCount), colCount: parseInt(colCount), sheetName },
    result: { styles: [], merges: [] }, // This would need to be implemented to query actual spreadsheet state
    timestamp: new Date().toISOString(),
    note: 'This endpoint requires server-side spreadsheet state access'
  };
});

// Get charts
fastify.get('/mcp/spreadsheet/get-charts', async (request, reply) => {
  const { sheetName } = request.query;

  return {
    success: true,
    command: 'getCharts',
    params: { sheetName },
    result: [], // This would need to be implemented to query actual spreadsheet state
    timestamp: new Date().toISOString(),
    note: 'This endpoint requires server-side spreadsheet state access'
  };
});

// Get formatter
fastify.get('/mcp/spreadsheet/get-formatter', async (request, reply) => {
  const { row, col, sheetName } = request.query;

  if (row === undefined || col === undefined) {
    return reply.code(400).send({
      error: 'Missing required parameters: row, col'
    });
  }

  return {
    success: true,
    command: 'getFormatter',
    params: { row: parseInt(row), col: parseInt(col), sheetName },
    result: null, // This would need to be implemented to query actual spreadsheet state
    timestamp: new Date().toISOString(),
    note: 'This endpoint requires server-side spreadsheet state access'
  };
});

// Get available operations
fastify.get('/mcp/spreadsheet/operations', async (request, reply) => {
  return {
    operations: [
      // Sheet management
      {
        name: 'get-sheet-names',
        description: 'Get all sheet names',
        endpoint: '/mcp/spreadsheet/get-sheet-names',
        method: 'GET',
        params: []
      },
      {
        name: 'get-sheet-count',
        description: 'Get total number of sheets',
        endpoint: '/mcp/spreadsheet/get-sheet-count',
        method: 'GET',
        params: []
      },
      {
        name: 'get-active-sheet',
        description: 'Get active sheet object',
        endpoint: '/mcp/spreadsheet/get-active-sheet',
        method: 'GET',
        params: []
      },
      {
        name: 'get-active-sheet-index',
        description: 'Get active sheet index',
        endpoint: '/mcp/spreadsheet/get-active-sheet-index',
        method: 'GET',
        params: []
      },
      {
        name: 'set-active-sheet-index',
        description: 'Set active sheet by index',
        endpoint: '/mcp/spreadsheet/set-active-sheet-index',
        method: 'POST',
        params: ['index']
      },
      {
        name: 'add-sheet',
        description: 'Add new sheet',
        endpoint: '/mcp/spreadsheet/add-sheet',
        method: 'POST',
        params: ['sheetName?']
      },
      {
        name: 'remove-sheet',
        description: 'Remove sheet',
        endpoint: '/mcp/spreadsheet/remove-sheet',
        method: 'POST',
        params: ['sheet']
      },
      {
        name: 'clear-sheets',
        description: 'Clear all sheets',
        endpoint: '/mcp/spreadsheet/clear-sheets',
        method: 'POST',
        params: []
      },

      // Sheet data operations
      {
        name: 'get-sheet-json',
        description: 'Get sheet as JSON',
        endpoint: '/mcp/spreadsheet/get-sheet-json',
        method: 'GET',
        params: ['sheetName?']
      },
      {
        name: 'set-sheet-json',
        description: 'Set sheet from JSON',
        endpoint: '/mcp/spreadsheet/set-sheet-json',
        method: 'POST',
        params: ['json', 'sheetIndex?']
      },
      {
        name: 'get-sheet-csv',
        description: 'Get sheet as CSV',
        endpoint: '/mcp/spreadsheet/get-sheet-csv',
        method: 'GET',
        params: ['sheetName?']
      },
      {
        name: 'set-sheet-csv',
        description: 'Set sheet from CSV',
        endpoint: '/mcp/spreadsheet/set-sheet-csv',
        method: 'POST',
        params: ['csv', 'sheetName?']
      },
      {
        name: 'get-sheet-csv-of-range',
        description: 'Get CSV data from a specific range',
        endpoint: '/mcp/spreadsheet/get-sheet-csv-of-range',
        method: 'GET',
        params: ['startRow', 'startCol', 'rowCount', 'colCount', 'newLine?', 'delimiter?', 'sheetName?']
      },
      {
        name: 'set-sheet-csv-of-range',
        description: 'Set CSV data in a specific range',
        endpoint: '/mcp/spreadsheet/set-sheet-csv-of-range',
        method: 'POST',
        params: ['startRow', 'startCol', 'csv', 'newLine?', 'delimiter?', 'sheetName?']
      },

      // Data operations
      {
        name: 'get-processed-data-whole-sheet',
        description: 'Get all processed data from sheet',
        endpoint: '/mcp/spreadsheet/get-processed-data-whole-sheet',
        method: 'GET',
        params: ['sheetName?']
      },
      {
        name: 'get-raw-data-whole-sheet',
        description: 'Get all raw data (formulas) from sheet',
        endpoint: '/mcp/spreadsheet/get-raw-data-whole-sheet',
        method: 'GET',
        params: ['sheetName?']
      },
      {
        name: 'get-processed-data',
        description: 'Get processed data from range',
        endpoint: '/mcp/spreadsheet/get-processed-data',
        method: 'GET',
        params: ['startRow', 'startCol', 'rowCount', 'colCount', 'sheetName?']
      },
      {
        name: 'get-raw-data',
        description: 'Get raw data (formulas) from range',
        endpoint: '/mcp/spreadsheet/get-raw-data',
        method: 'GET',
        params: ['startRow', 'startCol', 'rowCount', 'colCount', 'sheetName?']
      },
      {
        name: 'set-processed-data',
        description: 'Set processed data in range',
        endpoint: '/mcp/spreadsheet/set-processed-data',
        method: 'POST',
        params: ['startRow', 'startCol', 'values', 'sheetName?']
      },
      {
        name: 'set-raw-data',
        description: 'Set raw data (formulas) in range',
        endpoint: '/mcp/spreadsheet/set-raw-data',
        method: 'POST',
        params: ['startRow', 'startCol', 'formulas', 'sheetName?']
      },

      // Style and formatting
      {
        name: 'get-styles-merges',
        description: 'Get styles and merges from range',
        endpoint: '/mcp/spreadsheet/get-styles-merges',
        method: 'GET',
        params: ['startRow', 'startCol', 'rowCount', 'colCount', 'sheetName?']
      },
      {
        name: 'set-styles-merges',
        description: 'Set styles and merges in range',
        endpoint: '/mcp/spreadsheet/set-styles-merges',
        method: 'POST',
        params: ['startRow', 'startCol', 'rowCount', 'colCount', 'styles?', 'merges?', 'sheetName?']
      },

      // Charts
      {
        name: 'get-charts',
        description: 'Get charts from sheet',
        endpoint: '/mcp/spreadsheet/get-charts',
        method: 'GET',
        params: ['sheetName?']
      },
      {
        name: 'set-charts',
        description: 'Set charts in sheet',
        endpoint: '/mcp/spreadsheet/set-charts',
        method: 'POST',
        params: ['chartsData', 'sheetName?']
      },

      // Row and column operations
      {
        name: 'add-rows',
        description: 'Add rows at position',
        endpoint: '/mcp/spreadsheet/add-rows',
        method: 'POST',
        params: ['row', 'count', 'sheetName?']
      },
      {
        name: 'add-columns',
        description: 'Add columns at position',
        endpoint: '/mcp/spreadsheet/add-columns',
        method: 'POST',
        params: ['col', 'count', 'sheetName?']
      },
      {
        name: 'delete-rows',
        description: 'Delete rows from position',
        endpoint: '/mcp/spreadsheet/delete-rows',
        method: 'POST',
        params: ['row', 'count', 'sheetName?']
      },
      {
        name: 'delete-columns',
        description: 'Delete columns from position',
        endpoint: '/mcp/spreadsheet/delete-columns',
        method: 'POST',
        params: ['col', 'count', 'sheetName?']
      },

      // Sizing operations
      {
        name: 'auto-fit-row',
        description: 'Auto-fit row height',
        endpoint: '/mcp/spreadsheet/auto-fit-row',
        method: 'POST',
        params: ['row', 'sheetName?']
      },
      {
        name: 'auto-fit-column',
        description: 'Auto-fit column width',
        endpoint: '/mcp/spreadsheet/auto-fit-column',
        method: 'POST',
        params: ['col', 'sheetName?']
      },
      {
        name: 'set-row-height',
        description: 'Set row height',
        endpoint: '/mcp/spreadsheet/set-row-height',
        method: 'POST',
        params: ['row', 'height', 'sheetName?']
      },
      {
        name: 'set-column-width',
        description: 'Set column width',
        endpoint: '/mcp/spreadsheet/set-column-width',
        method: 'POST',
        params: ['col', 'width', 'sheetName?']
      },

      // Cell operations
      {
        name: 'get-formatter',
        description: 'Get cell formatter',
        endpoint: '/mcp/spreadsheet/get-formatter',
        method: 'GET',
        params: ['row', 'col', 'sheetName?']
      },
      {
        name: 'set-formatter',
        description: 'Set cell formatter',
        endpoint: '/mcp/spreadsheet/set-formatter',
        method: 'POST',
        params: ['row', 'col', 'format', 'sheetName?']
      },

      // Utility operations
      {
        name: 'copy-to',
        description: 'Copy data from one range to another',
        endpoint: '/mcp/spreadsheet/copy-to',
        method: 'POST',
        params: ['fromRow', 'fromColumn', 'toRow', 'toColumn', 'rowCount?', 'columnCount?', 'option?', 'sheetName?']
      },
      {
        name: 'reset-merging-status',
        description: 'Reset merging status in range',
        endpoint: '/mcp/spreadsheet/reset-merging-status',
        method: 'POST',
        params: ['startRow', 'startCol', 'rowCount', 'colCount', 'sheetName?']
      },

      // Legacy endpoints (for backward compatibility)
      {
        name: 'set-cell',
        description: 'Set cell value (legacy)',
        endpoint: '/mcp/spreadsheet/set-cell',
        method: 'POST',
        params: ['row', 'col', 'value', 'sheetIndex?']
      },
      {
        name: 'set-formula',
        description: 'Set cell formula (legacy)',
        endpoint: '/mcp/spreadsheet/set-formula',
        method: 'POST',
        params: ['row', 'col', 'formula', 'sheetIndex?']
      },
      {
        name: 'set-active-sheet',
        description: 'Set active sheet (legacy)',
        endpoint: '/mcp/spreadsheet/set-active-sheet',
        method: 'POST',
        params: ['sheetIndex']
      },
      {
        name: 'clear-sheet',
        description: 'Clear sheet data (legacy)',
        endpoint: '/mcp/spreadsheet/clear-sheet',
        method: 'POST',
        params: ['sheetIndex?']
      }
    ],
    timestamp: new Date().toISOString()
  };
});

// Health check
fastify.get('/health', async (request, reply) => {
  return {
    status: 'healthy',
    websocket: {
      connectedClients: clients.size,
      serverRunning: !!wss
    },
    timestamp: new Date().toISOString()
  };
});

// Export the Fastify app and initialization function
module.exports = {
  fastify,
  setWebSocketServer,
  broadcastToWebSocketClients
};