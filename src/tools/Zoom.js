/**
 * @Tool Zoom
 * @author guszi
 *
 * allows zooming in/out of stuff
 */

import Tool from "../classes/abstracts/Tool";
import ZoomIcon from "../assets/svg/zoom.svg";
import ZoomInCursor from "../assets/png/zoom-in.png"
import ZoomOutCursor from "../assets/png/zoom-out.png"
import ZoomIn from "../actions/file/navigation/ZoomIn";
import ZoomOut from "../actions/file/navigation/ZoomOut";

import { ZoomConfig } from "../config/Tools";
import ToolInfo from "../actions/tool/ToolInfo";
import WatchKey from "../actions/tool/WatchKey";
import TrySettingCursor from "../actions/tool/TrySettingCursor";

export default class Zoom extends Tool {

	constructor() {
		super();

		this.id = "zoom";
		this.name = "Zoom";
		this.icon = ZoomIcon;
		this.cursor = ZoomInCursor;
		this.cursorOffset = [8, 6];
		this.hotkey = 'z';
		this.direction = 1;

		this.doAction(WatchKey, ['Alt', 'Shift'], (altIsDown) => {
			this.direction = altIsDown ? -1 : 1;
			this.doAction(TrySettingCursor, this.direction > 0 ? ZoomInCursor : ZoomOutCursor);
			this.doAction(ToolInfo,{"Mode" : (this.direction>0)?"Zoom in":"Zoom out"});
		});
	}

	select() {
		this.doAction(ToolInfo,{"Mode" : (this.direction>0)?"Zoom in":"Zoom out"});
	}

	start(file, canvas, x, y) {	}
	stop(file, canvas, x, y) {
		file.doAction(this.direction > 0 ? ZoomIn : ZoomOut, ZoomConfig.ZoomLevels);
	}

	use(file, canvas, x, y, toolCanvas) {
		// the following code will help debugging the cursor position:
		toolCanvas.doAction(DrawRect, x, y, 1, 1, null, '#008833')
	}

}
