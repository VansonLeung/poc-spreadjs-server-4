import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { useSpreadSheet } from '../hooks/useSpreadSheet';
import SpreadSheetEditor from '../components/SpreadSheetEditor';
import { Button } from '../components/ui/button';
import WebSocketDebugOverlay from '../components/WebSocketDebugOverlay';
import { useEffect, useRef } from 'react';

const SpreadSheetEditorPageTemplateCreation = () => {
  // Enable WebSocket support - you can configure the URL here
  const webSocketUrl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8080';
  const { containerRef, loading, debugInfo, onEventCallbackRef, designerRef,
    webSocketEnabled, webSocketConnected, sendWebSocketMessage,
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
  } = useSpreadSheet(true, webSocketUrl);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <FileSpreadsheet className="w-24 h-24 mx-auto text-indigo-600 mb-4" />
          <Loader2 className="w-8 h-8 mx-auto mb-4 text-indigo-600 animate-spin" />
          <h1 className="text-2xl font-bold text-gray-800">Finance Spreadsheet Platform</h1>
          <p className="text-gray-600 mt-2">Loading spreadsheet editor...</p>
          {webSocketEnabled && (
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${webSocketConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                WebSocket: {webSocketConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const generateFinancialSheets = () => {
    const sheetConfigs = [
      {
        name: 'Revenue Channel',
        headers: ['Channel', 'Revenue', 'Growth %', 'Market Share'],
        data: [
          ['Online Sales', 500000, 15, 25],
          ['Retail Stores', 300000, 8, 20],
          ['Wholesale', 200000, 12, 15],
          ['Direct Sales', 150000, 20, 10],
        ]
      },
      {
        name: 'HR',
        headers: ['Department', 'Employees', 'Salary Budget', 'Turnover Rate'],
        data: [
          ['Engineering', 50, 2500000, 5],
          ['Sales', 30, 1500000, 8],
          ['Marketing', 20, 1000000, 6],
          ['Finance', 15, 750000, 3],
        ]
      },
      {
        name: 'Capex',
        headers: ['Asset', 'Cost', 'Useful Life', 'Depreciation'],
        data: [
          ['Equipment', 500000, 5, 100000],
          ['Software', 200000, 3, 66667],
          ['Buildings', 1000000, 20, 50000],
          ['Vehicles', 150000, 7, 21429],
        ]
      },
      {
        name: 'Expenses',
        headers: ['Category', 'Amount', 'Budget', 'Variance'],
        data: [
          ['Operating', 800000, 750000, -50000],
          ['Marketing', 150000, 200000, 50000],
          ['R&D', 300000, 250000, -50000],
          ['Admin', 100000, 120000, 20000],
        ]
      },
      {
        name: 'Profit Loss Table',
        headers: ['Item', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'],
        data: [
          ['Revenue', 400000, 450000, 500000, 550000, 1900000],
          ['COGS', 200000, 225000, 250000, 275000, 950000],
          ['Gross Profit', 200000, 225000, 250000, 275000, 950000],
          ['Expenses', 150000, 160000, 170000, 180000, 660000],
          ['Net Profit', 50000, 65000, 80000, 95000, 290000],
        ]
      },
      {
        name: 'Budget Plan',
        headers: ['Category', 'Planned', 'Actual', 'Variance %'],
        data: [
          ['Revenue', 2000000, 1900000, -5],
          ['Expenses', 700000, 660000, 5.7],
          ['Capex', 2000000, 1850000, 7.5],
          ['HR Costs', 5000000, 4750000, 5],
        ]
      },
      {
        name: 'Financial Summary',
        headers: ['Metric', 'Value', 'Target', 'Status'],
        data: [
          ['Revenue Growth', 15, 20, 'Below Target'],
          ['Profit Margin', 15.3, 18, 'Below Target'],
          ['ROI', 12, 15, 'Below Target'],
          ['Cash Flow', 500000, 600000, 'Below Target'],
        ]
      },
      {
        name: 'Assumptions',
        headers: ['Assumption', 'Value', 'Source', 'Confidence'],
        data: [
          ['Inflation Rate', 3, 'Government Data', 'High'],
          ['Market Growth', 8, 'Industry Report', 'Medium'],
          ['Currency Exchange', 1.1, 'Bank Forecast', 'Medium'],
          ['Interest Rate', 4.5, 'Central Bank', 'High'],
        ]
      },
    ];

    sheetConfigs.forEach((config, index) => {
      const sheet = addSheet(config.name);
      if (sheet) {
        // Set headers
        sheet.setArray(0, 0, [config.headers]);
        
        // Set data
        sheet.setArray(1, 0, config.data);
        
        // Style headers
        const headerStyle = new window.GC.Spread.Sheets.Style();
        headerStyle.backColor = '#f0f0f0';
        headerStyle.font = 'bold 12px Arial';
        headerStyle.foreColor = '#333';
        
        for (let col = 0; col < config.headers.length; col++) {
          sheet.setStyle(0, col, headerStyle);
        }
        
        // Auto-fit columns
        for (let col = 0; col < config.headers.length; col++) {
          sheet.autoFitColumn(col);
        }
      }
    });
    
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
      {webSocketEnabled && (
        <div className="absolute top-4 right-4 bg-white border border-gray-300 rounded-lg p-2 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${webSocketConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">
              WebSocket: {webSocketConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      )}
      {webSocketEnabled && (
        <WebSocketDebugOverlay
          webSocketEnabled={webSocketEnabled}
          webSocketConnected={webSocketConnected}
          onSendCommand={sendWebSocketMessage}
        />
      )}
    </div>
  )

};

export default SpreadSheetEditorPageTemplateCreation;
