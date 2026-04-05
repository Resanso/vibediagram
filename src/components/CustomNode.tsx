import { Handle, Position, NodeProps, Node, useReactFlow } from '@xyflow/react';

type CustomNodeData = Node<{ label: string; icon?: string }>;

export default function CustomNode({ id, data }: NodeProps<CustomNodeData>) {
  const { updateNodeData } = useReactFlow();

  return (
    <div className="flex flex-row items-center bg-white border border-gray-200 rounded-md shadow-sm p-3 min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-blue-500" />
      
      {data.icon && (
        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-md mr-3 text-xs font-medium text-gray-500">
          {data.icon}
        </div>
      )}
      
      <input
        className="flex-1 font-bold text-gray-800 text-sm bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-400 rounded px-1 nodrag"
        value={data.label}
        onChange={(e) => updateNodeData(id, { label: e.target.value })}
      />

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-blue-500" />
    </div>
  );
}
