/**
 * Initialize Cut Image
 * @ActionType: File / Selection
 * @Description Initialize the selection work layer when a selection was dragged
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import ImgDataToCanvas from "../../canvas/ImgDataToCanvas";
import GetMaskImage from "../../canvas/GetMaskImage";
import EventBus from "../../../utils/EventBus";
import DrawImage from "../../canvas/DrawImage";

export default class InitCutImage extends FileAction {

    /**
     *
     * @param file
     * @param {Canvas} canvas - the canvas from which to cut the image
     */
    do(file, canvas) {
        let extra = false;
        // if a selection already exists, add it later
        if (file.toolSelectionCanvas) {
            extra = canvas.doAction(ImgDataToCanvas, file.toolSelectionCanvas.doAction(GetMaskImage, file.selectionCanvas.el));
        }

        // set the selection work layer to the masked selection data from the target layer
        file.toolSelectionCanvas = canvas.doAction(ImgDataToCanvas, canvas.doAction(GetMaskImage, file.selectionCanvas.el));
        if (extra) {
            // save history snapshot, include old selection canvas
            EventBus.$emit('save-history');
            file.toolSelectionCanvas.doAction(DrawImage, extra.el);
        }

        // save history snapshot
        EventBus.$emit('save-history');
    }

}
