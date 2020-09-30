let tool = {};

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

}
