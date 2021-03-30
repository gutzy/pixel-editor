import {FileAction} from "../../classes/abstracts/Actions";
import PutImage from "../canvas/PutImage";
import ResizeCanvas from "../../actions/file/ResizeCanvas";
import IsOpaque from "../../actions/canvas/IsOpaque";

export default class TrimCanvas extends FileAction {
    do(file) {
        const layers = file.layers;
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;

        // Searching the min and max used coordinates in the current file
        for (let i=0; i<layers.length; i++) {
            const canvas = layers[i].canvas;

            for (let j=0; j<file.width; j++) {
                for (let k=0; k<file.height; k++) {
                    if (canvas.doAction(IsOpaque, j, k)) {
                        if (j < minX) {
                            minX = j;
                        }
                        if (j > maxX) {
                            maxX = j;
                        }

                        if (k < minY) {
                            minY = k;
                        }
                        if (k > maxY) {
                            maxY = k;
                        }
                    }
                }
            }
        }

        // We're dealing with canvas dimensions, not with indexes
        minX++; minY++; maxX++; maxY++;

        // Resize the canvas depending on the values 
        file.doAction(ResizeCanvas, 'middle', -minX, file.width-maxX, -minY, file.height-maxY);
    }
}