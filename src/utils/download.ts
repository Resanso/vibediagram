import { toPng } from 'html-to-image';
import { getNodesBounds, getViewportForBounds, Node } from '@xyflow/react';

export async function exportToPng(nodes: Node[], elementId?: string) {
  try {
    const element = document.querySelector('.react-flow__viewport') as HTMLElement;

    if (!element) {
      console.error('Element for PNG export not found');
      return;
    }

    let nodesToExport = nodes;
    if (elementId) {
      // ONLY use the specific node itself to calculate bounds (it already encompasses children visually).
      // Including children with relative positions breaks getNodesBounds bounding box arithmetic.
      nodesToExport = nodes.filter((n) => n.id === elementId);
    } else {
      // ONLY use top-level nodes for whole diagram export to avoid relative coordinate inflation
      nodesToExport = nodes.filter((n) => !n.parentId);
    }

    if (nodesToExport.length === 0) return;

    const bounds = getNodesBounds(nodesToExport);
    
    const padding = 40;
    const imageWidth = bounds.width + padding * 2;
    const imageHeight = bounds.height + padding * 2;

    const viewport = getViewportForBounds(
      bounds,
      imageWidth,
      imageHeight,
      0.1,  // minZoom
      3,    // maxZoom
      padding // Adds space to the bounds bounding box
    );

    const dataUrl = await toPng(element, {
      backgroundColor: '#ffffff',
      quality: 1,
      pixelRatio: 2, // for sharper images
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      }
    });

    const link = document.createElement('a');
    link.download = elementId ? `${elementId}-diagram.png` : 'diagram.png';
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Failed to export image', error);
  }
}
