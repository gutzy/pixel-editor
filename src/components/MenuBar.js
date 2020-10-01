import EventBus from "../utils/EventBus";

export default {

	data : function() {
		return {
			menu : [],
			open: null,
			zoom: 1,
			toolInfo: null,
		}
	},

	methods : {
		selectMenuItem(menuItem) {
			EventBus.$emit("run-menu-item", menuItem);
		},
		openSubMenu(name) {
			this.open = this.open === name ? null : name;
		},
		onHover(name) {
			if (this.open && this.open !== name) this.open = name;
		}
	},

	mounted() {
		EventBus.$on('set-menu', menu => {
			this.menu = menu;
		});

		// blur click behavior
		this.$refs.panel.addEventListener('mousedown', e => e.stopPropagation());
		this.$refs.panel.addEventListener('click', e => e.stopPropagation());

		window.addEventListener('click', () => {
			this.openSubMenu(null)
		})

		// status updates
		EventBus.$on('zoom', (zoom) => this.zoom = zoom);
		EventBus.$on('tool-info', (toolInfo) => this.toolInfo = toolInfo);
	},

	computed : {
		zoomLevel : function() {
			return parseFloat(this.zoom * 100).toFixed(2)+'%';
		}
	},

	template : `
    <div class="menubar" ref="panel">
        <h1>Lospec Pixel Editor</h1>
        <div class="menubar-content">
        	<nav ref="nav">
        		<div v-for="(group, name) in menu" class="menubar-item" @click="openSubMenu(name)" @mouseover="onHover(name)">
        			{{name}}
        			<div class="menubar-sub-items" v-if="group.length > 0 && open == name">
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
    `

}
