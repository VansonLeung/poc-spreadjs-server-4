import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { useSpreadSheet } from '../hooks/useSpreadSheet';
import SpreadSheetEditor from '../components/SpreadSheetEditor';
import WebSocketDebugOverlay from '../components/WebSocketDebugOverlay';
import { useEffect, useRef } from 'react';

const SpreadSheetEditorPage = () => {
  // Enable WebSocket support - you can configure the URL here
  const webSocketUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080';
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
  } = useSpreadSheet(true, webSocketUrl, true); // Enable WebSocket and debug



  const syncCellRange = (sourceRange, targetRange, {
    isValue = true,
    isFormula = true,
    isStyles = true,
  } = (options || {})) => {

    if (isValue) {
      const values = getProcessedData(sourceRange.row, sourceRange.col, sourceRange.rowCount, sourceRange.colCount);
      // setProcessedData2(targetRange.row, targetRange.col, values);
    }
    
    if (isFormula) {
      const formulas = getRawData(sourceRange.row, sourceRange.col, sourceRange.rowCount, sourceRange.colCount);
      // setRawData2(targetRange.row, targetRange.col, formulas);
    } 

    if (isStyles) {
      const { styles, merges } = getStylesAndMerges(sourceRange.row, sourceRange.col, sourceRange.rowCount, sourceRange.colCount);
      // setStylesAndMerges2(targetRange.row, targetRange.col, sourceRange.rowCount, sourceRange.colCount, styles, merges);
    }
  }



  if (onEventCallbackRef && !onEventCallbackRef.current) {
    onEventCallbackRef.current = (event) => {
      console.log('Event from Editor 1:', event.detail.eventType, event.detail);
      
      // Synchronize actions from editor 1 to editor 2
      const { eventType, lastEvent } = event.detail;
      
      switch (eventType) {
        case 'ValueChanged':
          if (lastEvent.newValue !== undefined && lastEvent.row !== undefined && lastEvent.col !== undefined) {
            // Check if the value is a formula (starts with '=')
            if (typeof lastEvent.newValue === 'string' && lastEvent.newValue.startsWith('=')) {
              console.log('Syncing formula change to Editor 2:', lastEvent.row, lastEvent.col, lastEvent.newValue);
              syncCellRange(
                { row: lastEvent.row, col: lastEvent.col, rowCount: 1, colCount: 1 },
                { row: lastEvent.row, col: lastEvent.col, rowCount: 1, colCount: 1 },
                { isFormula: true, isValue: true, isStyles: false },
              );
            } else {
              console.log('Syncing cell value change to Editor 2:', lastEvent.row, lastEvent.col, lastEvent.newValue);
              syncCellRange(
                { row: lastEvent.row, col: lastEvent.col, rowCount: 1, colCount: 1 },
                { row: lastEvent.row, col: lastEvent.col, rowCount: 1, colCount: 1 },
                { isValue: true, isFormula: true, isStyles: false },
              );
            }
          }
          break;
        case 'UserFormulaEntered':
          if (lastEvent.formula !== undefined && lastEvent.row !== undefined && lastEvent.col !== undefined) {
            console.log('Syncing formula change to Editor 2:', lastEvent.row, lastEvent.col, lastEvent.formula);
            syncCellRange(
              { row: lastEvent.row, col: lastEvent.col, rowCount: 1, colCount: 1 },
              { row: lastEvent.row, col: lastEvent.col, rowCount: 1, colCount: 1 },
              { isFormula: true, isValue: true, isStyles: false }
            );
          }
          break;
        case 'SelectionChanged':
          // Selection changes are not synced to avoid cursor jumping
          break;
        case 'RangeChanged':
          if (lastEvent.propertyName === 'span' && lastEvent.action === 'add') {
            // Cell merge operation
            console.log('Syncing cell merge to Editor 2:', lastEvent.row, lastEvent.col, lastEvent.rowCount, lastEvent.colCount);
            syncCellRange(
              { row: lastEvent.row, col: lastEvent.col, rowCount: lastEvent.rowCount || 1, colCount: lastEvent.colCount || 1 },
              { row: lastEvent.row, col: lastEvent.col, rowCount: lastEvent.rowCount || 1, colCount: lastEvent.colCount || 1 },
              { isValue: false, isFormula: false, isStyles: true }
            );
          } else if (lastEvent.propertyName === 'span' && lastEvent.action === 'remove') {
            // Cell unmerge operation
            console.log('Syncing cell unmerge to Editor 2:', lastEvent.row, lastEvent.col);
            syncCellRange(
              { row: lastEvent.row, col: lastEvent.col, rowCount: lastEvent.rowCount || 1, colCount: lastEvent.colCount || 1 },
              { row: lastEvent.row, col: lastEvent.col, rowCount: lastEvent.rowCount || 1, colCount: lastEvent.colCount || 1 },
              { isValue: false, isFormula: false, isStyles: true }
            );
          } else if (lastEvent.action === 'clear' || lastEvent.action === 2) {
            // Cell/range clear operation
            console.log('Syncing cell clear to Editor 2:', lastEvent.row, lastEvent.col, lastEvent.rowCount, lastEvent.colCount);
            syncCellRange(
              { row: lastEvent.row, col: lastEvent.col, rowCount: lastEvent.rowCount || 1, colCount: lastEvent.colCount || 1 },
              { row: lastEvent.row, col: lastEvent.col, rowCount: lastEvent.rowCount || 1, colCount: lastEvent.colCount || 1 },
              { isValue: true, isFormula: true, isStyles: false }
            );
          }
          break;
        case 'ClipboardPasted':
          console.log('ClipboardPasted event triggered, lastEvent:', lastEvent);
          if (lastEvent.cellRange.row !== undefined && lastEvent.cellRange.col !== undefined) {
            // Read the pasted data from the source sheet and sync to target
            console.log('Syncing paste operation to Editor 2:', lastEvent.cellRange.row, lastEvent.cellRange.col);
            syncCellRange(
              { row: lastEvent.cellRange.row, col: lastEvent.cellRange.col, rowCount: lastEvent.cellRange.rowCount || 1, colCount: lastEvent.cellRange.colCount || 1 },
              { row: lastEvent.cellRange.row, col: lastEvent.cellRange.col, rowCount: lastEvent.cellRange.rowCount || 1, colCount: lastEvent.cellRange.colCount || 1 },
              { isValue: true, isFormula: true, isStyles: true }
            );
          }
          break;
        case 'CellChanged':
          // Cell property changes - may not need special handling for sync
          break;
        default:
          // Other events can be handled here
          break;
      }
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

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, borderRight: '1px solid #ccc' }}>
        <SpreadSheetEditor containerRef={containerRef} debugInfo={debugInfo} />
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
      <WebSocketDebugOverlay
        webSocketEnabled={webSocketEnabled}
        webSocketConnected={webSocketConnected}
        onSendCommand={sendWebSocketMessage}
      />
    </div>
  )

};

export default SpreadSheetEditorPage;
