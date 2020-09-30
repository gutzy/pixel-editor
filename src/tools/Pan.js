import Tool from "../classes/abstracts/Tool";
import PanIcon from "../assets/svg/pan.svg";
import PanCursor from "../assets/png/pan.png"
import PanCursorActive from "../assets/png/pan-held.png"
import EventBus from "../utils/EventBus";
import SetDragOffset from "../actions/file/SetDragOffset";

export default class Pan extends Tool {

	constructor() {
		super();

		this.name = "Pan";
		this.icon = PanIcon;
		this.cursor = PanCursor;
		this.cursorOffset = [8, 8];
		this.hotkey = 'p';
		this.spicykey = ' '; // spicy key = hotkey to switch to tool temporarily, only while this key is held
		this.useOutside = true;
	}

	start(file, canvas, x, y) {
		EventBus.$emit('set-tool-cursor', PanCursorActive);

		this.startPos = {x, y};
		this.startOffset = { x: file.dragOffset.x/file.zoom || 0, y: file.dragOffset.y/file.zoom || 0 }
	}

	stop(file, canvas, x, y) {
		EventBus.$emit('set-tool-cursor', PanCursor);
	}

	use(file, canvas, x, y, toolCanvas) {
		let dragOffset = {x: Math.floor(this.startPos.x - x), y: Math.floor(this.startPos.y - y)};
		dragOffset.x += this.startOffset.x; dragOffset.y += this.startOffset.y;
		dragOffset.x *= file.zoom; dragOffset.y *= file.zoom;

		file.doAction(SetDragOffset, dragOffset);
	}

}
