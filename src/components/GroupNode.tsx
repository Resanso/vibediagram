import { NodeProps, Node, useReactFlow } from '@xyflow/react';
import { exportToPng } from '@/utils/download';

export default function GroupNode({ id, data }: NodeProps<Node<{ label: string }>>) {
  const { getNodes } = useReactFlow();

  return (
    <div 
      data-id={id}
      className="relative border-2 border-dashed border-blue-400 bg-blue-50/30 rounded-lg w-full h-full min-w-[200px] min-h-[150px]"
    >
      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-3 py-2 bg-blue-100/80 rounded-t-md border-b-2 border-dashed border-blue-400 backdrop-blur-sm shadow-sm">
        <span className="font-bold text-sm text-blue-800 tracking-wide">{data.label as string}</span>
        <button 
          onClick={() => exportToPng(getNodes(), id)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold px-2 py-1 flex items-center justify-center rounded shadow-sm border border-blue-700 transition"
          title="Export to PNG"
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          PNG
        </button>
      </div>
    </div>
  );
}