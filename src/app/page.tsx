"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { ReactFlow, Controls, Background, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, Node, Edge, addEdge, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { parseDsl } from '@/utils/parser';
import { getLayoutedElements } from '@/utils/layout';
import CustomNode from '@/components/CustomNode';
import GroupNode from '@/components/GroupNode';
import CustomEdge from '@/components/CustomEdge';
import MermaidRenderer from '@/components/MermaidRenderer';
import { serializeToDsl } from '@/utils/serializer';

export default function Home() {
  const nodeTypes = useMemo(() => ({ custom: CustomNode, groupNode: GroupNode }), []);
  const edgeTypes = useMemo(() => ({ custom: CustomEdge }), []);

  const [activeEngine, setActiveEngine] = useState<'vibe-flow' | 'mermaid'>('vibe-flow');
  const [layoutDir, setLayoutDir] = useState('TB');

  const [dsl, setDsl] = useState(`Group Sistem {
  User [user]
  Web Interface [monitor]
}
Backend API [server]
Database [database]

User -> Web Interface : Mengakses web
Web Interface -> Backend API : HTTP Request
Backend API -> Database : Query Data`);
  
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isCanvasInteraction, setIsCanvasInteraction] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setIsCanvasInteraction(true);
      setEdges((eds) => addEdge({ ...params, type: 'custom' }, eds));
    },
    []
  );

  const onNodeDragStop = useCallback(() => {
    setIsCanvasInteraction(true);
  }, []);

  const onNodesDelete = useCallback(() => {
    setIsCanvasInteraction(true);
  }, []);

  const onEdgesDelete = useCallback(() => {
    setIsCanvasInteraction(true);
  }, []);

  useEffect(() => {
    if (activeEngine !== 'vibe-flow') return;
    if (!isCanvasInteraction) return;
    if (nodes.length === 0 && edges.length === 0) return;

    const newDsl = serializeToDsl(nodes, edges);
    setDsl(prev => (prev !== newDsl ? newDsl : prev));
  }, [nodes, edges, isCanvasInteraction, activeEngine]);

  useEffect(() => {
    if (activeEngine !== 'vibe-flow') return;
    
    const timeoutId = setTimeout(() => {
      if (isCanvasInteraction) return;

      try {
        const parsed = parseDsl(dsl);
        
        const flowEdges: Edge[] = parsed.edges.map(e => ({
          ...e,
          id: e.id,
          source: e.source,
          target: e.target,
          type: 'custom',
          label: e.label
        }));
        
        // @ts-ignore
        const layouted = getLayoutedElements(parsed.nodes, flowEdges, layoutDir);
        
        setNodes(layouted.nodes);
        setEdges(layouted.edges);
        setError(null);
      } catch (err) {
        setError("Syntax error: Silakan periksa kembali DSL Anda.");
      }
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [dsl, layoutDir, isCanvasInteraction]);

  return (
    <div className="h-screen w-full flex text-black">
      <div className="w-1/3 p-4 border-r border-gray-200 flex flex-col gap-4 bg-white">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">VibeDiagram Editor</h1>
        </div>
        <select 
          value={activeEngine}
          onChange={(e) => {
            const engine = e.target.value as 'vibe-flow' | 'mermaid';
            setActiveEngine(engine);
            setIsCanvasInteraction(false);
            if (engine === 'vibe-flow') {
              setDsl('Node A -> Node B');
            } else {
              setDsl('sequenceDiagram\\n  Alice->>John: Hello John, how are you?');
            }
          }}
          className="bg-slate-100 border border-slate-300 rounded px-3 py-2 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-sm w-full"
        >
          <option value="vibe-flow">Vibe Flow (Architecture)</option>
          <option value="mermaid">Mermaid.js (Sequence/ERD)</option>
        </select>
        <textarea 
          className="flex-1 w-full p-2 border border-slate-300 rounded-md font-mono text-sm"
          value={dsl}
          onChange={(e) => {
            setIsCanvasInteraction(false);
            setDsl(e.target.value);
          }}
          placeholder="Enter your custom DSL here..."
        />
        {error ? (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        ) : (
          <p className="text-xs text-green-600 font-medium">✓ Auto-saved & rendered</p>
        )}
        <div className="flex gap-2 justify-end">
          <select 
            value={layoutDir}
            onChange={(e) => {
              const newDir = e.target.value;
              setLayoutDir(newDir);
              setIsCanvasInteraction(false);
              // @ts-ignore
              const layouted = getLayoutedElements(nodes, edges, newDir);
              setNodes(layouted.nodes);
              setEdges(layouted.edges);
            }}
            className="bg-white border border-slate-300 rounded px-2 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
          >
            <option value="TB">Top - Bottom</option>
            <option value="LR">Left - Right</option>
          </select>
        </div>
      </div>
      <div className="w-2/3 h-full bg-slate-50 relative" onPointerDown={() => setIsCanvasInteraction(true)}>
        {activeEngine === 'vibe-flow' ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodesDelete={onNodesDelete}
            onEdgesDelete={onEdgesDelete}
            onConnect={onConnect}
            onNodeDragStop={onNodeDragStop}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        ) : (
          <MermaidRenderer code={dsl} />
        )}
      </div>
    </div>
  );
}
