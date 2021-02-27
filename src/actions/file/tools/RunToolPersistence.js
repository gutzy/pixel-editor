/**
 * Run Tool Persistence
 * @ActionType: File / Tools
 * @Description If the tool allows, run a 'persist' method that allows persistent updates to the tool canvas,
 * to allow animated tools and advanced features (such as for the select tool) with a loop
 *
 */

import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";

export default class RunToolPersistence extends FileAction {

    async do(file) {
        const tool = file.selectedTool;
        // if selected tool is configured as persistent, subscribe it to the main persistence loop
        if (tool.persistent) {
            this.subscribeToLoop(tool, file)
        }
    }

    subscribeToLoop(tool, file) {
        // on every iteration of the loop, run the tool's persistence method
        EventBus.$on('loop', () => {
            if (file.toolCanvas) tool.persist(file.toolCanvas, file);
        });
    }
}
