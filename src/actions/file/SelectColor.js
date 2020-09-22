import {FileAction} from "../../classes/abstracts/Actions";

export default class SelectColor extends FileAction {
	do(file, color) {
		file.color = color
	}
}
