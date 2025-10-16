import { useCallback } from 'react';

export const useSpreadsheetCommands = (spreadsheetFunctions) => {
  const commandMap = {
    // Sheet management
    getSheetNames: () => spreadsheetFunctions.getSheetNames(),
    getSheetCount: () => spreadsheetFunctions.getSheetCount(),
    getActiveSheet: () => spreadsheetFunctions.getActiveSheet(),
    getActiveSheetIndex: () => spreadsheetFunctions.getActiveSheetIndex(),
    setActiveSheetIndex: (params) => spreadsheetFunctions.setActiveSheetIndex(params.index),
    addSheet: (params) => spreadsheetFunctions.addSheet(params.sheetName, params.atIndex),
    removeSheet: (params) => spreadsheetFunctions.removeSheet(params.sheet),
    clearSheets: () => spreadsheetFunctions.clearSheets(),

    // Sheet data operations
    getSheetJSON: (params) => spreadsheetFunctions.getSheetJSON(params.sheetName),
    setSheetJSON: (params) => spreadsheetFunctions.setSheetJSON(params.json, params.sheetName),
    getSheetCSV: (params) => spreadsheetFunctions.getSheetCSV(params.sheetName),
    setSheetCSV: (params) => spreadsheetFunctions.setSheetCSV(params.csv, params.sheetName),
    getSheetCSVOfRange: (params) => spreadsheetFunctions.getSheetCSVOfRange(
      params.startRow, params.startCol, params.rowCount, params.colCount, params.newLine, params.delimiter, params.sheetName
    ),
    setSheetCSVOfRange: (params) => spreadsheetFunctions.setSheetCSVOfRange(
      params.startRow, params.startCol, params.csv, params.newLine, params.delimiter, params.sheetName
    ),

    // Data operations
    getProcessedDataOfWholeSheet: (params) => spreadsheetFunctions.getProcessedDataOfWholeSheet(params.sheetName),
    getRawDataOfWholeSheet: (params) => spreadsheetFunctions.getRawDataOfWholeSheet(params.sheetName),
    getProcessedData: (params) => spreadsheetFunctions.getProcessedData(
      params.startRow, params.startCol, params.rowCount, params.colCount, params.sheetName
    ),
    getRawData: (params) => spreadsheetFunctions.getRawData(
      params.startRow, params.startCol, params.rowCount, params.colCount, params.sheetName
    ),
    setProcessedData: (params) => spreadsheetFunctions.setProcessedData(
      params.startRow, params.startCol, params.values, params.sheetName
    ),
    setRawData: (params) => spreadsheetFunctions.setRawData(
      params.startRow, params.startCol, params.formulas, params.sheetName
    ),

    // Style and formatting
    getStylesAndMerges: (params) => spreadsheetFunctions.getStylesAndMerges(
      params.startRow, params.startCol, params.rowCount, params.colCount, params.sheetName
    ),
    setStylesAndMerges: (params) => spreadsheetFunctions.setStylesAndMerges(
      params.startRow, params.startCol, params.rowCount, params.colCount,
      params.styles, params.merges, params.sheetName
    ),

    // Charts
    getCharts: (params) => spreadsheetFunctions.getCharts(params.sheetName),
    setCharts: (params) => spreadsheetFunctions.setCharts(params.chartsData, params.sheetName),

    // Row and column operations
    addRows: (params) => spreadsheetFunctions.addRows(params.row, params.count, params.sheetName),
    addColumns: (params) => spreadsheetFunctions.addColumns(params.col, params.count, params.sheetName),
    deleteRows: (params) => spreadsheetFunctions.deleteRows(params.row, params.count, params.sheetName),
    deleteColumns: (params) => spreadsheetFunctions.deleteColumns(params.col, params.count, params.sheetName),

    // Sizing operations
    autoFitRow: (params) => spreadsheetFunctions.autoFitRow(params.row, params.sheetName),
    autoFitColumn: (params) => spreadsheetFunctions.autoFitColumn(params.col, params.sheetName),
    setRowHeight: (params) => spreadsheetFunctions.setRowHeight(params.row, params.height, params.sheetName),
    setColumnWidth: (params) => spreadsheetFunctions.setColumnWidth(params.col, params.width, params.sheetName),

    // Cell operations
    getFormatter: (params) => spreadsheetFunctions.getFormatter(params.row, params.col, params.sheetName),
    setFormatter: (params) => spreadsheetFunctions.setFormatter(params.row, params.col, params.format, params.sheetName),

    // Utility operations
    copyTo: (params) => spreadsheetFunctions.copyTo(
      params.fromRow, params.fromColumn, params.toRow, params.toColumn,
      params.rowCount, params.columnCount, params.option, params.sheetName
    ),
    resetMergingStatus: (params) => spreadsheetFunctions.resetMergingStatus(
      params.startRow, params.startCol, params.rowCount, params.colCount, params.sheetName
    ),
  };

  const executeCommand = useCallback((commandName, params = {}) => {
    try {
      const commandFunction = commandMap[commandName];
      if (!commandFunction) {
        throw new Error(`Unknown command: ${commandName}`);
      }

      const result = commandFunction(params);
      return {
        success: true,
        command: commandName,
        result: result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error);
      return {
        success: false,
        command: commandName,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }, [commandMap]);

  const getAvailableCommands = useCallback(() => {
    return Object.keys(commandMap);
  }, [commandMap]);

  return {
    executeCommand,
    getAvailableCommands,
    commandMap
  };
};