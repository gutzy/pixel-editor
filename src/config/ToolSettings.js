export const eraser = {cursor: 'crosshair', brushPreview: true};
export const resizeEraser = { cursor: 'default'};
export const eyedropper = { imageCursor: 'eyedropper' };
export const fill = { imageCursor: 'fill' };
export const pan = { cursor: (dragging) => {
    if (dragging) return 'url(\'/pixel-editor/pan-held.png\'), auto';
        else return 'url(\'/pixel-editor/pan.png\'), auto';
    },
};
export const pencil = { cursor: 'crosshair', brushPreview: true };
export const resizeBrush = { cursor: 'default'};
export const rectangle = { cursor: 'crosshair', brushPreview: true };
export const resizeRectangle = { cursor: 'default'};
export const rectSelect = { cursor: 'crosshair' };
export const moveSelection = { cursor: 'crosshair'};
export const zoom = { imageCursor: 'zoom-in'};
