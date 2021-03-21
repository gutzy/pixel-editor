/**
 * Resize Canvas
 * @ActionType: File
 * @Description Resizes a file to be of the specified dimensions
 *
 */
 import {FileAction} from "../../classes/abstracts/Actions";

 export default class ResizeCanvas extends FileAction {
    do(file, newWidth, newHeight) {
        const layers = file.layers;

        file.width = newWidth;
        file.height = newHeight;

        for (const layer of layers) {
            layer.canvas.el.setAttribute('width', newWidth + '');
            layer.canvas.el.setAttribute('height', newHeight + '');
        }
    }
 }