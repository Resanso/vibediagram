export function parseDsl(input: string) {
  const nodes: any[] = [];
  const edges: any[] = [];
  const parentStack: string[] = [];
  
  const lines = input.split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    
    // Check if it's a group start
    if (line.startsWith('Group ') && line.endsWith('{')) {
      const groupId = line.substring(6, line.length - 1).trim();
      parentStack.push(groupId);
      
      nodes.push({
        id: groupId,
        type: 'groupNode',
        data: { label: groupId },
        position: { x: 0, y: 0 }
      });
      continue;
    }

    // Check if it's a group end
    if (line === '}') {
      parentStack.pop();
      continue;
    }
    
    // Check if it's an edge
    if (line.includes('->')) {
      const parts = line.split('->');
      const source = parts[0].trim();
      let target = parts[1].trim();
      let label = "";
      
      if (target.includes(':')) {
        const targetParts = target.split(':');
        target = targetParts[0].trim();
        label = targetParts.slice(1).join(':').trim();
      }
      
      edges.push({
        id: `${source}-${target}`,
        source,
        target,
        label: label || undefined,
      });
    } else {
      // It's a node
      let id = line;
      let icon = "";
      
      const bracketsRegex = /\[(.*?)\]/;
      const match = line.match(bracketsRegex);
      if (match) {
        icon = match[1];
        id = line.replace(bracketsRegex, "").trim();
      }
      
      nodes.push({
        id,
        type: 'custom',
        data: { label: id, icon },
        position: { x: 0, y: 0 }, // required before layout
        ...(parentStack.length > 0 && {
          parentId: parentStack[parentStack.length - 1],
          extent: 'parent',
        })
      });
    }
  }
  
  return { nodes, edges };
}
