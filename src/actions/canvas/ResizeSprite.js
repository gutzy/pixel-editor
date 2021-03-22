/**
 * Resize Canvas
 * @ActionType: File
 * @Description Resizes a file to be of the specified dimensions
 *
 */
 import {FileAction} from "../../classes/abstracts/Actions";
 import PutImage from "../../actions/canvas/PutImage";

 export default class ResizeSprite extends FileAction {
    do(file, newWidth, newHeight, algorithm) {
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
            layers[i].canvasAction(PutImage, this.resizeImageData(imageDatas[i], newWidth, newHeight, algorithm));
        }
    }

    /** Resizes an imageData depending on the algorithm and on the new width and height
     * 
     * @param {*} image The imageData to scale
     * @param {*} width The new width of the imageData
     * @param {*} height The new height of the imageData
     * @param {*} algorithm Scaling algorithm chosen by the user in the dialogue
     */
    resizeImageData (image, width, height, algorithm) {
        algorithm = algorithm || 'bilinear-interpolation'
    
        let resize;
        switch (algorithm) {
            case 'nearest-neighbor': resize = this.nearestNeighbor; break
            case 'bilinear-interpolation': resize = this.bilinearInterpolation; break
            default: return image;
        }
    
        const result = new ImageData(width, height)
    
        resize(image, result)
    
        return result
    }

    nearestNeighbor (src, dst) {
        let pos = 0
    
        // Just applying the nearest neighbor algorithm
        for (let y = 0; y < dst.height; y++) {
            for (let x = 0; x < dst.width; x++) {
            const srcX = Math.floor(x * src.width / dst.width)
            const srcY = Math.floor(y * src.height / dst.height)
    
            let srcPos = ((srcY * src.width) + srcX) * 4
    
            dst.data[pos++] = src.data[srcPos++] // R
            dst.data[pos++] = src.data[srcPos++] // G
            dst.data[pos++] = src.data[srcPos++] // B
            dst.data[pos++] = src.data[srcPos++] // A
            }
        }
    }

    bilinearInterpolation (src, dst) {
        // Applying the bilinear interpolation algorithm
    
        function interpolate (k, kMin, kMax, vMin, vMax) {
              return Math.round((k - kMin) * vMax + (kMax - k) * vMin)
        }
      
        function interpolateHorizontal (offset, x, y, xMin, xMax) {
              const vMin = src.data[((y * src.width + xMin) * 4) + offset]
              if (xMin === xMax) return vMin
      
              const vMax = src.data[((y * src.width + xMax) * 4) + offset]
              return interpolate(x, xMin, xMax, vMin, vMax)
        }
      
        function interpolateVertical (offset, x, xMin, xMax, y, yMin, yMax) {
              const vMin = interpolateHorizontal(offset, x, yMin, xMin, xMax)
              if (yMin === yMax) return vMin
      
              const vMax = interpolateHorizontal(offset, x, yMax, xMin, xMax)
              return interpolate(y, yMin, yMax, vMin, vMax)
        }
      
        let pos = 0
      
        for (let y = 0; y < dst.height; y++) {
              for (let x = 0; x < dst.width; x++) {
                const srcX = x * src.width / dst.width
                const srcY = y * src.height / dst.height
        
                const xMin = Math.floor(srcX)
                const yMin = Math.floor(srcY)
        
                const xMax = Math.min(Math.ceil(srcX), src.width - 1)
                const yMax = Math.min(Math.ceil(srcY), src.height - 1)
        
                dst.data[pos++] = interpolateVertical(0, srcX, xMin, xMax, srcY, yMin, yMax) // R
                dst.data[pos++] = interpolateVertical(1, srcX, xMin, xMax, srcY, yMin, yMax) // G
                dst.data[pos++] = interpolateVertical(2, srcX, xMin, xMax, srcY, yMin, yMax) // B
                dst.data[pos++] = interpolateVertical(3, srcX, xMin, xMax, srcY, yMin, yMax) // A
            }
        }
    }
 }