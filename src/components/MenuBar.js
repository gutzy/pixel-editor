import EventBus from "../utils/EventBus";

export default {

	data : function() {
		return {
			menu : [],
		}
	},

	methods : {
		selectMenuItem(menuItem) {
			EventBus.$emit("try-selecting-tool", tool.name);
		}
	},

	mounted() {
		EventBus.$on('set-menu', menu => {
			this.menu = menu;
		});
	},

	template : `
    <div class="menubar">
        <h1>Lospec Pixel Editor</h1>
        <div class="menubar-content">
        	<nav>
        		<div v-for="(group, name) in menu" class="menubar-item">
        			{{name}}
        			<div class="menubar-sub-items" v-if="group.length > 0">
        				<div class="menubar-item" v-for="item in group">
        				{{item.name}}
        				</div>
					</div>
				</div>
			</nav>
		</div>
    </div>
    `

}
