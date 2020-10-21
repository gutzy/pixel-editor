import {FileAction} from "../../../classes/abstracts/Actions";
import ImgDataToCanvas from "../../canvas/ImgDataToCanvas";
import GetMaskImage from "../../canvas/GetMaskImage";
import EventBus from "../../../utils/EventBus";
import DrawImage from "../../canvas/DrawImage";

export default class InitCutImage extends FileAction {

    do(file, canvas) {
        let extra = false;
        if (file.toolSelectionCanvas) {
            extra = canvas.doAction(ImgDataToCanvas, file.toolSelectionCanvas.doAction(GetMaskImage, file.selectionCanvas.el));
        }

        file.toolSelectionCanvas = canvas.doAction(ImgDataToCanvas, canvas.doAction(GetMaskImage, file.selectionCanvas.el));
        if (extra) {
            EventBus.$emit('save-history');
            file.toolSelectionCanvas.doAction(DrawImage, extra.el);
        }

        EventBus.$emit('save-history');
    }

}
