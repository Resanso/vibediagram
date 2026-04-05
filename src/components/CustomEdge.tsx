import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from '@xyflow/react';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} id={id} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <input
            type="text"
            value={(label as string) || ''}
            onChange={(e) => {
              setEdges((eds) =>
                eds.map((edge) => {
                  if (edge.id === id) {
                    return { ...edge, label: e.target.value };
                  }
                  return edge;
                })
              );
            }}
            className="nodrag nopan bg-transparent text-center text-xs font-semibold text-gray-700 outline-none w-auto min-w-[60px]"
            placeholder="Label..."
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}