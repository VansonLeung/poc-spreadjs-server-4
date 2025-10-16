import { useEffect, useRef, useState } from 'react';

export const useSpreadSheet = () => {
    const containerRef = useRef(null);
    const designerRef = useRef(null);
    const onEventCallbackRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [debugInfo, setDebugInfo] = useState({ eventCount: 0 });
    
    const handleSpreadsheetEvent = (e) => {
        setDebugInfo(e.detail);
        if (onEventCallbackRef.current) {
            onEventCallbackRef.current(e);
        }
    };
    
    useEffect(() => {
        // Load SpreadJS scripts dynamically if not already loaded
        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve();
                    return;
                }
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };
        
        const loadScripts = async () => {
            try {
                // Load core SpreadJS scripts
                await loadScript('/libs/spreadjs/scripts/gc.spread.sheets.all.js');
                
                if (window.GC === undefined) {
                    // keep loading until GC is defined
                    while (!window.GC) {
                        await new Promise((resolve) => setTimeout(resolve, 100));
                    }
                }
                
                await loadScript('/libs/spreadjs/scripts/plugins/gc.spread.sheets.shapes.min.js');
                await loadScript('/libs/spreadjs/scripts/plugins/gc.spread.sheets.charts.min.js');
                await loadScript('/libs/spreadjs/scripts/plugins/gc.spread.sheets.datacharts.min.js');
                await loadScript('/libs/spreadjs/scripts/plugins/gc.spread.sheets.slicers.min.js');
                await loadScript('/libs/spreadjs/scripts/plugins/gc.spread.sheets.print.min.js');
                await loadScript('/libs/spreadjs/scripts/plugins/gc.spread.sheets.barcode.min.js');
                await loadScript('/libs/spreadjs/scripts/plugins/gc.spread.sheets.pdf.min.js');
                await loadScript('/libs/spreadjs/scripts/plugins/gc.spread.pivot.pivottables.min.js');
                await loadScript('/libs/spreadjs/scripts/plugins/gc.spread.sheets.tablesheet.min.js');
                await loadScript('/libs/spreadjs/scripts/plugins/gc.spread.sheets.ganttsheet.min.js');
                await loadScript('/libs/spreadjs/scripts/plugins/gc.spread.sheets.formulapanel.min.js');
                await loadScript('/libs/spreadjs/scripts/plugins/gc.spread.report.reportsheet.min.js');
                await loadScript('/libs/spreadjs/scripts/plugins/gc.spread.sheets.io.min.js');
                await loadScript('/libs/spreadjs/scripts/interop/gc.spread.excelio.min.js');
                
                await loadScript('/libs/spreadjs/scripts/gc.spread.sheets.designer.resource.en.min.js');
                await loadScript('/libs/spreadjs/scripts/gc.spread.sheets.designer.all.min.js');
                
                if (window.GC.Spread.Sheets.Designer !== undefined && window.GC.Spread.Sheets.Designer.Designer === undefined) {
                    // keep loading until Designer is defined
                    while (!window.GC.Spread.Sheets.Designer.Designer) {
                        await new Promise((resolve) => setTimeout(resolve, 100));
                    }
                }
                
                // Set culture
                window._ssCulture = "en";
                
                // Scripts loaded successfully, but designer will be initialized when container is ready
                setLoading(false);
            } catch (error) {
                console.error('Failed to load SpreadJS scripts:', error);
                setLoading(false);
            }
        };
        
        loadScripts();
    }, []);
    
    // Separate effect for designer initialization when container becomes available
    useEffect(() => {
        const checkAndInitialize = () => {
            if (containerRef.current && !designerRef.current && window.GC?.Spread?.Sheets?.Designer?.Designer) {
                try {
                    console.log('Initializing SpreadJS Designer...', window.GC.Spread.Sheets.Designer.Designer);
                    
                    designerRef.current = new window.GC.Spread.Sheets.Designer.Designer(containerRef.current);
                    
                    const defaultConfig = window.GC.Spread.Sheets.Designer.ToolBarModeConfig;
                    designerRef.current.setConfig(defaultConfig);
                    
                    const spread = designerRef.current.getWorkbook();
                    
                    // Set up event listeners on the workbook
                    const events = [
                        "ValidationError",
                        "CellClick",
                        "CellDoubleClick",
                        "ColumnChanging",
                        "RowChanging",
                        "EnterCell",
                        "LeaveCell",
                        "ValueChanged",
                        "TopRowChanged",
                        "CollaborationStartUndo",
                        "CollaborationEndUndo",
                        "CollaborationStartRedo",
                        "CollaborationEndRedo",
                        "SheetChanging",
                        "SheetChanged",
                        "PivotTableChanged",
                        "PivotTableFormatClick",
                        "PivotTableAdded",
                        "LeftColumnChanged",
                        "InvalidOperation",
                        "RangeFiltering",
                        "RangeFiltered",
                        "RangeFilterClearing",
                        "TableFilterClearing",
                        "RangeFilterCleared",
                        "TableFilterCleared",
                        "TableFiltering",
                        "TableFiltered",
                        "RangeSorting",
                        "RangeSorted",
                        "ClipboardChanging",
                        "ClipboardChanged",
                        "ClipboardPasting",
                        "ClipboardPasted",
                        "ColumnWidthChanging",
                        "ColumnWidthChanged",
                        "RowHeightChanging",
                        "RowHeightChanged",
                        "DragDropBlock",
                        "DragDropBlockCompleted",
                        "DragFillBlock",
                        "DragFillBlockCompleted",
                        "EditStarting",
                        "EditStarted",
                        "EditChange",
                        "EditEnding",
                        "EditEnd",
                        "EditEnded",
                        "RangeGroupStateChanging",
                        "RangeGroupStateChanged",
                        "InternalSelectionChanging",
                        "SelectionChanging",
                        "SelectionChanged",
                        "SheetTabClick",
                        "SheetTabDoubleClick",
                        "SheetNameChanging",
                        "SheetNameChanged",
                        "ViewZooming",
                        "ViewZoomed",
                        "UserZooming",
                        "UserFormulaEntered",
                        "CellChanged",
                        "ColumnChanged",
                        "RowChanged",
                        "ActiveSheetChanging",
                        "ActiveSheetChanged",
                        "SparklineChanged",
                        "OutlineColumnCheckStatusChanged",
                        "RangeChanged",
                        "ButtonClicked",
                        "EditorStatusChanged",
                        "FloatingObjectChanged",
                        "DrawingElementZIndexChanged",
                        "ProgressChanged",
                        "FloatingObjectSelectionChanged",
                        "ShapeChanged",
                        "ShapeSelectionChanged",
                        "FormControlButtonClicked",
                        "FormControlValueChanged",
                        "PictureChanged",
                        "FloatingObjectRemoving",
                        "ShapeRemoving",
                        "FloatingObjectRemoved",
                        "ShapeRemoved",
                        "PictureSelectionChanged",
                        "FloatingObjectLoaded",
                        "TouchToolStripOpening",
                        "CommentChanged",
                        "CommentRemoving",
                        "CommentRemoved",
                        "SlicerChanged",
                        "BeforeDragDrop",
                        "ActiveSheetChangingInternal",
                        "ActiveSheetChangedInternal",
                        "EnterCellInternal",
                        "SheetOptionsChangedInternal",
                        "WorkbookOptionsChangedInternal",
                        "RangeChangedInternal",
                        "CustomNameChangedInternal",
                        "FormulaTextboxEditStarted",
                        "FormulaTextboxEditEnded",
                        "SheetBackgroundChangedInternal",
                        "SheetMoving",
                        "SheetMoved",
                        "DragMerging",
                        "DragMerged",
                        "ChartClicked",
                        "DataChartClicked",
                        "FloatingElementSelected",
                        "BeforePrint",
                        "TableResizing",
                        "TableResized",
                        "TableRowsChanged",
                        "TableColumnsChanged",
                        "DropdownSpreadMouseClick",
                        "DropdownSpreadKeyboardEnter",
                        "DropdownSpreadTouchTap",
                        "PasteEnd",
                        "WorkbookUndo",
                        "WorkbookRedo",
                        "TableSheetColHeaderRowCountChanged",
                        "TableSheetGroupFieldSetting",
                        "SheetTabAllSheetsListContextMenuOpening",
                        "SheetTabAllSheetsListContextMenuOpened",
                        "ReportSheetDataChanging",
                        "ReportSheetDataChanged",
                        "ReportSheetRecordsSubmitting",
                        "ReportSheetRecordsSubmitted",
                        "ActiveCellChanged",
                        "WorksheetDataChanged",
                        "ReportSheetModeChanged",
                        "ReportPaginationSettingChanged",
                        "ReportPaginationPageChanged",
                        "DataFetchCompleted",
                        "UserInfoChanged",
                    ];
                    
                    let eventCount = 0;
                    events.forEach(eventType => {
                        spread.bind(window.GC.Spread.Sheets.Events[eventType], (sender, args) => {
                            eventCount++;
                            
                            const eventData = {
                                type: eventType,
                                timestamp: new Date().toLocaleTimeString(),
                                sender: sender ? 'spread' : 'unknown'
                            };
                            
                            // Safely extract event-specific data
                            if (args) {
                                if (typeof args.row === 'number') eventData.row = args.row;
                                if (typeof args.col === 'number') eventData.col = args.col;
                                if (typeof args.rowCount === 'number') eventData.rowCount = args.rowCount;
                                if (typeof args.colCount === 'number') eventData.colCount = args.colCount;
                                if (args.newValue !== undefined) eventData.newValue = args.newValue;
                                if (args.oldValue !== undefined) eventData.oldValue = args.oldValue;
                                if (args.formula !== undefined) eventData.formula = args.formula;
                                if (args.propertyName) eventData.propertyName = args.propertyName;
                                if (args.action) eventData.action = args.action;
                                if (args.sheetName) eventData.sheetName = args.sheetName;
                                if (args.cellRange) eventData.cellRange = args.cellRange;
                                if (args.clipboardData) eventData.clipboardData = args.clipboardData;
                                if (args.pasteOption) eventData.pasteOption = args.pasteOption;
                                if (args.range) {
                                    eventData.range = args.range;
                                    // Extract range properties if it's a Range object
                                    if (args.range.row !== undefined) eventData.row = args.range.row;
                                    if (args.range.col !== undefined) eventData.col = args.range.col;
                                    if (args.range.rowCount !== undefined) eventData.rowCount = args.range.rowCount;
                                    if (args.range.colCount !== undefined) eventData.colCount = args.range.colCount;
                                }
                                if (args.sheet) eventData.sheet = args.sheet;
                            }
                            
                            const sheet = spread.getActiveSheet();
                            // Dispatch custom event for React to listen to
                            handleSpreadsheetEvent(new CustomEvent('spreadsheet-event', {
                                detail: {
                                    eventType: eventType,
                                    eventCount: eventCount,
                                    lastEvent: eventData,
                                    sheetInfo: {
                                        name: sheet.name(),
                                        rowCount: sheet.getRowCount(),
                                        columnCount: sheet.getColumnCount()
                                    }
                                }
                            }));
                            
                            console.log(`SpreadJS Event: ${eventType}`, eventData);
                        });
                    });
                    
                    console.log('SpreadJS Designer initialized successfully');
                } catch (error) {
                    console.error('Failed to initialize SpreadJS Designer:', error);
                }
            }
        };
        
        // Check immediately
        checkAndInitialize();
        
        // Also check periodically in case the container takes time to mount
        const interval = setInterval(checkAndInitialize, 100);
        
        // Cleanup function
        return () => {
            clearInterval(interval);
            if (designerRef.current) {
                designerRef.current = null;
            }
        };
    }, []); // No

    
    const getSheet = (sheetName) => {
        if (designerRef.current) {
            const spread = designerRef.current.getWorkbook();
            const sheet = sheetName ? spread.getSheetFromName(sheetName) : spread.getActiveSheet();
            if (sheet) {
                return sheet;
            }
        }
        return null;
    }



    const getSheetNames = () => {
        if (designerRef.current) {
            const spread = designerRef.current.getWorkbook();
            return spread.getSheetNames();
        }
        return [];
    }

    const getSheetJSON = (sheetName) => {
        const sheet = getSheet(sheetName);
        if (sheet) {
            return sheet.toJSON();
        }
        return null;
    }

    const setSheetJSON = (json, sheetName) => {
        const sheet = getSheet(sheetName);
        if (sheet && json) {
            sheet.fromJSON(json);
        }
    }

    const getSheetCSV = (sheetName) => {
        const sheet = getSheet(sheetName);
        if (sheet) {
            return sheet.toCSV();
        }
        return '';
    }

    const setSheetCSV = (csv, sheetName) => {
        const sheet = getSheet(sheetName);
        if (sheet && csv) {
            sheet.fromCSV(csv);
        }
    }



    const getProcessedDataOfWholeSheet = (sheetName) => {
        const sheet = getSheet(sheetName);
        if (sheet) {
            const rowCount = sheet.getRowCount();
            const colCount = sheet.getColumnCount();
            return sheet.getArray(0, 0, rowCount, colCount);
        }
        return [];
    };

    const getRawDataOfWholeSheet = (sheetName) => {
        const sheet = getSheet(sheetName);
        const formulas = [];
        if (sheet) {
            const rowCount = sheet.getRowCount();
            const colCount = sheet.getColumnCount();
            return sheet.getArray(0, 0, rowCount, colCount, true);
        }
        return formulas;
    };

    const getProcessedData = (startRow, startCol, rowCount, colCount, sheetName) => {
        const sheet = getSheet(sheetName);
        if (sheet) {
            return sheet.getArray(startRow, startCol, rowCount, colCount);
        }
        return [];
    };

    const getRawData = (startRow, startCol, rowCount, colCount, sheetName) => {
        const sheet = getSheet(sheetName);
        const formulas = [];
        if (sheet) {
            return sheet.getArray(startRow, startCol, rowCount, colCount, true);
        }
        return formulas;
    };

    const setProcessedData = (startRow, startCol, values, sheetName) => {
        const sheet = getSheet(sheetName);
        if (sheet) {
            sheet.setArray(startRow, startCol, values);
        }
    };

    const setRawData = (startRow, startCol, formulas, sheetName) => {
        const sheet = getSheet(sheetName);
        if (sheet) {
            sheet.setArray(startRow, startCol, formulas, true);
        }
    };

    const getStylesAndMerges = (startRow, startCol, rowCount = 1, colCount = 1, sheetName) => {
        const styles = [];
        const merges = [];
        const sheet = getSheet(sheetName);
        if (sheet) {
            for (let row = 0; row < rowCount; row++) {
                const styleRow = [];
                for (let col = 0; col < colCount; col++) {
                    const style = sheet.getStyle(startRow + row, startCol + col);
                    const styleData = {
                        backColor: style.backColor,
                        foreColor: style.foreColor,
                        font: style.font ? style.font.toString() : null,
                        hAlign: style.hAlign,
                        vAlign: style.vAlign,
                        wordWrap: style.wordWrap,
                        textDecoration: style.textDecoration,
                        borderTop: style.borderTop ? {
                            lineStyle: style.borderTop.lineStyle,
                            color: style.borderTop.color,
                            weight: style.borderTop.weight
                        } : null,
                        borderBottom: style.borderBottom ? {
                            lineStyle: style.borderBottom.lineStyle,
                            color: style.borderBottom.color,
                            weight: style.borderBottom.weight
                        } : null,
                        borderLeft: style.borderLeft ? {
                            lineStyle: style.borderLeft.lineStyle,
                            color: style.borderLeft.color,
                            weight: style.borderLeft.weight
                        } : null,
                        borderRight: style.borderRight ? {
                            lineStyle: style.borderRight.lineStyle,
                            color: style.borderRight.color,
                            weight: style.borderRight.weight
                        } : null,
                    }
                    styleRow.push(styleData);
                }
                styles.push(styleRow);
            }

            const range = new window.GC.Spread.Sheets.Range(startRow, startCol, rowCount, colCount);
            const spans = sheet.getSpans(range);
            for (const span of spans) {
                merges.push({
                    row: span.row,
                    col: span.col,
                    rowCount: span.rowCount,
                    colCount: span.colCount
                });
            }
        }
        return { styles, merges };
    };

    const setStylesAndMerges = (startRow, startCol, rowCount, colCount, styles, merges, sheetName) => {
        const sheet = getSheet(sheetName);
        if (sheet) {
            // Set styles
            for (let row = 0; row < styles.length; row++) {
                for (let col = 0; col < styles[row].length; col++) {
                    const style = styles[row][col];
                    const styleObj = new window.GC.Spread.Sheets.Style();
                    if (style.backColor) styleObj.backColor = style.backColor;
                    if (style.foreColor) styleObj.foreColor = style.foreColor;
                    if (style.font) styleObj.font = style.font;
                    if (style.hAlign) styleObj.hAlign = style.hAlign;
                    if (style.vAlign) styleObj.vAlign = style.vAlign;
                    if (style.wordWrap !== undefined) styleObj.wordWrap = style.wordWrap;
                    if (style.textDecoration) styleObj.textDecoration = style.textDecoration;
                    if (style.borderTop) {
                        styleObj.borderTop = new window.GC.Spread.Sheets.LineBorder(style.borderTop.color, style.borderTop.lineStyle, style.borderTop.weight);
                    }
                    if (style.borderBottom) {
                        styleObj.borderBottom = new window.GC.Spread.Sheets.LineBorder(style.borderBottom.color, style.borderBottom.lineStyle, style.borderBottom.weight);
                    }
                    if (style.borderLeft) {
                        styleObj.borderLeft = new window.GC.Spread.Sheets.LineBorder(style.borderLeft.color, style.borderLeft.lineStyle, style.borderLeft.weight);
                    }
                    if (style.borderRight) {
                        styleObj.borderRight = new window.GC.Spread.Sheets.LineBorder(style.borderRight.color, style.borderRight.lineStyle, style.borderRight.weight);
                    }
                    sheet.setStyle(startRow + row, startCol + col, styleObj);
                }
            }

            // Set merged cells
            const range = new window.GC.Spread.Sheets.Range(startRow, startCol, rowCount, colCount);
            const spans = sheet.getSpans(range);
            for (const span of spans) {
                sheet.removeSpan(span.row, span.col);
            }

            for (const merge of merges) {
                sheet.addSpan(merge.row, merge.col, merge.rowCount, merge.colCount);
            }
        }
    };

    const getCharts = (sheetName) => {
        const sheet = getSheet(sheetName);
        const chartsData = [];
        if (sheet) {
            const charts = sheet.getCharts();

            charts.forEach((chart) => {
                const chartData = chart.getData();
                const chartPosition = chart.getPosition();
                chartsData.push({
                    type: chartData.type,
                    data: chartData.data,
                    position: {
                        x: chartPosition.x,
                        y: chartPosition.y,
                        width: chartPosition.width,
                        height: chartPosition.height,
                    }
                });
            });
        }
        return chartsData;
    };

    const setCharts = (chartsData, sheetName) => {
        const sheet = getSheet(sheetName);
        if (sheet) {
            chartsData.forEach((chart) => {
                sheet.addChart({
                    type: chart.type,
                    data: chart.data,
                    position: chart.position,
                });
            });
        }
    };

    // const copyProcessedData = (startRow, startCol, rowCount, colCount) => {
    //     const values = getProcessedData(startRow, startCol, rowCount, colCount);
    //     setProcessedData(startRow, startCol, values);
    // };

    // const copyRawData = (startRow, startCol, rowCount, colCount) => {
    //     const formulas = getRawData(startRow, startCol, rowCount, colCount);
    //     setRawData(startRow, startCol, formulas);
    // };

    const resetMergingStatus = (startRow, startCol, rowCount, colCount, sheetName) => {
        const sheet = getSheet(sheetName);
        if (sheet) {
            for (let row = 0; row < rowCount; row++) {
                for (let col = 0; col < colCount; col++) {
                    sheet.getCell(startRow + row, startCol + col).unmerge();
                }
            }
        }
    };










    
    return { 
        containerRef, 
        loading, 
        debugInfo, 
        onEventCallbackRef,
        designerRef,
        getSheetNames,
        getSheetJSON,
        setSheetJSON,
        getSheetCSV,
        setSheetCSV,
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
    };
};