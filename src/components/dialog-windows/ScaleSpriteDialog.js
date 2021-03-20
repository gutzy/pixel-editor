import html from "../../utils/html";
import AppManager from "../../classes/AppManager";

export default {
    data: function() {
        return {
            width: 0,
            height: 0,
            widthPercentage: 100,
            heightPercentage: 100,
            keepRatio: true
        };
    },

    methods: {
        updateWidth(val, propagate=true) {
            // Getting the right value, if it starts as undefined, it's because the method has
            // been triggered by a window event
            let currVal = val;
            const oldVal = this.width;

            if (currVal === undefined) {
                currVal = parseInt(this.$refs.widthInput.value);
            }

            // Updating width percentage
            this.updateWidthPercentage(this.widthPercentage * (currVal / oldVal), false);

            // this is basically to avoid stack overflows
            if (propagate && this.keepRatio) {                
                // Update height as well if I have to keep the ratio
                this.updateHeight((currVal / oldVal) * this.height, false);
            }

            this.width = Math.round(currVal);
            this.$refs.widthInput.value = currVal;
        },

        updateHeight(val, propagate=true) {
            // Getting the right value, if it starts as undefined, it's because the method has
            // been triggered by a window event
            let currVal = val;
            const oldVal = this.height;

            if (currVal === undefined) {
                currVal = parseInt(this.$refs.heightInput.value);
            }

            // Updating height percentage
            this.updateHeightPercentage(this.heightPercentage * (currVal / oldVal),false);

            if (propagate && this.keepRatio) {
                // Update height as well if I have to keep the ratio
                this.updateWidth((currVal / oldVal) * this.width, false);
            }
            this.height = currVal;
            this.$refs.heightInput.value = Math.round(currVal);
        },
        
        updateWidthPercentage(val, propagate=true) {
            let currVal = val;
            let oldVal = this.widthPercentage;

            if (currVal === undefined) {
                currVal = this.$refs.widthPercentageInput.value;
            }            

            if (propagate) {
                this.updateWidth(this.width * (currVal / oldVal), false);

                if (this.keepRatio) {
                    this.updateHeight(this.height * (currVal / oldVal), false)
                    this.updateHeightPercentage(currVal, false);
                }
            }

            this.widthPercentage = currVal;
            this.$refs.widthPercentageInput.value = Math.round(currVal);
        },

        updateHeightPercentage(val, propagate=true) {
            let currVal = val;
            let oldVal = this.heightPercentage;

            if (currVal === undefined) {
                currVal = this.$refs.heightPercentageInput.value;
            }

            if (propagate) {
                this.updateHeight(this.height * (currVal / oldVal), false);

                if (this.keepRatio) {
                    this.updateWidth(this.width * (currVal / oldVal), false)
                    this.updateWidthPercentage(currVal, false);
                }
            }
            
            this.heightPercentage = currVal;
            this.$refs.heightPercentageInput.value = Math.round(currVal);
        },

        toggleKeepRatio() {
            this.keepRatio = !this.keepRatio;

            // TODO: lock the dimensions depending on the locked percentage values
        },

        changeAlgorithm(newAlgorithm) {
            
        }
    },

    mounted() {
        this.$refs.widthInput.value = AppManager.file.width;
        this.$refs.heightInput.value = AppManager.file.height;

        this.width = AppManager.file.width;
        this.height = AppManager.file.height;
    },

    template: html`
        <div id = "resize-sprite">
            <button class="close-button">
                <svg width="20" height="20" viewBox="0 0 1792 1792">
                    X
                    <path
                    d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"
                    fill="#fff"
                    ></path>
                </svg>
            </button>
            <h1>Scale sprite</h1>
            <!-- SIZE-->
            <h2>New size</h2>
            <span id = "rs-size-menu">
                <div>
                    <span>
                        Width: <input id="rs-width" type="number" default="0" step="1" 
                        value="0" autocomplete="off" @change="updateWidth(undefined)"
                        ref="widthInput"/>
                    </span>
                    
                    <span>
                        Height: <input id="rs-height" default="0" step="1" type="number" 
                        value="0" autocomplete="off" @change="updateHeight(undefined)"
                        ref="heightInput"/>
                    </span>
                </div>
            </span>        
            <!--BORDERS-->
            <h2>Resize percentages</h2>
            <span id = "rs-percentage-menu">
                <div>
                    <span>
                        Width <input id="rs-width-percentage" type="number" default="0" step="1" 
                        value="100" autocomplete="off" @change="updateWidthPercentage(undefined)"
                        ref="widthPercentageInput"/> %
                    </span>
                    
                    <span>
                        Height <input id="rs-height-percentage" type="number" default="0" step="1" 
                        value="100" autocomplete="off" @change="updateHeightPercentage(undefined)"
                        ref="heightPercentageInput"/> %
                    </span>
                </div>
                <div id = "rs-ratio-div">
                    <span>
                        Keep current ratio <input type = "checkbox" id = "rs-keep-ratio" @click="toggleKeepRatio"/>
                    </span>
                    <span>
                        Scaling algorithm:
                        <select name = "resize-algorithm" id = "resize-algorithm-combobox">
                            <option value = "nearest-neighbor" @click='changeAlgorithm("nearest")'>
                                Nearest neighbour
                            </option>

                            <option value = "bilinear-interpolation" @click='changeAlgorithm("bilinear")'>
                                Bilinear
                            </option>
                        </select>
                    </span>
                </div>
            </span>
            </br>
            <button id = "resize-sprite-confirm">Scale sprite</button>
        </div>
    `
};