import {ToolAction} from "./Actions";

//class for tools
export default class Tool {

    constructor() {
        this.params = [];
        this.name = "Untitled Tool";
        this.selected = false;
    }

    start(file, canvas, x, y, toolCanvas) { throw new Error("Tool start action not implemented") }
    stop(file, canvas, x, y, toolCanvas) { throw new Error("Tool stop action not implemented") }
    use(file, canvas, x, y, toolCanvas) { throw new Error("Tool use action not implemented") }
    select(file, canvas, x, y, toolCanvas) { }
    hover(file, canvas, x, y, toolCanvas) { }

    doAction(action, ...params) {

        const a = new action();
        if (!(a instanceof ToolAction)) {
            throw new Error("Not a tool action!");
        }
        return a.do(this, ...params);
    }

}
