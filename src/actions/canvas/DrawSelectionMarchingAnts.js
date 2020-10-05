import {CanvasAction} from "../../classes/abstracts/Actions";
import DrawRect from "./DrawRect";

export default class DrawSelectionMarchingAnts extends CanvasAction {
    do(target, imgData, offset, size = 8) {
        function type(i) { // border types: 1 = left, 2 = top, 3 = right, 4 = bottom
            if (data[i] === 255 && data[i+2]===255) return 4;
            else if (data[i]===255) return 1;
            else if (data[i+1]===255) return 2;
            else if (data[i+2]===255) return 3;
        }
        const did = [0,0,0,0,0];

        const w = target.el.width, h = target.el.height;

        const data = imgData.data;
        offset = offset % size;
        did[1] += offset; did[2] -= offset;
        did[3] -= offset; did[4] += offset;
        for (let i = 0; i < data.length; i+= 4) {
            let x = (i/4) % w, y = Math.floor((i/4)/w);

            if (type(i) > 0) {
                if (did[type(i)] < size) {
                    if (did[type(i)] < size/2) target.doAction(DrawRect,x,y,1,1,'#aaaaaa');
                    did[type(i)]++;
                }
                else {
                    did[type(i)] = 0;
                    target.doAction(DrawRect,x,y,1,1,'#aaaaaa')
                }
            }
        }
    }
}
