import html from "../../utils/html";
import TopArrow from "../../assets/svg/arrows/top.svg";
import BottomArrow from "../../assets/svg/arrows/bottom.svg";
import LeftArrow from "../../assets/svg/arrows/left.svg";
import RightArrow from "../../assets/svg/arrows/right.svg";
import TopRightArrow from "../../assets/svg/arrows/topright.svg";
import TopLeftArrow from "../../assets/svg/arrows/topleft.svg";
import BottomRightArrow from "../../assets/svg/arrows/bottomright.svg";
import BottomLeftArrow from "../../assets/svg/arrows/bottomleft.svg";
import MiddleButton from "../../assets/svg/arrows/middle.svg";
import AppManager from "../../classes/AppManager";

export default {
    data: function() {
        return {
            TopArrow,
            BottomArrow,
            LeftArrow,
            RightArrow,
            TopRightArrow,
            TopLeftArrow,
            BottomRightArrow,
            BottomLeftArrow,
            MiddleButton,

            startWidth: 0,
            startHeight: 0,

            endWidth: 0,
            endHeight: 0,

            left: 0,
            right: 0,
            top: 0,
            bottom: 0,

            pivot: "middle"
        }
    },

    methods: {
        changePivot(newPivot) {
            this.pivot = newPivot;
        },

        updateWidth() {
            this.endWidth = parseInt(this.$refs.widthInput.value);

            console.log("Width ok");

            let right = Math.round((this.endWidth - this.startWidth) / 2);
            let left = this.endWidth - this.startWidth - right;

            this.$refs.leftBorderInput.value = left;
            this.$refs.rightBorderInput.value = right;

        },

        updateHeight() {
            this.endHeight = parseInt(this.$refs.heightInput.value);

            console.log("Height bug");

            let top = Math.round((this.endHeight - this.startHeight) / 2);
            let bottom = this.endHeight - this.startHeight - top;

            this.$refs.topBorderInput.value = top;
            this.$refs.bottomBorderInput.value = bottom;
        },

        updateBorder(borderName) {

        },

        resizeCanvas() {

        },

        closeWindow() {
            EventBus.$emit("ui-close-dialog", null);
        }
    },

    mounted() {
        this.$refs.widthInput.value = AppManager.file.width;
        this.$refs.heightInput.value = AppManager.file.height;

        this.startWidth = AppManager.file.width;
        this.startHeight = AppManager.file.heightInput;
    },
    
    template: html`
    <div id="resize-canvas" style="display: block;">
        <button class="close-button" @click="closeWindow()">
        <svg width="20" height="20" viewBox="0 0 1792 1792">
            X
            <path
            d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"
            fill="#fff"
            ></path>
        </svg>
        </button>
        <h1>Resize canvas</h1>

        <!--PIVOTS-->
        <span id = "pivot-menu">
            <button class="pivot-button" @click="changePivot('topleft')"><img :src="TopLeftArrow"/></button>
            <button class="pivot-button" @click="changePivot('top')"><img :src="TopArrow"/></button>
            <button class="pivot-button" @click="changePivot('topright')"><img :src="TopRightArrow"/></button>
            <button class="pivot-button" @click="changePivot('left')"><img :src="LeftArrow"/></button>
            <button class="pivot-button" @click="changePivot('middle')"><img :src="MiddleButton"/></button>
            <button class="pivot-button" @click="changePivot('right')"><img :src="RightArrow"/></button>
            <button class="pivot-button" @click="changePivot('bottomleft')"><img :src="BottomLeftArrow"/></button>
            <button class="pivot-button" @click="changePivot('bottom')"><img :src="BottomArrow"/></button>
            <button class="pivot-button" @click="changePivot('bottomright')"><img :src="BottomRightArrow"/></button>
        </span>
        <!-- SIZE-->
        <span id = "rc-size-menu">
            <h2>Size</h2>
            <div>
                <span>
                    Width: <input id="rc-width" type="number" default="0" step="1" 
                    value="0" autocomplete="off" ref="widthInput" @change="updateWidth()"/>
                </span>
                
                <span>
                    Height: <input id="rc-height" default="0" step="1" type="number" 
                    value="0" autocomplete="off" ref="heightInput" @change="updateHeight()"/>
                </span>
            </div>
        </span>        
        <!--BORDERS-->
        <span id = "borders-menu">
            <h2>Borders offsets</h2>
            <div>
                <span>
                    Left: <input id="rc-border-left" type="number" default="0" step="1" 
                    value="0" autocomplete="off" ref="leftBorderInput"/>
                </span>
                
                <span>
                    Right: <input id="rc-border-right" type="number" default="0" step="1" 
                    value="0" autocomplete="off" ref="rightBorderInput"/>
                </span>
                
                <span>
                    Top: <input id="rc-border-top" type="number" default="0" step="1" 
                    value="0" autocomplete="off" ref="topBorderInput"/>
                </span>
                
                <span>
                    Bottom: <input id="rc-border-bottom" default="0" step="1" type="number" 
                    value="0" autocomplete="off" ref="bottomBorderInput"/>
                </span>
            </div>
            <button id = "resize-canvas-confirm" @click="resizeCanvas()">Resize canvas</button>
        </span>
    </div>
    `
};