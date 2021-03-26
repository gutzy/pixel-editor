import PutImage from "../canvas/PutImage";
import {FileAction} from "../../classes/abstracts/Actions";

export default class ResizeCanvas extends FileAction {
    do(file, pivot, left, right, top, bottom) {
        let leftToApply = 0;
        let topToApply = 0;
        let newWidth = file.width + left + right;
        let newHeight = file.height + top + bottom;

        console.log("qui");

        switch (pivot) {
            case 'topleft':
                break;
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
            layers[i].canvasAction(PutImage, imageDatas[i], 0, 0, 
                leftToApply, topToApply, newWidth, newHeight);
        }
    }
}