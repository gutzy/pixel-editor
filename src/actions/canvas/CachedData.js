import {CanvasAction} from "../../classes/abstracts/Actions";

export default class CachedData extends CanvasAction {
    do(target, w, h, force = false) {
        if (!target.cachedData || force) target.cachedData = target.ctx.getImageData(0, 0, w, h);
        return target.cachedData;
    }
}
