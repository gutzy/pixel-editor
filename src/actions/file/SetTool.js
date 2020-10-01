import {FileAction} from "../../classes/abstracts/Actions";
import Canvas from "../../classes/Canvas";
import EventBus from "../../utils/EventBus";
import RunToolPersistence from "./RunToolPersistence";

export default class SetTool extends FileAction {
    async do(file, tool, ...params) {
        if (file.selectedTool) {
            file.selectedTool.selected = false;
        }
        file.selectedTool = tool;
        tool.params = params;
        tool.selected = true;
        EventBus.$emit('tool-info', null);
        tool.select();
        file.toolCanvas = null;
        clearTimeout(file.persistenceTimeout);
        file.doAction(RunToolPersistence);
    }
}
