/**
 * @VueComponent: Menu Bar
 * @Description The top menu in the application, displaying the different actions available in the menu.
 *
 */
import EventBus from "../utils/EventBus";

export default {
  /**
   * Component State
   * @var menu - array of top-level menu items
   * @var open - name of the currently open menu, exposing sub-menu items
   * @var zoom - the current viewport zoom level
   * @var toolInfo - a hashtable of meta information optionally provided by the active tool
   */
  data: function () {
    return {
      menu: [],
      open: null,
      zoom: 1,
      toolInfo: null,
    };
  },

  methods: {
    /**
     * Select Menu Item - Emits 'run-menu-item' event to the editor
     *
     * @param menuItem - the selected item to run
     */
    selectMenuItem(menuItem) {
      EventBus.$emit("run-menu-item", menuItem);
    },

    /**
     * Open Sub Menu - toggles opening a menu to show its sub menu items
     *
     * @param name - top-level menu item name
     */
    openSubMenu(name) {
      this.open = this.open === name ? null : name;
    },

    /**
     * On Hover - used to switching currently open top-level menu when hovering on the next ones, to allow
     * browsing actions without closing the currently open menu first
     *
     * * @param name - top-level menu item name
     */
    onHover(name) {
      if (this.open && this.open !== name) this.open = name;
    },
  },

  /**
   * Mounted component hook
   */
  mounted() {
    // bind 'ui-set-menu' editor event to set the items in the menu
    EventBus.$on("ui-set-menu", (menu) => {
      this.menu = menu;
    });

    // blur click behavior - avoid weirdness, stop propagation that will close the menu otherwise
    this.$refs.panel.addEventListener("mousedown", (e) => e.stopPropagation());
    this.$refs.panel.addEventListener("click", (e) => e.stopPropagation());

    // when make a propagated click close the menu
    window.addEventListener("click", () => {
      this.openSubMenu(null);
    });

    // status updates
    EventBus.$on("ui-zoom", (zoom) => (this.zoom = zoom));
    EventBus.$on("ui-tool-info", (toolInfo) => (this.toolInfo = toolInfo));
  },

  computed: {
    /**
     * translate zoom level to percentage
     */
    zoomLevel: function () {
      return parseFloat(this.zoom * 100).toFixed(2) + "%";
    },
  },

  /**
   * Rendered template
   */
  template: `
    <div class="menubar" ref="panel">
        <h1>Lospec Pixel Editor</h1>
        <div class="menubar-content">
        	<nav ref="nav">
        		<div v-for="(group, name) in menu" class="menubar-item" @click="openSubMenu(name)" @mouseover="onHover(name)">
        			{{name}}
        			<div class="menubar-sub-items" v-if="group.length > 0 && open === name">
        				<div class="menubar-item" v-for="item in group" @click="selectMenuItem(item)">
        				{{item.name}}
        				</div>
					</div>
				</div>
			</nav>
			<div class="menubar-status">
				<div class="status">
					<span>Zoom: <b>{{zoomLevel}}</b></span>
				</div>
				<div v-if="toolInfo" v-for="(info, key) in toolInfo" class="status">
					<span>{{key}}: <b>{{info}}</b></span>
				</div>
			</div>
		</div>
    </div>
    `,
};
