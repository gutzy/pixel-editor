import {CanvasAction} from "../../classes/abstracts/Actions";
import Canvas from "../../classes/Canvas";
import DrawRect from "./DrawRect";

const borderColors = ['#ff0000','#00ff00','#0000ff','#ff00ff'];


export default class DrawSelectionMarchingAnts extends CanvasAction {


    do(target, source, offset, size = 8) {

        function type(i) { // border types: 1 = left, 2 = top, 3 = right, 4 = bottom
            if (data[i] === 255 && data[i+2]===255) return 4;
            else if (data[i]===255) return 1;
            else if (data[i+1]===255) return 2;
            else if (data[i+2]===255) return 3;
        }
        const did = [0,0,0,0,0];

        const w = target.el.width, h = target.el.height;

        const data = source.ctx.getImageData(0, 0, w, h).data;
        offset = offset % size;
        did[1] += offset; did[2] -= offset;
        did[3] -= offset; did[4] += offset;
        for (let i = 0; i < data.length; i+= 4) {
            let x = (i/4) % w, y = Math.floor((i/4)/w);

            if (type(i) > 0) {
                switch (type(i)) {
                    case 1: //left
                        if (did[type(i)] <= size) {
                            if (did[type(i)] <= size / 2) target.doAction(DrawRect,x,y,1,1,'#000000');
                            did[type(i)]++;
                        }
                        else did[type(i)] = 0;
                        break;
                    case 2: // top
                        if (did[type(i)] <= size) {
                            if (did[type(i)] <= size / 2) target.doAction(DrawRect,x,y,1,1,'#000000');
                            did[type(i)]++;
                        }
                        else did[type(i)] = 0;
                        break;
                    case 3: // right
                        if (did[type(i)] <= size) {
                            if (did[type(i)] <= size / 2) target.doAction(DrawRect,x,y,1,1,'#000000');
                            did[type(i)]++;
                        }
                        else did[type(i)] = 0;
                        break;
                    case 4: // bottom
                        if (did[type(i)] <= size) {
                            if (did[type(i)] <= size / 2) target.doAction(DrawRect,x,y,1,1,'#000000');
                            did[type(i)]++;
                        }
                        else did[type(i)] = 0;
                        break;
                }
            }
        }
    }

}
