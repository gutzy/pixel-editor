import html from "../../utils/html";

export default {
    data: function() {
        return {
            width: 0,
            height: 0,
            widthPercentage: 100,
            heightPercentage: 100
        };
    },

    methods: {
        updateWidth() {

        },

        updateHeight() {

        },
        
        updateWidthPercentage() {

        },

        updateHeightPercentage() {

        },

        toggleKeepRatio() {

        },

        changeAlgorithm() {
            
        }
    },

    mounted() {

    },
    
    template: html`
        <div id = "resize-sprite">
            <button class="close-button"><img src="x.svg" width="20" height="20"}}</button>
            <h1>Scale sprite</h1>
            <!-- SIZE-->
            <h2>New size</h2>
            <span id = "rs-size-menu">
                <div>
                    <span>
                        Width: <input id="rs-width" type="number" default="0" step="1" 
                        value="0" autocomplete="off"/>
                    </span>
                    
                    <span>
                        Height: <input id="rs-height" default="0" step="1" type="number" 
                        value="0" autocomplete="off"/>
                    </span>
                </div>
            </span>        
            <!--BORDERS-->
            <h2>Resize percentages</h2>
            <span id = "rs-percentage-menu">
                <div>
                    <span>
                        Width <input id="rs-width-percentage" type="number" default="0" step="1" 
                        value="0" autocomplete="off"/> %
                    </span>
                    
                    <span>
                        Height <input id="rs-height-percentage" type="number" default="0" step="1" 
                        value="0" autocomplete="off"/> %
                    </span>
                </div>
                <div id = "rs-ratio-div">
                    <span>
                        Keep current ratio <input type = "checkbox" id = "rs-keep-ratio"/>
                    </span>
                    <span>
                        Scaling algorithm:
                        <select name = "resize-algorithm" id = "resize-algorithm-combobox">
                            <option value = "nearest-neighbor">Nearest neighbour</option>
                            <option value = "bilinear-interpolation">Bilinear</option>
                        </select>
                    </span>
                </div>
            </span>
            </br>
            <button id = "resize-sprite-confirm">Scale sprite</button>
        </div>
    `
};