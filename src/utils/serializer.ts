import { Node, Edge } from '@xyflow/react';

export function serializeToDsl(nodes: Node[], edges: Edge[]): string {
  let dslNodes = '';
  const nodeIdToLabel: Record<string, string> = {};

  // Find groups and standard nodes
  const groups: Record<string, Node[]> = {};
  const standardNodes: Node[] = [];

  for (const node of nodes) {
    if (node.type === 'groupNode') {
       groups[node.id] = [];
    } else if (node.parentId) {
       if (!groups[node.parentId]) groups[node.parentId] = [];
       groups[node.parentId].push(node);
    } else {
       standardNodes.push(node);
    }
  }

  // Define stringifier helper
  const serializeNode = (node: Node, indent = '') => {
    const label = (node.data.label as string) || node.id;
    nodeIdToLabel[node.id] = label;
    const icon = node.data.icon as string;
    return `${indent}${label}${icon ? ` [${icon}]` : ''}\n`;
  };

  // Build string: first groups
  for (const [groupId, childNodes] of Object.entries(groups)) {
    const groupLabel = nodes.find(n => n.id === groupId)?.data.label || groupId;
    dslNodes += `Group ${groupLabel} {\n`;
    for (const child of childNodes) {
       dslNodes += serializeNode(child, '  ');
    }
    dslNodes += `}\n`;
  }

  // Standard nodes without parent
  for (const node of standardNodes) {
    dslNodes += serializeNode(node);
  }

  let dslEdges = '';
  for (const edge of edges) {
    const sourceLabel = nodeIdToLabel[edge.source] || edge.source;
    const targetLabel = nodeIdToLabel[edge.target] || edge.target;
    const label = edge.label ? ` : ${edge.label}` : '';
    
    dslEdges += `${sourceLabel} -> ${targetLabel}${label}\n`;
  }

  const parts = [];
  if (dslNodes) parts.push(dslNodes.trim());
  if (dslEdges) parts.push(dslEdges.trim());
  
  return parts.join('\n\n');
}
