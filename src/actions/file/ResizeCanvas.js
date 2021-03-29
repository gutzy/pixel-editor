import PutImage from "../canvas/PutImage";
import {FileAction} from "../../classes/abstracts/Actions";
import SaveHistory from "../file/history/SaveHistory";

export default class ResizeCanvas extends FileAction {
    do(file, pivot, left, right, top, bottom, saveHistory = true) {
        let newWidth = file.width + left + right;
        let newHeight = file.height + top + bottom;

        let leftToApply = Math.round((newWidth - file.width) / 2);
        let topToApply = Math.round((newHeight - file.height) / 2);

        if (pivot.includes('left')) {
            leftToApply = left;
        }
        else if (pivot.includes('right')) {
            leftToApply = newWidth - right - file.width;
        }

        if (pivot.includes('top')) {
            topToApply = top;
        }
        else if (pivot.includes('bottom')) {
            topToApply = newHeight - bottom - file.height;
        }

        const layers = file.layers;
        const imageDatas = [];

        // Get all image datas of the layers
        for (let i=0; i<layers.length; i++) {
            imageDatas.push(layers[i].getImageData());
        }

        file.width = newWidth;
        file.height = newHeight;

        for (const layer of layers) {
            layer.canvas.el.setAttribute('width', newWidth + '');
            layer.canvas.el.setAttribute('height', newHeight + '');
        }

        // Put all the converted image datas into the layers
        for (let i=0; i<layers.length; i++) {
            layers[i].canvasAction(PutImage, imageDatas[i], Math.abs(leftToApply), 
            Math.abs(topToApply), 0, 0, newWidth, newHeight);
        }

        // Save the history for canvas resizing, if I'm not undoing or redoing
        if (saveHistory) {
            file.doAction(SaveHistory);
        }
    }
}