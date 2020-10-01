import {FileAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";
import Canvas from "../../classes/Canvas";
import FillArea from "../canvas/FillArea";
import DrawRect from "../canvas/DrawRect";

export default class SelectAreaSolidify extends FileAction {
	do(file) {
		console.log("Solidify......");
		this.shrinkCanvas = this.expandCanvas = null;
		EventBus.$emit('redraw-canvas');
	}
}
