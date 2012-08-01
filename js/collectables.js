/*----------------
 a Coin entity
------------------------ */
var CoinEntity = me.CollectableEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function(x, y, settings) {
        // call the parent constructor
        this.parent(x, y, settings);
    },
 
    // this function is called by the engine, when
    // an object is touched by something (here collected)
    onCollision: function() {
	    // do something when collide
		me.audio.play("cling");
		// give some score
		me.game.HUD.updateItemValue("score", 250);
		// make sure it cannot be collected "again"
		this.collidable = false;
		// remove it
		me.game.remove(this);
		
		// shake it baby !
		me.game.viewport.shake(10, 30, me.game.viewport.AXIS.BOTH);
    }
 
});