import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { useSpreadSheet } from '../hooks/useSpreadSheet';
import SpreadSheetEditor from '../components/SpreadSheetEditor';
import { Button } from '../components/ui/button';
import WebSocketDebugOverlay from '../components/WebSocketDebugOverlay';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useSpreadsheetCommands } from '@/hooks/useSpreadsheetCommands';
import { useEffect, useRef } from 'react';

const SpreadSheetEditorPageJSONTemplateCreation = () => {
  // Enable WebSocket support - you can configure the URL here
  const webSocketUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080';

  const { containerRef, loading, debugInfo, onEventCallbackRef, designerRef,
    getSheetNames,
    getSheetJSON,
    setSheetJSON,
    getSheetCSV,
    setSheetCSV,
    getSheetCSVOfRange,
    setSheetCSVOfRange,
    getProcessedDataOfWholeSheet,
    getRawDataOfWholeSheet,
    getProcessedData,
    getRawData,
    setProcessedData,
    setRawData,
    getStylesAndMerges,
    setStylesAndMerges,
    getCharts,
    setCharts,
    resetMergingStatus,

    addRows,
    addColumns,
    autoFitRow,
    autoFitColumn,
    deleteRows,
    deleteColumns,
    setRowHeight,
    setColumnWidth,
    copyTo,
    getFormatter,
    setFormatter,
  
    setActiveSheet,
    setActiveSheetIndex,
    removeSheet,
    setSheetCount,
    getSheet,
    getSheetCount,
    getSheetFromName,
    getSheetIndex,
    getActiveSheet,
    getActiveSheetIndex,
    clearSheets,
    addSheet,
  } = useSpreadSheet();

  const {
    executeCommand,
    getAvailableCommands,
    commandMap
  } = useSpreadsheetCommands({
    getSheetNames,
    getSheetJSON,
    setSheetJSON,
    getSheetCSV,
    setSheetCSV,
    getSheetCSVOfRange,
    setSheetCSVOfRange,
    getProcessedDataOfWholeSheet,
    getRawDataOfWholeSheet,
    getProcessedData,
    getRawData,
    setProcessedData,
    setRawData,
    getStylesAndMerges,
    setStylesAndMerges,
    getCharts,
    setCharts,
    resetMergingStatus,

    addRows,
    addColumns,
    autoFitRow,
    autoFitColumn,
    deleteRows,
    deleteColumns,
    setRowHeight,
    setColumnWidth,
    copyTo,
    getFormatter,
    setFormatter,
  
    setActiveSheet,
    setActiveSheetIndex,
    removeSheet,
    setSheetCount,
    getSheet,
    getSheetCount,
    getSheetFromName,
    getSheetIndex,
    getActiveSheet,
    getActiveSheetIndex,
    clearSheets,
    addSheet,
  });

  const {
    isConnected: webSocketConnected,
    sendMessage: sendWebSocketMessage,
    error: webSocketError,
    connect: connectWebSocket,
    disconnect: disconnectWebSocket,
    onRecvMessageRef,
  } = useWebSocket(webSocketUrl, (message) => {
    if (message.type === 'command' && message.command) {
      const result = executeCommand(message.command, message.params);
      const resp = {...result, type: 'command_ack', requestId: message.requestId};
      onRecvMessageDebugRef.current && onRecvMessageDebugRef.current("Execute Command result", JSON.stringify(resp, null, 2), 'out');
      sendWebSocketMessage(resp);
    }
  }, true);


  const onRecvMessageDebugRef = useRef(null);


  useEffect(() => {
    // Automatically connect to WebSocket on mount
    connectWebSocket();
    
    onRecvMessageRef.current = (type, content, direction) => {
      onRecvMessageDebugRef.current && onRecvMessageDebugRef.current(type, content, direction);
    };

    return () => {
      // Disconnect from WebSocket on unmount
      disconnectWebSocket();
    };
  }, []);

  const generateFinancialSheets = async () => {
    const templateFiles = [
      'sample-revenue-channel.json',
      'sample-hr.json',
      'sample-capex.json',
      'sample-expenses.json',
      'sample-profit-loss.json',
      'sample-budget-plan.json',
      'sample-financial-summary.json',
      'sample-assumptions.json'
    ];

    for (const templateFile of templateFiles) {
      try {
        // Load the JSON template
        const response = await fetch(`/templates/${templateFile}`);
        if (!response.ok) {
          console.error(`Failed to load template ${templateFile}:`, response.statusText);
          continue;
        }
        const templateData = await response.json();
        
        // Create a new sheet and apply the JSON template
        const sheet = addSheet(templateData.name);
        if (sheet) {
          sheet.fromJSON(templateData);
        }
      } catch (error) {
        console.error(`Error loading template ${templateFile}:`, error);
      }
    }
    
    // Set the first sheet as active
    setActiveSheetIndex(0);
  };

  const copySheetJSON = async () => {
    const activeSheet = getActiveSheet();
    if (activeSheet) {
      const sheetName = activeSheet.name();
      const jsonData = getSheetJSON(sheetName);
      const jsonString = JSON.stringify(jsonData, null, 2);
      
      try {
        await navigator.clipboard.writeText(jsonString);
        alert(`Sheet "${sheetName}" JSON copied to clipboard!`);
      } catch (err) {
        console.error('Failed to copy JSON to clipboard:', err);
        alert('Failed to copy JSON to clipboard. Check console for details.');
      }
    } else {
      alert('No active sheet found.');
    }
  };

  const copySheetCSV = async () => {
    const activeSheet = getActiveSheet();
    if (activeSheet) {
      const sheetName = activeSheet.name();
      const csvData = getSheetCSV(sheetName);
      
      try {
        await navigator.clipboard.writeText(csvData);
        alert(`Sheet "${sheetName}" CSV copied to clipboard!`);
      } catch (err) {
        console.error('Failed to copy CSV to clipboard:', err);
        alert('Failed to copy CSV to clipboard. Check console for details.');
      }
    } else {
      alert('No active sheet found.');
    }
  };

  const copyAllSheetsInfo = async () => {
    const sheetNames = getSheetNames();
    const sheetCount = getSheetCount();
    const activeSheetIndex = getActiveSheetIndex();
    const activeSheet = getActiveSheet();
    
    let infoString = '=== Spreadsheet Debug Info ===\n';
    infoString += `Total sheets: ${sheetCount}\n`;
    infoString += `Sheet names: ${sheetNames.join(', ')}\n`;
    infoString += `Active sheet index: ${activeSheetIndex}\n`;
    infoString += `Active sheet name: ${activeSheet ? activeSheet.name() : 'None'}\n\n`;
    
    sheetNames.forEach((name, index) => {
      const sheet = getSheetFromName(name);
      if (sheet) {
        const rowCount = sheet.getRowCount();
        const colCount = sheet.getColumnCount();
        infoString += `Sheet "${name}" (${index}): ${rowCount} rows x ${colCount} columns\n`;
      }
    });
    
    try {
      await navigator.clipboard.writeText(infoString);
      alert('All sheet information copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy sheet info to clipboard:', err);
      alert('Failed to copy sheet info to clipboard. Check console for details.');
    }
  };




  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <FileSpreadsheet className="w-24 h-24 mx-auto text-indigo-600 mb-4" />
          <Loader2 className="w-8 h-8 mx-auto mb-4 text-indigo-600 animate-spin" />
          <h1 className="text-2xl font-bold text-gray-800">Finance Spreadsheet Platform</h1>
          <p className="text-gray-600 mt-2">Loading spreadsheet editor...</p>
        </div>
      </div>
    );
  }

  
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, borderRight: '1px solid #ccc' }}>
        <SpreadSheetEditor containerRef={containerRef} debugInfo={debugInfo} />
      </div>
      <div style={{ width: '200px', padding: '20px', backgroundColor: '#f9f9f9' }}>
        <Button 
          onClick={generateFinancialSheets}
          style={{ width: '100%', marginBottom: '10px' }}
        >
          Generate Financial Sheets
        </Button>
        <Button 
          onClick={copySheetJSON}
          variant="outline"
          style={{ width: '100%', marginBottom: '10px' }}
        >
          Copy Sheet JSON
        </Button>
        <Button 
          onClick={copySheetCSV}
          variant="outline"
          style={{ width: '100%', marginBottom: '10px' }}
        >
          Copy Sheet CSV
        </Button>
        <Button 
          onClick={copyAllSheetsInfo}
          variant="outline"
          style={{ width: '100%', marginBottom: '10px' }}
        >
          Copy Sheet Info
        </Button>
      </div>

      <WebSocketDebugOverlay
        webSocketConnected={webSocketConnected}
        onSendCommand={sendWebSocketMessage}
        onRecvCommand={onRecvMessageDebugRef}
      />
    </div>
  )

};

export default SpreadSheetEditorPageJSONTemplateCreation;
