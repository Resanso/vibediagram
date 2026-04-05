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

    const link = document.createElement("a");
    link.download = elementId ? `${elementId}-diagram.png` : "diagram.png";
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Failed to export image", error);
  }
}
