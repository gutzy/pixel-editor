import PutImage from "../canvas/PutImage";
import {FileAction} from "../../classes/abstracts/Actions";
import SaveHistory from "../file/history/SaveHistory";

export default class ResizeCanvas extends FileAction {
    do(file, pivot, left, right, top, bottom, saveHistory = true) {
        let leftToApply = 0;
        let topToApply = 0;

        let originLeft = 0;
        let originTop = 0;

        let newWidth = file.width + left + right;
        let newHeight = file.height + top + bottom;

        console.log("width: " + newWidth + ", height: " + newHeight);

        switch (pivot) {
            case 'top':
                leftToApply = (left + right) / 2;
                break;
            case 'topright':
                leftToApply = left + right;
                break;
            case 'left':
                topToApply = (top + bottom) / 2;
                break;
            case 'middle':
                topToApply = (top + bottom) / 2;
                leftToApply = (left + right) / 2;
                break;
            case 'right':
                topToApply = (top + bottom) / 2;
                leftToApply = left + right;
                break;
            case 'bottomleft':
                topToApply = top + bottom;
                break;
            case 'bottom':
                topToApply = top + bottom;
                leftToApply = (left + right) / 2;
                break;
            case 'bottomright':
                topToApply = top + bottom;
                leftToApply = (left + right);
                break;
            default:
                break;
        }

        if (leftToApply < 0) {
            leftToApply = 0;
            originLeft = Math.abs(leftToApply);
        }
        if (topToApply < 0) {
            topToApply = 0;
            originTop = Math.abs(topToApply);
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
            layers[i].canvasAction(PutImage, imageDatas[i], Math.abs(leftToApply), Math.abs(topToApply),0, 0, 
                 newWidth, newHeight);
        }

        // Save the history for canvas resizing, if I'm not undoing or redoing
        if (saveHistory) {
            file.doAction(SaveHistory);
        }
    }
}