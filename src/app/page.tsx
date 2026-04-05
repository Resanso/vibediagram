"use client";

import { useState, useCallback } from 'react';
import { ReactFlow, Controls, Background, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { parseDsl } from '@/utils/parser';
import { getLayoutedElements } from '@/utils/layout';

export default function Home() {
  const [dsl, setDsl] = useState(`User [user]
Web Interface [monitor]
Backend API [server]
Database [database]

User -> Web Interface : Mengakses web
Web Interface -> Backend API : HTTP Request
Backend API -> Database : Query Data`);
  
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const handleApplyDsl = () => {
    const parsed = parseDsl(dsl);
    
    const flowEdges: Edge[] = parsed.edges.map(e => ({
      ...e,
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label
    }));
    
    // @ts-ignore
    const layouted = getLayoutedElements(parsed.nodes, flowEdges, 'TB');
    
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  };

  return (
    <div className="h-screen w-full flex text-black">
      <div className="w-1/3 p-4 border-r border-gray-200 flex flex-col gap-4 bg-white">
        <h1 className="text-xl font-bold">VibeDiagram Editor</h1>
        <textarea 
          className="flex-1 w-full p-2 border border-slate-300 rounded-md font-mono text-sm"
          value={dsl}
          onChange={(e) => setDsl(e.target.value)}
          placeholder="Enter your custom DSL here..."
        />
        <button 
          onClick={handleApplyDsl}
          className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-bold"
        >
          Render Diagram
        </button>
      </div>
      <div className="w-2/3 h-full bg-slate-50 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
