import { useEffect, useRef, useState } from 'react';
import './SpreadSheetEditor.css';
import { FileSpreadsheet, Loader2 } from 'lucide-react';

const SpreadSheetEditorPage = () => {
  const containerRef = useRef(null);
  const designerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isLibraryLoaded, setLibraryLoaded] = useState(false);

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
        setLoading(true);

        // Load core SpreadJS scripts
        await loadScript('/libs/spreadjs/scripts/gc.spread.sheets.all.min.js');

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

        setLibraryLoaded(true);
        setLoading(false);

      } catch (error) {
        console.error('Failed to load SpreadJS scripts:', error);
        setLoading(false); // Set loading to false on error to avoid infinite loading
      }
    };

    loadScripts();

    // Cleanup
    return () => {
      if (designerRef.current) {
        // Dispose designer if needed
        designerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isLibraryLoaded) {
      const loadEditor = () => {

        // Set culture
        window._ssCulture = "en";

        // Initialize designer
        if (containerRef.current && !designerRef.current) {
          console.log('Initializing SpreadJS Designer...');

          console.log('A...');
          designerRef.current = new window.GC.Spread.Sheets.Designer.Designer(containerRef.current);

          const defaultConfig = window.GC.Spread.Sheets.Designer.ToolBarModeConfig;

          console.log('C...');
          designerRef.current.setConfig(defaultConfig);

          console.log('B...');
          const spread = designerRef.current.getWorkbook();

          // // Load sample Excel file
          // const url = "/libs/spreadjs/1.xlsx"; // Assuming the file is in public/libs/spreadjs/
          // const xhr = new XMLHttpRequest();
          // xhr.open('GET', url, true);
          // xhr.responseType = 'blob';
          // xhr.onload = function (e) {
          //   if (this.status === 200) {
          //     const blob = this.response;
          //     spread.import(blob, function () {}, function () {});
          //   }
          // };
          // xhr.send();

          console.log('D...');
          // Set loading to false once designer is initialized
          setLoading(false);

          console.log('E...');
        }

      }

      loadEditor();
    }
  }, [isLibraryLoaded]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <FileSpreadsheet className="w-24 h-24 mx-auto text-indigo-600 mb-4" />
          <Loader2 className="w-8 h-8 mx-auto mb-4 text-indigo-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      <div
        id="gc-designer-container"
        ref={containerRef}
        className="w-full h-full"
        role="application"
      />
    </div>
  );
};

export default SpreadSheetEditorPage;