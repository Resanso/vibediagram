import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

export default function MermaidRenderer({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'default' });
    let isMounted = true;

    if (ref.current && code) {
      const renderDiagram = async () => {
        try {
          setError(null);
          // Parse string untuk mengecek validitas sebelum render
          await mermaid.parse(code); 
          const id = `mermaid-${Math.random().toString(36).substring(2)}`;
          const { svg } = await mermaid.render(id, code);
          
          if (isMounted && ref.current) {
            ref.current.innerHTML = svg;
          }
        } catch (e: any) {
          if (isMounted) {
            // Mermaid terkadang melemparkan error berupa object dengan properti 'str'
            setError(e?.message || e?.str || "Invalid Mermaid syntax");
          }
        }
      };
      renderDiagram();
    }

    return () => {
      isMounted = false;
    };
  }, [code]);

  return (
    <div className="w-full h-full relative bg-white flex items-center justify-center overflow-auto p-4">
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-100/90 backdrop-blur border border-red-200 text-red-600 p-3 text-xs rounded z-10 shadow-sm max-h-40 overflow-auto overflow-wrap">
          <pre className="whitespace-pre-wrap font-mono">{error}</pre>
        </div>
      )}
      <div ref={ref} className="flex items-center justify-center min-w-full min-h-full" />
    </div>
  );
}``