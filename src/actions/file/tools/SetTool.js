import {FileAction} from "../../../classes/abstracts/Actions";
import RunToolPersistence from "./RunToolPersistence";
import ToolInfo from "../../tool/ToolInfo";

export default class SetTool extends FileAction {
    async do(file, tool, ...params) {
        if (file.selectedTool) {
            file.selectedTool.selected = false;
        }
        file.selectedTool = tool;
        tool.params = params;
        tool.selected = true;
        tool.doAction(ToolInfo, null);
        tool.select();
        file.toolCanvas = null;
        clearTimeout(file.persistenceTimeout);
        file.doAction(RunToolPersistence);
    }
}
