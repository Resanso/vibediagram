import { toPng } from "html-to-image";
import { getNodesBounds, Node, Edge } from "@xyflow/react";

export async function exportToPng(nodes: Node[], elementId?: string, edges?: Edge[]) {
  try {
    const element = document.querySelector(".react-flow__viewport") as HTMLElement;

    if (!element) {
      console.error("Element for PNG export not found");
      return;
    }

    let nodesToExport = nodes;
    if (elementId) {
      nodesToExport = nodes.filter((n) => n.id === elementId || n.parentId === elementId);
    }

    if (nodesToExport.length === 0) return;

    // Filter edges if exporting a specific element (group)
    const nodeIds = new Set(nodesToExport.map(n => n.id));
    let edgesToExport: Set<string> = new Set();
    if (elementId && edges) {
      const validEdges = edges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));
      edgesToExport = new Set(validEdges.map(e => e.id));
    }

    const bounds = getNodesBounds(nodesToExport);
    
    const padding = 40;
    const imageWidth = bounds.width + padding * 2;
    const imageHeight = bounds.height + padding * 2;

    const viewport = {
      x: -bounds.x + padding,
      y: -bounds.y + padding,
      zoom: 1
    };

    // --- FIX FOR HTML-TO-IMAGE BUG (SAFARI / BROWSER SVG ENGINE) ---
    // Sometimes <rect className="react-flow__edge-textbg"> renders as black boxes because
    // html-to-image fails to compute CSS variables or the stylesheets inline.
    // To safely bypass this, we force physical hex-colors into the inline style & attribute temporarily.
    const edgeTextBgs = element.querySelectorAll<SVGRectElement>('.react-flow__edge-textbg');
    const originalFills = Array.from(edgeTextBgs).map(el => el.getAttribute('fill'));
    const originalInlineFills = Array.from(edgeTextBgs).map(el => el.style.fill);

    edgeTextBgs.forEach(el => {
      el.setAttribute('fill', '#ffffff');
      el.style.fill = '#ffffff';
    });

    // Also force edge paths to be visible, as CSS variables for stroke can fail in html-to-image
    const edgePaths = element.querySelectorAll<SVGPathElement>('.react-flow__edge-path');
    const originalStrokes = Array.from(edgePaths).map(el => el.getAttribute('stroke'));
    const originalStrokeWidths = Array.from(edgePaths).map(el => el.getAttribute('stroke-width'));
    
    edgePaths.forEach(el => {
      // Use a standard gray color for edges if we can't compute it
      el.setAttribute('stroke', '#b1b1b7'); 
      el.setAttribute('stroke-width', '2');
      el.style.stroke = '#b1b1b7';
      el.style.strokeWidth = '2px';
    });

    const markers = document.querySelectorAll<SVGPathElement>('marker path');
    const originalMarkerFills = Array.from(markers).map(el => el.getAttribute('fill'));
    markers.forEach(el => {
      el.setAttribute('fill', '#b1b1b7');
      el.style.fill = '#b1b1b7';
    });

    const dataUrl = await toPng(element, {
      backgroundColor: "#ffffff",
      quality: 1,
      pixelRatio: 2, 
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        transformOrigin: "top left",
      },
      filter: (node: HTMLElement) => {
        // Hide handles and export buttons from the final image
        if (node?.classList?.contains('react-flow__handle')) return false;
        if (node?.classList?.contains('export-btn')) return false;

        // Hide nodes that are not part of the export
        if (elementId && node?.classList?.contains('react-flow__node')) {
          const id = node.getAttribute('data-id');
          if (id && !nodeIds.has(id)) return false;
        }

        // Hide edges that are not connecting the exported nodes
        if (elementId && node?.classList?.contains('react-flow__edge')) {
          const id = node.getAttribute('data-id');
          if (id && !edgesToExport.has(id)) return false;
        }

        return true;
      }
    });

    // --- RESTORE DOM STATE ---
    edgeTextBgs.forEach((el, index) => {
      const origFill = originalFills[index];
      if (origFill) el.setAttribute('fill', origFill);
      else el.removeAttribute('fill');
      
      el.style.fill = originalInlineFills[index];
    });

    edgePaths.forEach((el, index) => {
      const origStroke = originalStrokes[index];
      if (origStroke) el.setAttribute('stroke', origStroke); else el.removeAttribute('stroke');
      
      const origStrokeWidth = originalStrokeWidths[index];
      if (origStrokeWidth) el.setAttribute('stroke-width', origStrokeWidth); else el.removeAttribute('stroke-width');

      el.style.stroke = '';
      el.style.strokeWidth = '';
    });

    markers.forEach((el, index) => {
      const origFill = originalMarkerFills[index];
      if (origFill) el.setAttribute('fill', origFill); else el.removeAttribute('fill');
      el.style.fill = '';
    });

    const link = document.createElement("a");
    link.download = elementId ? `${elementId}-diagram.png` : "diagram.png";
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Failed to export image", error);
  }
}
