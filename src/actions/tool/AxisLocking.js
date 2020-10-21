import {ToolAction} from "../../classes/abstracts/Actions";
import ToolInfo from "./ToolInfo";
import WatchKey from "./WatchKey";

export default class AxisLocking extends ToolAction {
	do(tool, keyToTrigger = 'Shift', condition = null) {

		const start = tool.start, use = tool.use;

		if (condition) tool.axisCondition = condition;
		else tool.axisCondition = null;

		tool.axisLocking = tool.axis = tool.axisOffset = 0;
		tool.lockAxis = false;
		tool.lastAxisPos = {x:0, y:0};

		tool.doAction(WatchKey, keyToTrigger, isShiftDown => {
			tool.lockAxis = isShiftDown;
		});

		tool.start = (file, canvas, x, y) => {
			tool.axisOffset = {x, y};
			start.call(tool, file,canvas, x, y);
		};

		tool.use = (file, canvas, x, y) => {
			let offset = {x: tool.axisOffset.x - x, y: tool.axisOffset.y - y};
			this._detectAxis(x, y, tool, offset);
			if (tool.axis === -1) x = tool.lastAxisPos.x;
			else if (tool.axis === 1) y = tool.lastAxisPos.y;
			use.call(tool, file,canvas,x,y);
			tool.lastAxisPos = {x,y};
		}

	}

	_detectAxis(x, y, tool, offset) {
		if (tool.lockAxis) {
			if (tool.axisCondition && typeof tool.axisCondition === 'function' && !tool.axisCondition()) return false;

			if (tool.axisLocking >= 5) { // try 5 iterations of generating offset before committing to an axis lock
				if (!tool.axis) { tool.axis = (Math.abs(offset.x) > Math.abs(offset.y)) ? 1:-1; }
			}
			else { tool.axis = 0; tool.axisLocking++; } // accumulate axis offset
			tool.doAction(ToolInfo,{"Mode" : tool.mode, "Axis": tool.axis?(tool.axis>0?"X":"Y"):"Locked"});
		} else { tool.axis = 0; tool.axisLocking = 0; tool.axisOffset = {x, y} } // no lock, no axis.
	}
}
