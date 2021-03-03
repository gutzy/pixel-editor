/**
 * ChangeSize
 * @ActionType: Tool
 * @Description Changes the size of a tool
 *
 */

import {ToolAction} from "../../classes/abstracts/Actions";
import ToolInfo from "../tool/ToolInfo";
import {clamp} from "../../utils/MathUtils";
import {MaxToolSize} from "../../config/Tools";
import EventBus from "../../utils/EventBus";


export default class ChangeSize extends ToolAction {
    do (tool, delta) {
        tool.size = clamp(tool.size + delta, 1, MaxToolSize);

        // TODO: update brush preview
        tool.doAction(ToolInfo,  {"Size: " : tool.size});
    }
}