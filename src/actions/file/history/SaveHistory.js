import {FileAction} from "../../../classes/abstracts/Actions";
import History from "../../../classes/History";

export default class SaveHistory extends FileAction {
    do(file) {
        if (!file.history) file.history = new History();
        file.historyIndex = file.history.saveState(file.layers, file.activeLayer, file.historyIndex, file.toolSelectionCanvas);
    }
}
