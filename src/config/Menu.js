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
		{
			name: "New",
			scope: "app",
		},
		{
			name: "Save Project",
			scope: "app",
		},
		{
			name: "Open",
			scope: "app",
		},
		{
			name: "Export",
			scope: "app",
		},
		{
			name: "Exit",
			scope: "app",
		}
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
		{
			name: "Copy",
			scope: "layer",
		},
		{
			name: "Cut",
			scope: "layer",
		},
		{
			name: "Paste",
			scope: "layer",
		},
		{
			name: "Clear Selection",
			scope: "layer",
		}
	],
	"Editor" : [
		{
			name: "Switch to Basic Mode",
			scope: "app",
		},
	],
	"Help" : [
		{
			name: "Settings",
			scope: "app"
		},
		{
			name: "Help",
			scope: "app"
		},
		{
			name: "About",
			scope: "app"
		},
		{
			name: "Changelog",
			scope: "app"
		}
	]

}
