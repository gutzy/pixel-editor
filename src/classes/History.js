const MAX_SNAPSHOTS = 100;

export default class History {

    constructor(data = []) {
        this.snapshots = data;
    }

    saveState(layers, index = -1) {
        let d = [];
        for (let l = 0; l < layers.length; l++) {
            d.push({
                name : layers[l].name,
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
        console.log(index);
        return this.snapshots[index];
    }

    size() { return this.snapshots.length }

}
