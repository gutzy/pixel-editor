import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";
import Canvas from "../../../classes/Canvas";
import FillArea from "../../canvas/FillArea";
import DrawRect from "../../canvas/DrawRect";
import CreateSelectionOverlay from "./CreateSelectionOverlay";

export default class SelectArea extends FileAction {
	do(file, fileProp,x, y, width, height) {
		if (width===0||height===0|| typeof width === "undefined") {
			file[fileProp] = null;
			return;
		}
		file[fileProp] = new Canvas(null, file.width, file.height);
		file[fileProp].doAction(DrawRect, x,y,width,height, "#faaf3f");
        file.doAction(CreateSelectionOverlay);
		EventBus.$emit('redraw-canvas');
	}
}
