/**
 * Reset layers
 * @ActionType: File / Layers
 * @Description Resets all the layers in a file
 *
 */

import {FileAction} from "../../../classes/abstracts/Actions";

export default class ResetLayers extends FileAction {
	/**
	 *
	 * @param file
	 * @param {[]|null} layers - optional array of layers to reset file to
	 */
	do(file, layers = []) {
		file.layers = layers;
	}
}
