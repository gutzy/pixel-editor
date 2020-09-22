import {FileAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";
import Layer from "../../classes/Layer";

export default class LoadContents extends FileAction {
	do(file, contents) {
		if (contents.name) file.name = contents.name;
		if (contents.palette) file.palette = contents.palette;
		if (contents.layers)
			for (let l = 0; l < contents.layers.length; l++) {
				const layer = new Layer(file, contents.layers[l].contents, contents.layers[l].name);
				layer.locked = contents.layers[l].locked;
				layer.visible = contents.layers[l].visible;
				layer.inflate(contents.layers[l].data);
				file.layers.push(layer);
				file.activeLayer = l;
			}
	}
}
