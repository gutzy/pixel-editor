import {FileAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";
import Layer from "../../classes/Layer";

export default class AddLayer extends FileAction {
	do(file, name = "Untitled Layer", index = -1) {
		if (index === -1) index = file.activeLayer+1;

		let existing = file.layers.find(l => l.name === name);
		while (existing) {
			let match = name.match(/([0-9]+)$/);
			if (match) {
				name = name.replace(/([0-9]+)$/, match[0]*1+1)
			}
			else {
				name = name + ' 2';
			}
			existing = file.layers.find(l => l.name === name);
		}

		const layer = new Layer(file, null, name);
		layer.inflate();
		if (index > -1) {
			file.layers.splice(index,0,layer);
			file.activeLayer = index;
		}
		else {
			file.layers.push(layer);
			file.activeLayer = file.layers.length-1;
		}

		EventBus.$emit("update-layers", file.layers);
		EventBus.$emit('save-history');
		EventBus.$emit('select-layer', file.layers[file.activeLayer]);
		return layer;
	}
}
