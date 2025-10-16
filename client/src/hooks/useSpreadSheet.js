import { useEffect, useRef, useState } from 'react';

export const useSpreadSheet = () => {
    const containerRef = useRef(null);
    const designerRef = useRef(null);
    const onEventRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [debugInfo, setDebugInfo] = useState({ eventCount: 0 });
    
    const handleSpreadsheetEvent = (e) => {
        setDebugInfo(e.detail);
        if (onEventRef.current) {
            onEventRef.current(e);
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
                                if (args.propertyName) eventData.propertyName = args.propertyName;
                                if (args.action) eventData.action = args.action;
                                if (args.sheetName) eventData.sheetName = args.sheetName;
                            }
                            
                            const sheet = spread.getActiveSheet();
                            // Dispatch custom event for React to listen to
                            handleSpreadsheetEvent(new CustomEvent('spreadsheet-event', {
                                detail: {
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
    }, []); // No dependencies, check periodically
    
    return { containerRef, loading, debugInfo, onEventRef };
};