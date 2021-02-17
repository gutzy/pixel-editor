/**
 * Axis Locking
 * @ActionType: Tool
 * @Description Allow a tool to lock its axes, so it can be locked to the horizontal or vertical plane
 *
 */
import {ToolAction} from "../../classes/abstracts/Actions";
import ToolInfo from "./ToolInfo";
import WatchKey from "./WatchKey";

export default class AxisLocking extends ToolAction {
	/**
	 *
	 * @param tool
	 * @param {string} keyToTrigger - the key that needs to be held down to lock the axes
	 * @param {function|null} condition - an optional validation function that needs to return true on runtime, to allow axis locking
	 */
	do(tool, keyToTrigger = 'Shift', condition = null) {

		const start = tool.start, use = tool.use;

		// assign condition
		if (condition) tool.axisCondition = condition;
		else tool.axisCondition = null;

		// set axis data
		tool.axisLocking = tool.axis = tool.axisOffset = 0;
		tool.lockAxis = false;
		tool.lastAxisPos = {x:0, y:0};

		// add action to watch for the given keypress and trigger an axis lock
		tool.doAction(WatchKey, keyToTrigger, isShiftDown => {
			tool.lockAxis = isShiftDown;
		});

		// wrapper for the tool's start function, to include initial axis
		tool.start = (file, canvas, x, y) => {
			// initialize axis offset, to calculate which axis to lock to
			tool.axisOffset = {x, y};

			// run tool's start function
			start.call(tool, file,canvas, x, y);
		};

		// wrapper for the tool's use function, that runs the tool on the fixed axis
		tool.use = (file, canvas, x, y) => {
			// get tool offset from last move, and detect axis
			let offset = {x: tool.axisOffset.x - x, y: tool.axisOffset.y - y};
			this._detectAxis(x, y, tool, offset);

			// set fixed x/y according to locked axis
			if (tool.axis === -1) x = tool.lastAxisPos.x;
			else if (tool.axis === 1) y = tool.lastAxisPos.y;

			// run tool's start function
			use.call(tool, file,canvas,x,y);
			tool.lastAxisPos = {x,y};
		}

	}

	// Detect whether the lock axis is x or y, depending on the distance from the offset
	_detectAxis(x, y, tool, offset) {
		if (tool.lockAxis) {
			if (tool.axisCondition && typeof tool.axisCondition === 'function' && !tool.axisCondition()) return false;

			// try 5 iterations of generating offset before committing to an axis lock
			if (tool.axisLocking >= 5) {
				if (!tool.axis) {
					tool.axis = (Math.abs(offset.x) > Math.abs(offset.y)) ? 1:-1;
				}
			}

			// accumulate axis offset
			else {
				tool.axis = 0;
				tool.axisLocking++;
			}

			tool.doAction(ToolInfo,{"Mode" : tool.mode, "Axis": tool.axis?(tool.axis>0?"X":"Y"):"Locked"});
		}
		else {
			// no lock, no axis.
			tool.axis = 0;
			tool.axisLocking = 0;
			tool.axisOffset = {x, y}
		}
	}
}
