import Undo from "../actions/file/Undo";
import Redo from "../actions/file/Redo";
import CanUndo from "../actions/file/CanUndo";
import CanRedo from "../actions/file/CanRedo";
import AddLayer from "../actions/file/AddLayer";
import DeleteLayer from "../actions/file/DeleteLayer";
import MergeLayerBelow from "../actions/file/MergeLayerBelow";
import FlattenAllLayers from "../actions/file/FlattenAllLayers";
import FlattenVisibleLayers from "../actions/file/FlattenVisibleLayers";

export default {

	"File" : [

	],
	"Edit" : [
		{
			name: "Undo",
			scope: "file",
			action: Undo,
			activeAction: CanUndo
		},
		{
			name: "Redo",
			scope: "file",
			action: Redo,
			activeAction: CanRedo
		}
	],
	"Layer" : [
		{
			name: "New Layer",
			scope: "file",
			action: AddLayer
		},
		{
			name: "Rename",
			scope: "layer",
			emit: "start-renaming-layer"
		},
		{
			name: "Delete",
			scope: "layer",
			action: DeleteLayer
		},
		{
			name: "Merge Below",
			scope: "layer",
			action: MergeLayerBelow
		},
		{
			name: "Flatten Visible",
			scope: "layer",
			action: FlattenVisibleLayers
		},
		{
			name: "Flatten All",
			scope: "layer",
			action: FlattenAllLayers
		}
	],
	"Selection" : [

	],
	"Editor" : [

	],
	"Help" : [

	]

}
