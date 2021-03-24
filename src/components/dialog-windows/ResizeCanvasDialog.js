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
            MiddleButton
        }
    },

    methods: {

    },

    mounted() {

    },
    
    template: html`
    <div id="resize-canvas" style="display: block;">
        <button class="close-button">
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
            <button class="pivot-button" value="topleft"><img :src="TopLeftArrow"/></button>
            <button class="pivot-button" value="top"><img :src="TopArrow"/></button>
            <button class="pivot-button" value="topright"><img :src="TopRightArrow"/></button>
            <button class="pivot-button rc-selected-pivot" value="left"><img :src="LeftArrow"/></button>
            <button class="pivot-button" value="middle"><img :src="MiddleButton"/></button>
            <button class="pivot-button" value="right"><img :src="RightArrow"/></button>
            <button class="pivot-button" value="bottomleft"><img :src="BottomLeftArrow"/></button>
            <button class="pivot-button" value="bottom"><img :src="BottomArrow"/></button>
            <button class="pivot-button" value="bottomright"><img :src="BottomRightArrow"/></button>
        </span>
        <!-- SIZE-->
        <span id = "rc-size-menu">
            <h2>Size</h2>
            <div>
                <span>
                    Width: <input id="rc-width" type="number" default="0" step="1" 
                    value="0" autocomplete="off"/>
                </span>
                
                <span>
                    Height: <input id="rc-height" default="0" step="1" type="number" 
                    value="0" autocomplete="off"/>
                </span>
            </div>
        </span>        
        <!--BORDERS-->
        <span id = "borders-menu">
            <h2>Borders offsets</h2>
            <div>
                <span>
                    Left: <input id="rc-border-left" type="number" default="0" step="1" 
                    value="0" autocomplete="off"/>
                </span>
                
                <span>
                    Right: <input id="rc-border-right" type="number" default="0" step="1" 
                    value="0" autocomplete="off"/>
                </span>
                
                <span>
                    Top: <input id="rc-border-top" type="number" default="0" step="1" 
                    value="0" autocomplete="off"/>
                </span>
                
                <span>
                    Bottom: <input id="rc-border-bottom" default="0" step="1" type="number" 
                    value="0" autocomplete="off"/>
                </span>
            </div>
            <button id = "resize-canvas-confirm">Resize canvas</button>
        </span>            
    </div>
    `
};