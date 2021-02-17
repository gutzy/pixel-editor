import {DialogAction} from "./abstracts/Actions";

export default class Dialog {

    constructor() {
        this.dialog = null;
    }

    /**
     * Run a dialog action on a dialog
     */
    doAction(action, ...params) {
        if (!(action instanceof DialogAction)) {
            throw new Error("Not a dialog action!");
        }

        return new action().do(this.dialog, ...params);
    }
}
