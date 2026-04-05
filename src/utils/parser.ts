export function parseDsl(input: string) {
  const nodes = [];
  const edges = [];
  
  const lines = input.split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    
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
        data: { label: id, icon },
        position: { x: 0, y: 0 } // required before layout
      });
    }
  }
  
  return { nodes, edges };
}
