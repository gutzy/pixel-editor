import EventBus from "../utils/EventBus";

export default {

	data : function() {
		return {
			menu : [],
			open: null,
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

		const nav = this.$refs.nav;
		nav.addEventListener('click', (e) => { e.stopPropagation() });
		window.addEventListener('click', () => {
			this.openSubMenu(null)
		})
	},

	template : `
    <div class="menubar">
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
		</div>
    </div>
    `

}
