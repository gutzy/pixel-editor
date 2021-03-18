/**
 * @VueComponent: Dialog Window
 * @Description Receives dialog events and displays the appropriate dialog component
 *
 */
import EventBus from "../utils/EventBus";

// Allow html strings to be formatted with lit-html plugins
// this does absolutely nothing to the code
import html from "../utils/html";

// Dialogs
import NewDialog from "./dialog-windows/NewDialog";
import HelpDialog from "./dialog-windows/HelpDialog";
import AboutDialog from "./dialog-windows/AboutDialog";
import SettingsDialog from "./dialog-windows/SettingsDialog";
import ChangelogDialog from "./dialog-windows/ChangelogDialog";

export default {
  components: {
    NewDialog,
    HelpDialog,
    AboutDialog,
    SettingsDialog,
    ChangelogDialog,
  },

  props: {
    message: String,
  },

  data: function () {
    return {
      type: null,
    };
  },

  methods: {
    closeDialog(e) {
      this.type = null;
    },

    stopPropagation(e) {
      e.preventDefault();
      e.stopPropagation();
    },

    getType() {
      // Making the dialog types explicit so it is not tied to the
      // name of the component directly (in case it ever changes)
      switch (this.type) {
        case "dialog-test":
          return "test-dialog";
        case "new-file":
          return "new-dialog";
        case "help-dialog":
          return "help-dialog";
        case "about-dialog":
          return "about-dialog";
        case "settings-dialog":
          return "settings-dialog";
        case "changelog-dialog":
          return "changelog-dialog";
        default:
          return null;
      }
    },
  },

  mounted() {
    EventBus.$on("ui-open-dialog", (type) => {
      this.type = type;
    });

    EventBus.$on("ui-close-dialog", this.closeDialog);
  },

  template: html`
    <div v-if="getType()" class="dialog-overlay" @click="closeDialog">
      <div class="dialog-window" @click="stopPropagation">
        <component v-bind:is="getType()"></component>
      </div>
    </div>
  `,
};
