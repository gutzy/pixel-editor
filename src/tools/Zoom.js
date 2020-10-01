import Tool from "../classes/abstracts/Tool";
import ZoomIcon from "../assets/svg/zoom.svg";
import ZoomInCursor from "../assets/png/zoom-in.png"
import ZoomOutCursor from "../assets/png/zoom-out.png"
import ZoomIn from "../actions/file/ZoomIn";
import EventBus from "../utils/EventBus";
import ZoomOut from "../actions/file/ZoomOut";

import { ZoomConfig } from "../config/Tools";

export default class Zoom extends Tool {

	constructor() {
		super();

		this.name = "Zoom";
		this.icon = ZoomIcon;
		this.cursor = ZoomInCursor;
		this.cursorOffset = [8, 6];
		this.hotkey = 'z';
		this.direction = 1;

		EventBus.$on('input-key-down', this.onKeyChanges.bind(this));
		EventBus.$on('input-key-up', this.onKeyChanges.bind(this));
		EventBus.$on('focus', this.onFocus.bind(this));
	}

	onFocus(input) { this.onKeyChanges(null, input); }

	onKeyChanges(key, input) {
		if (!this.selected) return;
		if (input.isKeyDown('Alt') || input.isKeyDown('Shift')) {
			this.direction = -1;
			EventBus.$emit('set-tool-cursor', ZoomOutCursor)
		}
		else {
			this.direction = 1;
			EventBus.$emit('set-tool-cursor', ZoomInCursor)
		}

		EventBus.$emit('tool-info', {"Direction" : (this.direction>0)?"Zoom in":"Zoom out"})
	}

	select() {
		EventBus.$emit('tool-info', {"Direction" : (this.direction>0)?"Zoom in":"Zoom out"});
	}

	start(file, canvas, x, y) {
		// this.cursor = ZoomCursorActive;
	}
	stop(file, canvas, x, y) {
		file.doAction(this.direction > 0 ? ZoomIn : ZoomOut, ZoomConfig.ZoomLevels);
	}

	use(file, canvas, x, y, toolCanvas) {
		// the following code will help debugging the cursor position:
		// toolCanvas.doAction(DrawRect, x, y, 1, 1, null, '#008833')
	}

}
