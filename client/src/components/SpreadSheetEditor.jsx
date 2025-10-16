import { useSpreadSheet } from '../hooks/useSpreadSheet';

const SpreadSheetEditor = ({ containerRef, debugInfo }) => {

  return (
    <div className="w-full h-screen relative">
      <div
        id="gc-designer-container"
        ref={containerRef}
        className="w-full h-full"
        role="application"
      />
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        fontFamily: 'monospace',
        maxWidth: '350px',
        zIndex: 9999,
        pointerEvents: 'none'
      }}>
        <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>SpreadJS Debugger (Isolated)</div>
        <div>Events: {debugInfo.eventCount}</div>
        {debugInfo.lastEvent && (
          <div style={{ marginTop: '5px' }}>
            <div>Last Event: {debugInfo.lastEvent.type}</div>
            {debugInfo.lastEvent.row !== undefined && <div>Row: {debugInfo.lastEvent.row}, Col: {debugInfo.lastEvent.col}</div>}
            {debugInfo.lastEvent.rowCount !== undefined && <div>Range: {debugInfo.lastEvent.rowCount}×{debugInfo.lastEvent.colCount}</div>}
            {debugInfo.lastEvent.newValue !== undefined && (
              <div>Value: {typeof debugInfo.lastEvent.newValue === 'object'
                ? '[Object]'
                : String(debugInfo.lastEvent.newValue)}</div>
            )}
            {debugInfo.lastEvent.action && <div>Action: {debugInfo.lastEvent.action}</div>}
            {debugInfo.lastEvent.propertyName && <div>Property: {debugInfo.lastEvent.propertyName}</div>}
            <div>Time: {debugInfo.lastEvent.timestamp}</div>
          </div>
        )}
        {debugInfo.sheetInfo && (
          <div style={{ marginTop: '5px' }}>
            <div>Sheet: {debugInfo.sheetInfo.name}</div>
            <div>Size: {debugInfo.sheetInfo.rowCount}×{debugInfo.sheetInfo.columnCount}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpreadSheetEditor;