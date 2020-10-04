import GetImage from "../actions/canvas/GetImage";

const MAX_SNAPSHOTS = 100;

export default class History {

    constructor(data = []) {
        this.snapshots = data;
    }

    saveState(layers, activeLayer = -1, index = -1, selectionCanvas = null) {
        let d = [];
        console.log("Saved state", selectionCanvas);

        if (selectionCanvas) {
            d.push({
                name: '_selection-canvas',
                data: selectionCanvas.doAction(GetImage)
            })
        }

       for (let l = 0; l < layers.length; l++) {
            d.push({
                name : layers[l].name,
                locked: layers[l].locked,
                visible: layers[l].visible,
                active: (activeLayer === l),
                data : layers[l].getImageData()
            })
        }

        if (index > -1) {
            this.snapshots.splice(index, this.snapshots.length-index, d);
            if (this.snapshots.length > MAX_SNAPSHOTS) this.snapshots.shift();
            return index+1;
        }
        else {
            this.snapshots.push(d);
            if (this.snapshots.length > MAX_SNAPSHOTS) this.snapshots.shift();
            return this.snapshots.length;
        }

    }

    getState(index) {
        return this.snapshots[index];
    }

    size() { return this.snapshots.length }

}
