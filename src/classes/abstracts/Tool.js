import {ToolAction} from "./Actions";

//class for tools
export default class Tool {

    constructor() {
        this.params = [];
        this.name = "Untitled Tool";
        this.selected = false;
    }

    start() { throw new Error("Tool start action not implemented") }
    stop() { throw new Error("Tool stop action not implemented") }
    use() { throw new Error("Tool use action not implemented") }
    select() { }

    doAction(action, ...params) {

        const a = new action();
        if (!(a instanceof ToolAction)) {
            throw new Error("Not a tool action!");
        }
        return a.do(this, ...params);
    }

}
