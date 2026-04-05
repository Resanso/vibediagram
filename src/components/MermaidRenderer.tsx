import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false, theme: 'default' });

export default function MermaidRenderer({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ref.current && code) {
      const renderDiagram = async () => {
        try {
          // Bersihkan error sebelumnya
          setError(null);
          // Parse string untuk mengecek validitas sebelum render
          await mermaid.parse(code); 
          const { svg } = await mermaid.render('mermaid-svg-' + Date.now(), code);
          if (ref.current) ref.current.innerHTML = svg;
        } catch (e: any) {
          setError(e?.message || "Invalid Mermaid syntax");
        }
      };
      renderDiagram();
    }
  }, [code]);

  return (
    <div className="w-full h-full relative bg-white flex items-center justify-center overflow-auto">
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-100 text-red-600 p-2 text-xs rounded z-10">
          {error}
        </div>
      )}
      <div ref={ref} className="w-full h-full flex items-center justify-center" />
    </div>
  );
}