/**
 * @Tool Magic Wand
 * @author guszi
 *
 * Add all nearby pixels to selection
 */

import Tool from "../classes/abstracts/Tool";
import ToolInfo from "../actions/tool/ToolInfo";
import WatchKey from "../actions/tool/WatchKey";
import MagicWandIcon from "../assets/svg/magic-wand.svg";
import MagicWandCursor from "../assets/png/magic-wand.png"
import FillArea from "../actions/canvas/FillArea";
import Canvas from "../classes/Canvas";
import CreateSelectionOverlay from "../actions/file/selection/CreateSelectionOverlay";
import DrawImage from "../actions/canvas/DrawImage";
import DrawSelectionBorders from "../actions/canvas/DrawSelectionBorders";
import EventBus from "../utils/EventBus";
import DrawToolCanvasOnLayer from "../actions/file/selection/DrawToolCanvasOnLayer";


export default class Select extends Tool {

    constructor() {
        super();

        this.id = "wand";
        this.name = "Magic Wand";
        this.icon = MagicWandIcon;
        this.cursor = MagicWandCursor;
        this.cursorOffset = [2, 2];
        this.hotkey = 'w';

        this.mode = 'select';

        this.doAction(WatchKey, 'Alt', isAltDown => { this.mode = isAltDown ? 'remove':'select'; this._resetInfo(); });
        this.doAction(WatchKey, 'Shift', isShiftDown => { this.mode = isShiftDown ? 'add':this.mode; this._resetInfo(); });
    }

    select() {
        this._resetInfo();
    }


    start(file, canvas, x, y, toolCanvas) {
        // Switch modes
        switch (this.mode) {

            // New selection
            case 'select':
                if (file.toolSelectionCanvas) {
                    console.log("chou?")

                    file.doAction(DrawToolCanvasOnLayer);
                    file.toolSelectionCanvas = null;
                }
                file.selectionCanvas = new Canvas(null, canvas.width, canvas.height);
                file.selectionCanvas.doAction(FillArea, x, y, '#000000', file.layers[file.activeLayer].canvas.ctx);
                file.toolSelectionCanvas = new Canvas(null, canvas.width, canvas.height);
                file.doAction(CreateSelectionOverlay)
                break

            // Add to selection
            case 'add':
                const addCanvas = new Canvas(null, canvas.width, canvas.height);
                addCanvas.doAction(FillArea, x, y, '#000000', file.layers[file.activeLayer].canvas.ctx);
                file.selectionOverlay.doAction(DrawImage, addCanvas.el);
                file.selectionCanvas.doAction(DrawImage, addCanvas.el);

                file.selectionBorders = file.selectionOverlay.doAction(DrawSelectionBorders, file.selectionOverlay, file.zoom, file);
                break

            // Remove from selection
            case 'remove':
                const removeCanvas = new Canvas(null, canvas.width, canvas.height);
                removeCanvas.doAction(FillArea, x, y, '#000000', file.layers[file.activeLayer].canvas.ctx);
                file.selectionOverlay.ctx.globalCompositeOperation = 'destination-out';
                file.selectionCanvas.ctx.globalCompositeOperation = 'destination-out';
                file.selectionOverlay.doAction(DrawImage, removeCanvas.el);
                file.selectionCanvas.doAction(DrawImage, removeCanvas.el);
                file.selectionOverlay.ctx.globalCompositeOperation = 'source-over';
                file.selectionCanvas.ctx.globalCompositeOperation = 'source-over';
                file.selectionBorders = file.selectionOverlay.doAction(DrawSelectionBorders, file.selectionOverlay, file.zoom, file);
                break
        }

        // force the select to cut the element when an attempt to drag is made
        file.forceCut = true;

    }

    stop(file, canvas, x, y, toolCanvas) {}
    use(file, canvas, x, y, toolCanvas) {}

    _resetInfo() {
        this.doAction(ToolInfo,{"Mode" : this.mode });
    }
}
