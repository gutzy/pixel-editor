/**
 * History wrapper for file
 * A class that manages history entries for a file, and allows saving and loading history states.
 */

import GetImage from "../actions/canvas/GetImage";

const MAX_SNAPSHOTS = 100;

export default class History {

    /**
     * constructor
     * @param {[]} data - optional, array of existing snapshots
     */
    constructor(data = []) {
        this.snapshots = data;
    }

    /**
     * Create a new history state and save it. Return the snapshot index
     *
     * @param {[]} file - file state to save
     * @param {number|null} activeLayer
     * @param {number|null} index - optional. adds the state to a given index, instead of appending a new one.
     * @param {Canvas|null} selectionCanvas - used to also serialize the selection into the state
     * @return {number} snapshot index
     */
    saveState(file, activeLayer = -1, index = -1, selectionCanvas = null) {
        let d = [];
        const layers = file.layers;
        console.log("Saved state", selectionCanvas);

        // save selection canvas to layers
        if (selectionCanvas) {
            d.push({
                name: '_selection-canvas',
                data: selectionCanvas.doAction(GetImage)
            })
        }

        // serialize each layer and save it
       for (let l = 0; l < layers.length; l++) {
            d.push({
                name : layers[l].name,
                locked: layers[l].locked,
                visible: layers[l].visible,
                active: (activeLayer === l),
                data : layers[l].getImageData()
            })
        }

       // if an index was specified, add the snapshot at the given instance - as the last snapshot
        if (index > -1) {
            this.snapshots.splice(index, this.snapshots.length-index, d);

            // remove first history snapshot if history is too big
            if (this.snapshots.length > MAX_SNAPSHOTS) this.snapshots.shift();
            return index+1;
        }
        // otherwise, just add the snapshot to the end
        else {
            this.snapshots.push(d);

            // remove first history snapshot if history is too big
            if (this.snapshots.length > MAX_SNAPSHOTS) this.snapshots.shift();
            return this.snapshots.length;
        }

    }

    /**
     * Get a history snapshot by index
     * @param {number} index
     * @return {object}
     */
    getState(index) {
        return this.snapshots[index];
    }

    /**
     * Return the size of the history array
     * @return {number}
     */
    size() { return this.snapshots.length }

}
