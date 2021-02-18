## New Pixel Editor app structure
This is a basic guide of how to get around the new app structure and how to go about doing 
different development stuff. 

**New Code**

Besides switching to ES6 includes via webpack, all of the new codebase is under the `src/`
folder, and is compiled to the `dist/` folder with Webpack.

**Legacy Code**

A lot of old legacy code remains for reverse-engineering purposes under the `_ext/`, `js/`,
`css/`, `images/` and `views/` folders. However this code is unused, and any changes should 
be done under the new `src/` folder.

**Vue replacing handlebars**

All the HTML templates are now rendered in Vue instead of Handlebars. The main app is in
`index.js` and it also launches the pixel editor, while the sub-components are under
`src/components/`. The components communicate with the pixel editor using `EventBus`, a tiny
events library used in many places across the app, so Vue can also be easily replaced later.

---

### Structure overview

The pixel editor relies heavily on action composition, because this is an effective way
to heavily recycle code and reduce complex tool clutter, so every action done in the editor
is under `src/actions/`, while other parts define tools that use these actions and 
things these actions are used on. Actions can in turn call other actions in their context,
rather than just applying raw code - allowing re-use of ever more complex actions as the 
editor evolves. 

**Most relevant folders**

You will likely only need to work on `src/actions/`, `src/tools/` and `src/config/` to extend the
editor functionality, and perhaps `src/components` if you want to change base HTML templates.

**Folder Structure**

`(root)`
* `index.js` main application file. Vue app/Pixel Editor canvas initialization.

`src/actions/` - action defitions
* `src/actions/app/` global actions performed on the entire app
* `src/actions/canvas/` actions performed on a `Canvas` instance
* `src/actions/file/` actions performed on a `File` instance
* `src/actions/tool/` actions performed on a `Tool` instance

`src/assets/` Static assets. Currently used for image files

`src/classes/` - class definitions
* `src/classes/abstracts/Actions.js` Abstract defintions for all actions
* `src/classes/abstracts/Tool.js` Abstract tool class - all tools inherit from it
* `src/classes/AppManager.js` **App Manager** - handles wiring between main canvas, input
and active editor. 
* `src/classes/Canvas.js` Canvas wrapper. Encapsulates canvas element, runs Canvas Actions.
* `src/classes/Dialog.js` Dialog class. Runs Dialog Actions (to be implemented)
* `src/classes/File.js` File class. Contains drawing data (layers etc.), Runs File Actions.
* `src/classes/History.js` History class. Manages file history (undo/redo) snapshots.
* `src/classes/Input.js` Global Input handler. Intercepts input and sends EventBus events.
* `src/classes/Layer.js` Layer class. manages a file layer (its canvas, name etc.)
* `src/classes/MainCanvas.js` extends Canvas. Contains some specialized main canvas actions.
* `src/classes/Palette.js` Palette class. Defines a palette (still unused)

`src/components/` - Vue components
* `src/components/ColorPalette.js` Color Palette component
* `src/components/Dialog.js` Dialog component (still unused)
* `src/components/LayersPanel.js` Sortable layers list component
* `src/components/MenuBar.js` top application menu component
* `src/components/Toolbox.js` panel containing all the editor tools

`src/config/` - Editor configuration
* `src/config/Core.js` basic app configuration (still unused)
* `src/config/Menu.js` Menu items configuration - items shown in the app menu.
* `src/config/Tools.js` Tools configuration - tools shown in the app toolbox.

`src/scss/` - SASS includes

`src/tools/` - **Tool definitions**. All created tools are here!

`src/utils/` - utilities
* `src/utils/CanvasUtils.js` Canvas utilities, mostly used in Canvas Actions
* `src/utils/ColorUtils.js` Color utilities, mostly color conversion stuff
* `src/utils/EventBus.js` **EventBus library**. Used to send events in and out of the editor.
* `src/utils/InputUtils.js` Input related utilities.


---

### Common Tasks

**Adding a new Tool**
1. create a new tool icon svg, place it under `/src/assets/svg/` 
and optionally a custom cursor, to be placed under `src/assets/png/`.
2. Create a new tool class file under `src/tools/`, for example `CoolTool.js`. 
Use the Paint Bucket tool as a reference to how a complete Tool constructor looks like. 
Create empty start/use/stop methods, as they are required to exist in every tool.
3. Add the newly created tool to the Tools config file, under `src/config/Tools.js`. Now you
should be able to see it in the Toolbox.
4. Implement the Tool's start/use/stop methods. These methods run in the currently active tool
whenever the mouse is pressed (start), moved while pressed (use) or released (stop), and they
are provided the current File, current Canvas, and the mouse event's x/y coordinates. Use 
different Canvas Actions on the current Canvas to perform your desired actions on the currently
active layer/selection canvas. You can stack several actions, use them with conditional logic etc. 
5. If you can't find a Canvas Action that does what you want, you may need to create a new one 
under `/src/actions/canvas/`. Use the DrawRect Canvas Action as a reference to how a simple 
Canvas Action looks like.
