// Allow html strings to be formatted with lit-html plugins
// this does absolutely nothing to the code
import html from "../../utils/html";
import { toggleMenu } from "../../utils/DialogUtils";
import EventBus from "../../utils/EventBus";
import Palettes from "../../config/Palettes";
import Presets from "../../config/Presets";
import {rgbToHex} from "../../utils/ColorUtils";

export default {
  data: function () {
    return {
      paletteMenuActive: false,
      presetMenuActive: false,
      modeMenuActive: false,

      palettes: null,
      presets: null,
      currentPalette: [],
    };
  },

  methods: {
    toggleModeMenu(e) {
      if (!this.modeMenuActive) {
        this.closeMenus(e, false);
      }

      this.modeMenuActive = toggleMenu(
        this.$refs.modeMenu,
        this.modeMenuActive
      );
    },

    togglePaletteMenu(e) {
      if (!this.paletteMenuActive) {
        this.closeMenus(e, false);
      }

      this.paletteMenuActive = toggleMenu(
        this.$refs.paletteMenu,
        this.paletteMenuActive
      );
    },

    togglePresetMenu(e) {
      if (!this.presetMenuActive) {
        this.closeMenus(e, false);
      }

      this.presetMenuActive = toggleMenu(
        this.$refs.presetMenu,
        this.presetMenuActive
      );
    },

    /** Closes all the currently open submenus
     *
     * @param {*} e The event that triggered the function
     * @param {*} clickedOutside Tells whether the function has been called because the
     *                           user clicked outside the submenu or not
     */
    closeMenus(e, clickedOutside = true) {
      if (!clickedOutside || !e.target.className.includes("dropdown-button")) {
        // Close all the currently opened menus, if I'm not clicking on a different dropdown
        if (this.modeMenuActive)
          this.modeMenuActive = toggleMenu(
            this.$refs.modeMenu,
            this.modeMenuActive
          );
        if (this.paletteMenuActive)
          this.paletteMenuActive = toggleMenu(
            this.$refs.paletteMenu,
            this.paletteMenuActive
          );
        if (this.presetMenuActive)
          this.presetMenuActive = toggleMenu(
            this.$refs.presetMenu,
            this.presetMenuActive
          );
      }
    },

    /** Triggered when the user selects a new palette from the palette menu
     *
     * @param {*} name The name of the chosen palette
     * @param {*} palette The array of colours that make up the palette
     */
    changePalette(name, palette) {
      // Setting the palette name as the dropdown button text
      this.$refs.paletteButton.innerHTML = name;
      // Saving the palette
      this.currentPalette = palette;
    },

    changePreset(preset) {
      // Setting the palette name as the dropdown button text
      this.$refs.presetButton.innerHTML = preset.name;

      // Setting the preset data
      this.changePalette(preset.palette.name, preset.palette.colors);
      this.$refs.widthInput.value = preset.width;
      this.$refs.heightInput.value = preset.height;
    },

    browsePalette() {
      this.$refs.loadPaletteHolder.click();
    },

    loadPalette() {
      const files = this.$refs.loadPaletteHolder.files;
      const fileContentType = files[0].type;
      const paletteButton = this.$refs.paletteButton;

      if (files && files[0]) {
        // Checking if the extension is correct
        if (fileContentType == "image/png" || fileContentType == "image/gif") {
          //load file
          let fileReader = new FileReader();
          fileReader.onload = function (e) {
            let img = new Image();

            img.onload = function () {
              //draw image onto a temporary canvas
              let loadPaletteCanvas = document.createElement("canvas");
              let loadPaletteContext = loadPaletteCanvas.getContext("2d");

              loadPaletteCanvas.width = img.width;
              loadPaletteCanvas.height = img.height;

              loadPaletteContext.drawImage(img, 0, 0);

              //create array to hold found colors
              let colorPalette = [];
              let imagePixelData = loadPaletteContext.getImageData(
                0,
                0,
                img.width,
                img.height
              ).data;

              //loop through pixels looking for colors to add to palette
              for (let i = 0; i < imagePixelData.length; i += 4) {
                let color =
                  "#" +
                  rgbToHex(
                    imagePixelData[i],
                    imagePixelData[i + 1],
                    imagePixelData[i + 2]
                  );
                if (colorPalette.indexOf(color) == -1) {
                  colorPalette.push(color);
                }
              }

              this.currentPalette = colorPalette;
              this.$refs.paletteButton.innerHTML = "Loaded palette";
            }.bind(this);

            img.src = e.target.result;
          }.bind(this);
          fileReader.readAsDataURL(files[0]);
        } else alert("Only PNG and GIF files are supported at this time.");
      }
    },

    newPixel() {
      this.handleURL();

      // Adding at least a colour to avoid completely empty palettes
      if (this.currentPalette.length == 0) {
        this.currentPalette = Palettes.Empty.colors;
      }
      EventBus.$emit(
        "new-pixel",
        parseInt(this.$refs.widthInput.value),
        parseInt(this.$refs.heightInput.value),
        "advanced",
        "Funkier Test",
        this.currentPalette
      );

      EventBus.$emit("ui-close-dialog", null);
    },

    close() {
      EventBus.$emit("ui-close-dialog", null);
    },

    // DEBUG
    handleURL() {
      const url = window.location.href;

      console.log("Url: " + url);

      if (!url.endsWith("app")) {
        console.log("url");
      }
    }
  },

  mounted() {
    this.palettes = Palettes;
    this.presets = Presets;
  },

  template: html`<div
    id="new-pixel"
    style="display: block;"
    @click="closeMenus"
  >
    <button class="close-button" @click="close">
      <svg width="20" height="20" viewBox="0 0 1792 1792">
        X
        <path
          d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"
          fill="#fff"
        ></path>
      </svg>
    </button>
    <h1>New Pixel</h1>

    <!-- Editor mode-->
    <h2>Editor mode</h2>
    <button
      id="editor-mode-button"
      class="dropdown-button"
      @click="toggleModeMenu"
      ref="modeButton"
    >
      Choose a mode...
    </button>
    <div id="editor-mode-menu" class="dropdown-menu" ref="modeMenu">
      <button>Basic</button><button>Advanced</button>
    </div>
    <input id="editor-mode" value="Advanced" autocomplete="off" />
    <p id="editor-mode-info"></p>

    <h2>Palette</h2>
    <button
      id="palette-button"
      class="dropdown-button"
      @click="togglePaletteMenu"
      ref="paletteButton"
    >
      Choose a palette...
    </button>
    <div id="palette-menu" class="dropdown-menu" ref="paletteMenu">
      <button id="load-palette-button" @click="browsePalette">
        Load palette...
      </button>

      <input
        type="file"
        ref="loadPaletteHolder"
        id="load-palette-holder"
        accept="image/png, image/gif"
        @change="loadPalette"
        @click="(e)=>e.stopPropagation()"
      />
      <button
        v-for="palette of palettes"
        @click="changePalette(palette.name, palette.colors)"
      >
        {{palette.name}}
      </button>
    </div>

    <!-- Preset-->
    <h2>Preset</h2>
    <button
      id="preset-button"
      class="dropdown-button"
      @click="togglePresetMenu"
      ref="presetButton"
    >
      Choose a preset...
    </button>
    <div id="preset-menu" class="dropdown-menu" ref="presetMenu">
      <button v-for="preset of presets" @click="changePreset(preset)">
        {{preset.name}}
      </button>
    </div>

    <h2>Size</h2>
    <input id="size-width" value="64" autocomplete="off" ref="widthInput" />
    <svg width="16" height="16" viewBox="0 0 1792 1792" class="dimentions-x">
      X
      <path
        d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"
        fill="#fff"
      ></path>
    </svg>
    <input id="size-height" value="64" autocomplete="off" ref="heightInput" />

    <div id="new-pixel-warning" style="display: block;">
      Creating a new pixel will discard your current one.
    </div>
    <div>
      <button id="create-button" class="default" @click="newPixel">
        Create
      </button>
    </div>
  </div>`,
};
