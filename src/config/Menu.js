/**
 * @Config Menu Configuration.
 * Defines the structure on the Pixel editor's menu.
 *
 * Structure definition:
 * {
 *     "Top Level Menu" : [
 * 		{
 *     		name: "Action name",
 *     		scope: "app/file/layer", // defines on which scope (app/current file/current layer) the action should run
 *     		scopeParam: "additionalParameter", // defines an extra-refinement of the target designation, like a scope's prop
 *     		action: actionFunction, // the action to run
 *		     activeAction: actionValidatorFunction, // a validator function, if it return false the action is disabled
 *     		emit: "event-to-emit", // instead of running an action, just emit the designated event
 * 		}
 *    ]
 * }
 *
 */
import Undo from "../actions/file/history/Undo";
import Redo from "../actions/file/history/Redo";
import CanUndo from "../actions/file/history/CanUndo";
import CanRedo from "../actions/file/history/CanRedo";
import AddLayer from "../actions/file/layers/AddLayer";
import DeleteLayer from "../actions/file/layers/DeleteLayer";
import MergeLayerBelow from "../actions/file/layers/MergeLayerBelow";
import FlattenAllLayers from "../actions/file/layers/FlattenAllLayers";
import FlattenVisibleLayers from "../actions/file/layers/FlattenVisibleLayers";
import TogglePixelGrid from "../actions/app/TogglePixelGrid";
import TrimCanvas from "../actions/file/TrimCanvas";

export default {
  File: [
    {
      name: "New",
      scope: "app",
      emit: "ui-open-dialog",
      scopeParam: "new-file",
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
    },
  ],
  Edit: [
    {
      name: "Resize canvas",
      scope: "app",
      emit: "ui-open-dialog",
      scopeParam: "resize-canvas"
    },
    {
      name: "Scale sprite",
      scope: "app",
      emit: "ui-open-dialog",
      scopeParam: "scale-sprite"
    },
    {
      name: "Trim canvas",
      scope: "file",
      action: TrimCanvas
    },
    {
      name: "Undo",
      scope: "file",
      action: Undo,
      activeAction: CanUndo,
    },
    {
      name: "Redo",
      scope: "file",
      action: Redo,
      activeAction: CanRedo,
    },
  ],
  Layer: [
    {
      name: "New Layer",
      scope: "file",
      action: AddLayer,
    },
    {
      name: "Rename",
      scope: "layer",
      emit: "ui-start-renaming-layer",
    },
    {
      name: "Delete",
      scope: "layer",
      action: DeleteLayer,
      scopeParam: "name",
    },
    {
      name: "Merge Below",
      scope: "layer",
      action: MergeLayerBelow,
      scopeParam: "name",
    },
    {
      name: "Flatten Visible",
      scope: "file",
      action: FlattenVisibleLayers,
    },
    {
      name: "Flatten All",
      scope: "file",
      action: FlattenAllLayers,
    },
  ],
  Selection: [
    {
      name: "Copy",
      scope: "layer",
      emit: "copy-selection",
    },
    {
      name: "Cut",
      scope: "layer",
      emit: "cut-selection",
    },
    {
      name: "Paste",
      scope: "layer",
      emit: "paste-selection",
    },
    {
      name: "Clear Selection",
      scope: "layer",
      emit: "clear-selection",
    },
  ],
  Editor: [
    {
      name: "Show Pixel Grid",
      scope: "app",
      type: "bool",
      value: true,
      emit: "toggle-pixel-grid",
      action: TogglePixelGrid,
    },
    {
      name: "Switch to Basic Mode",
      scope: "app",
    },
  ],
  Help: [
    {
      name: "Settings",
      scope: "app",
      emit: "ui-open-dialog",
      scopeParam: "settings-dialog",
    },
    {
      name: "Help",
      scope: "app",
      emit: "ui-open-dialog",
      scopeParam: "help-dialog",
    },
    {
      name: "About",
      scope: "app",
      emit: "ui-open-dialog",
      scopeParam: "about-dialog",
    },
    {
      name: "Changelog",
      scope: "app",
      emit: "ui-open-dialog",
      scopeParam: "changelog-dialog",
    },
  ],
};
