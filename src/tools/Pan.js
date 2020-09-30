import Tool from "../classes/abstracts/Tool";
import PanIcon from "../assets/svg/pan.svg";
import PanCursor from "../assets/png/pan.png"
import PanCursorActive from "../assets/png/pan-held.png"
import GetColor from "../actions/canvas/GetColor";
import SelectColor from "../actions/file/SelectColor";
import DrawRect from "../actions/canvas/DrawRect";

export default class Pan extends Tool {

	constructor() {
		super();

		this.name = "Pan";
		this.icon = PanIcon;
		this.cursor = PanCursor;
		this.cursorOffset = [8, 8];
		this.hotkey = 'p';
	}

	start(file, canvas, x, y) {
		this.cursor = PanCursorActive;
	}
	stop(file, canvas, x, y) {
		this.cursor = PanCursor;
	}

	use(file, canvas, x, y, toolCanvas) {
		// the following code will help debugging the cursor position:
		// toolCanvas.doAction(DrawRect, x, y, 1, 1, null, '#008833')
	}

}
