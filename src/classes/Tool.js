let tool = {};

//class for tools
export default class Tool {

    constructor(name, options) {

        //stores the name in object, only needed for legacy functions from when currentTool was just a string
        this.name = name;

        //copy options to this object
        if (options.cursor) {
            //passed statically as a string
            if (typeof options.cursor == 'string') this.cursor = options.cursor;
            //passed a function which should be used as a getter function
            if (typeof options.cursor == 'function') Object.defineProperty(this, 'cursor', { get: options.cursor});
        }

        if (options.imageCursor) this.cursor = "url(\'/pixel-editor/"+options.imageCursor+".png\'), auto";

        if (options.brushPreview) {
            this.brushPreview = true;
            this.currentBrushSize = 1;
            this.previousBrushSize = 1;
        }

        //add to tool object so it can be referenced
        tool[name] = this;
    }

    get brushSize () {
        return this.currentBrushSize;
    }

    set brushSize (value) {
        this.currentBrushSize = value;
        this.updateCursor();
    }


    //switch to this tool (replaced global changeTool())
    switchTo () {
        // Ending any selection in progress
        if (currentTool.name.includes("select") && !this.name.includes("select") && !selectionCanceled) {
            endSelection();
        }

        let tools = document.getElementById("tools-menu").children;

        for (let i = 0; i < tools.length; i++) {
            tools[i].classList.remove("selected");
        }

        let buttonNode = document.getElementById(this.name + "-button");
        //give the button of the selected tool the .selected class if the tool has a button
        if(buttonNode != null && buttonNode.parentNode != null) {
            document.getElementById(this.name+"-button").parentNode.classList.add("selected");
        }

        //change cursor
        this.updateCursor();

        return this;
    }
}
