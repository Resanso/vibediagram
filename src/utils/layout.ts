import dagre from 'dagre';
import { Node, Edge, Position } from '@xyflow/react';

export function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'TB') {
  const dagreGraph = new dagre.graphlib.Graph({ compound: true });
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 200;
  const nodeHeight = 58;

  dagreGraph.setGraph({ rankdir: direction, compound: true });

  // 1. Add nodes
  nodes.forEach((node) => {
    if (node.type === 'groupNode') {
      dagreGraph.setNode(node.id, { label: node.data.label }); // Let Dagre calculate
    } else {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    }
  });

  // 2. Map parent-child relationship
  nodes.forEach((node) => {
    if (node.parentId) {
      dagreGraph.setParent(node.id, node.parentId);
    }
  });

  // 3. Add edges
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const groupPaddingX = 40;
  const groupPaddingY = 70; // Header size offset

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const isGroup = node.type === 'groupNode';
    const computedWidth = isGroup ? nodeWithPosition.width : nodeWidth;
    const computedHeight = isGroup ? nodeWithPosition.height : nodeHeight;

    let position = {
      x: nodeWithPosition.x - computedWidth / 2,
      y: nodeWithPosition.y - computedHeight / 2,
    };

    if (node.parentId) {
      const parentWithPosition = dagreGraph.node(node.parentId);
      const parentX = parentWithPosition.x - parentWithPosition.width / 2;
      const parentY = parentWithPosition.y - parentWithPosition.height / 2;
      
      // Calculate relative coordinate and push down/right by groupPADDING offset
      position = {
        x: position.x - parentX + (groupPaddingX / 2),
        y: position.y - parentY + (groupPaddingY / 2),
      };
    }

    let style = node.style || {};
    let finalWidth = computedWidth;
    let finalHeight = computedHeight;
    
    if (isGroup) {
      finalWidth = computedWidth + groupPaddingX;
      finalHeight = computedHeight + groupPaddingY;

      style = {
        ...style,
        width: finalWidth,
        height: finalHeight,
      };
      
      // We must shift parent coordinate left/top by half the padding so children stay centered inside
      position.x -= groupPaddingX / 2;
      position.y -= groupPaddingY / 2;
    }

    return {
      ...node,
      style,
      position,
      width: finalWidth,
      height: finalHeight,
      targetPosition: direction === 'LR' ? Position.Left : Position.Top,
      sourcePosition: direction === 'LR' ? Position.Right : Position.Bottom,
    };
  });

  return { nodes: layoutedNodes, edges };
}
