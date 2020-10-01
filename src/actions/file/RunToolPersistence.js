import {FileAction} from "../../classes/abstracts/Actions";
import Canvas from "../../classes/Canvas";
import EventBus from "../../utils/EventBus";

export default class RunToolPersistence extends FileAction {
    async do(file) {
        clearTimeout(file.persistenceTimeout);
        const tool = file.selectedTool;
        if (tool.persistent) {
            if (file.toolCanvas) tool.persist(file.toolCanvas);
            file.persistenceTimeout = setTimeout(() => this.do(file), 50);
            EventBus.$emit('redraw-canvas')
        }
    }
}
