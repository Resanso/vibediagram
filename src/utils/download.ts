import { toPng } from "html-to-image";
import { getNodesBounds, Node } from "@xyflow/react";

export async function exportToPng(nodes: Node[], elementId?: string) {
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
      }
    });

    // --- RESTORE DOM STATE ---
    edgeTextBgs.forEach((el, index) => {
      const origFill = originalFills[index];
      if (origFill) el.setAttribute('fill', origFill);
      else el.removeAttribute('fill');
      
      el.style.fill = originalInlineFills[index];
    });

    const link = document.createElement("a");
    link.download = elementId ? `${elementId}-diagram.png` : "diagram.png";
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Failed to export image", error);
  }
}
