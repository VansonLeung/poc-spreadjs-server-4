import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { useSpreadSheet } from '../hooks/useSpreadSheet';
import SpreadSheetEditor from '../components/SpreadSheetEditor';
import { useEffect } from 'react';

const SpreadSheetEditorPage = () => {
  const { containerRef, loading, debugInfo, onEventCallbackRef } = useSpreadSheet();
  const { containerRef: containerRef2, loading: loading2, debugInfo: debugInfo2, onEventCallbackRef: onEventCallbackRef2 } = useSpreadSheet();

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

  if (onEventCallbackRef && !onEventCallbackRef.current) {
    onEventCallbackRef.current = (event) => {
      console.log('Event:', event.detail.eventType, event.detail);
    }
  };

  if (onEventCallbackRef2 && !onEventCallbackRef2.current) {
    onEventCallbackRef2.current = (event) => {
      console.log('Event2:', event.detail.eventType, event.detail);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, borderRight: '1px solid #ccc' }}>
        <SpreadSheetEditor containerRef={containerRef} debugInfo={debugInfo} />
      </div>
      <div style={{ flex: 1, borderRight: '1px solid #ccc' }}>
        {loading2 ? null : <SpreadSheetEditor containerRef={containerRef2} debugInfo={debugInfo2} /> }
      </div>
    </div>
  )

};

export default SpreadSheetEditorPage;
