/**
 * Save History
 * @ActionType: File / History
 * @Description Create a new history snapshot from the current state and save it in the file's history
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import History from "../../../classes/History";

export default class SaveHistory extends FileAction {
    do(file) {
        // create file's history class instance if it doesn't exist
        if (!file.history) file.history = new History();

        // Add history snapshot to file history
        file.historyIndex = file.history.saveState(file.layers, file.activeLayer, file.historyIndex, file.toolSelectionCanvas);
    }
}
