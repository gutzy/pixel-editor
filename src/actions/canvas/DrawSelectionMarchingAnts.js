import {CanvasAction} from "../../classes/abstracts/Actions";
import DrawRect from "./DrawRect";

export default class DrawSelectionMarchingAnts extends CanvasAction {
    do(target, imgData, offset, size = 8) {

        let done = {};

        function type(i) { // border types: 1 = left, 2 = top, 3 = right, 4 = bottom
            if (data[i] === 255 && data[i+2]===255) return 4;
            else if (data[i]===255) return 1;
            else if (data[i+1]===255) return 2;
            else if (data[i+2]===255) return 3;
        }
        const did = [0,0,0,0,0];

        const w = imgData.width, h = imgData.height;
        const data = imgData.data;
        offset = offset % size;
        did[1] += offset; did[2] -= offset;
        did[3] -= offset; did[4] += offset;
        let red;

        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                red = Math.floor(y) * (w * 4) + Math.floor(x) * 4;
                if (type(red) > 0) {
                    if (did[type(red)] < size && !done[red]) {
                        if (did[type(red)] < size/2) target.doAction(DrawRect,x,y,1,1,'#aaaaaa');
                        did[type(red)]++;
                        done[red] = true;
                    }
                    else if (!done[red]) {
                        did[type(red)] = 0;
                        target.doAction(DrawRect,x,y,1,1,'#aaaaaa');
                        done[red] = true;
                    }
                }
            }
        }
    }
}
