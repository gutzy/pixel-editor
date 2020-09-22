import {FileAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";
import Layer from "../../classes/Layer";

export default class AddLayer extends FileAction {
	do(file, index) {
		if (index === -1) index = this.activeLayer+1;

		let existing = this.layers.find(l => l.name === name);
		while (existing) {
			let match = name.match(/([0-9]+)$/);
			if (match) {
				name = name.replace(/([0-9]+)$/, match[0]*1+1)
			}
			else {
				name = name + ' 2';
			}
			existing = this.layers.find(l => l.name === name);
		}

		const layer = new Layer(this, null, name);
		layer.inflate();
		if (index > -1) {
			this.layers.splice(index,0,layer);
			this.activeLayer = index;
		}
		else {
			this.layers.push(layer);
			this.activeLayer = this.layers.length-1;
		}

		EventBus.$emit("update-layers", this.layers);
		EventBus.$emit('select-layer', this.layers[this.activeLayer]);
		return layer;
	}
}
