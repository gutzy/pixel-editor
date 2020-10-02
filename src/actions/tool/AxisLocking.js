import {ToolAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";
import ToolInfo from "./ToolInfo";

export default class AxisLocking extends ToolAction {
	do(tool) {

		const use = tool.use;

		this.axisOffset = this.axis = 0;

		tool.use = function() {

			use(...arguments)
		}

	}

	_detectAxis(offset) {
		if (this.lockAxis) {
			if (this.axisOffset >= 3) { // try 3 iterations of generating offset before committing to an axis lock
				if (!this.axis) { this.axis = (Math.abs(offset.x) > Math.abs(offset.y)) ? 1:-1; }
			}
			else { this.axis = 0; this.axisOffset++; } // accumulate axis offset
			this.doAction(ToolInfo,{"Mode" : this.mode, "Axis": this.axis?(this.axis>0?"X":"Y"):"Locked"});
		} else { this.axis = 0; } // no lock, no axis.
	}
}
