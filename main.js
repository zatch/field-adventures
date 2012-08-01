/*!
 * 
 *   melonJS
 *   http://www.melonjs.org
 *		
 *   Step by step game creation tutorial
 *
 **/

// game resources
var g_resources= [{
	name: "RPG_Maker_VX_RTP_Tileset_by_telles0808",
	type: "image",
	src: "data/tilesets/RPG_Maker_VX_RTP_Tileset_by_telles0808.png"
},
{
	name: "metatiles32x32",
	type: "image",
	src: "data/area01_tileset/metatiles32x32.png"
},
{
	name: "test-map",
	type: "tmx",
	src: "data/test-map.tmx"
},
{
	name: "player-sprite",
	type: "image",
	src: "data/sprite/32x32_player.png"
},
// the spinning coin spritesheet
{
    name: "spinning_coin_gold",
    type: "image",
    src: "data/sprite/spinning_coin_gold.png"
},
// game font
{
    name: "32x32_font",
    type: "image",
    src: "data/sprite/32x32_font.png"
},
// audio resources
{
    name: "cling",
    type: "audio",
    src: "data/audio/",
    channel: 2
}];


var jsApp = {	
	/* ---
	Initialize the jsApp
	---	*/
	onload: function()
	{
		// Initialize the stage.
		if (!me.video.init('jsapp', 640, 480, false, 1.0))
		{
			alert("Sorry but your browser does not support html 5 canvas.");
			return;
		}
		
		// DEBUG: Render hitboxes.
		// me.debug.renderHitBox = true;
		
		// Initialize the "audio"
		me.audio.init("mp3,ogg");
		
		// Set callback for when assets are loaded.
		me.loader.onload = this.loaded.bind(this);
		
		// Preload resources.
		me.loader.preload(g_resources);

		// Load everything & display a loading screen.
		me.state.change(me.state.LOADING);
	},
	
	/* ---
	Callback when everything is loaded
	---	*/
	loaded: function ()
	{	
		// Set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new PlayScreen());
		
		jsApp.initEntities();
		jsApp.initInputs();
		
		// start the game 
		me.state.change(me.state.PLAY);
	},
	
	/* ---
	Set up input bindings
	---	*/
	initInputs: function() {
		// Set up keyboard controls.
		me.input.bindKey(me.input.KEY.ESCAPE, "main_menu");
		
		me.input.bindKey(me.input.KEY.LEFT, "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.UP, "up");
		me.input.bindKey(me.input.KEY.DOWN, "down");
		
		// Set up mouse controls.
		me.input.bindKey(me.input.KEY.X, "mouse_move");
		me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.X);
	},
	
	/* ---
	Add entities to pool
	---	*/
	initEntities: function() {
		me.entityPool.add("mainPlayer", PlayerEntity);
		me.entityPool.add("CoinEntity", CoinEntity);
	}

}; // jsApp

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend({
	onResetEvent: function() {	
		// stuff to reset on state change
		me.levelDirector.loadLevel("test-map"); 
		
        // add a default HUD to the game mngr
        me.game.addHUD(0, 430, 640, 60);
 
        // add a new HUD item
        me.game.HUD.addItem("score", new ScoreObject(620, 10));
 
        // make sure everyhting is in the right order
        me.game.sort();
	},
	
	/* ---
	action to perform when game is finished (state change)
	---	*/
	onDestroyEvent: function() {
		// remove the HUD
        me.game.disableHUD();
	},
 
    // update function
    update: function() {
		console.log("asdf");
		me.game.HUD.updateItemValue("score", 250);
        // enter pressed ?
        if (me.input.isKeyPressed('main_menu')) {
			// add a new HUD item
			//me.game.HUD.addItem("mainMenu", new MainMenuObject(100, 100));
        }
        return true;
    }

});






//bootstrap :)
window.onReady(function() {
	jsApp.onload();
});
