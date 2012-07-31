// Borrowed from The Mana World project for a starting point.
var Character = me.ObjectEntity.extend({
	
	// Target that the character will move toward when using mouse/pointer
	// movement.
	target: null,
	
    init: function(x, y, settings) {
        // call the parent constructor
        this.parent(x, y, settings);

        // set the walking speed
        this.setVelocity(2.5, 2.5);

        this.setFriction(0.5, 0.5);
		
        // adjust the bounding box
        this.updateColRect(10,12,16,14);

        // disable gravity
        this.gravity = 0;

        this.firstUpdates = 2;
        this.direction = 'down';
        this.destinationX = x;
        this.destinationY = y;
    },
	
	/**
	 * Returns a vector that points from the origin to the target Vector2d 
	 * object.
	 *
	 * @param origin Start point.
	 * @param target End point.
	 * @param slowdown Should the vector get smaller as we get closer to the target?
	 *
	 */
	_steer: function(origin, target, slowdown) {
		var steer;
		
		// TODO: Make these configurable from higher up.
		var maxSpeed = this.maxVel;
		var maxForce = 5;
		
		var desired = target.clone();
		desired.sub(origin);
		var d = desired.length();
		
		if (d > 0) {
			// Two options for desired vector magnitude (1 -- based on distance, 2 -- maxSpeed)
			if (slowdown && d < 100) {
				desired.length(maxSpeed.length() * (d / 100)); // This damping is somewhat arbitrary
			} else {
				desired.length(maxSpeed);
			}
			steer = desired.clone();
			steer.sub(this.vel);
			steer.length(Math.min(maxForce, steer.length()));
		} else {
			steer = new me.Vector2d(0, 0);
		}
		return steer;
	},
	
	_handlePointerMovement: function() {
		var distance = this.target.clone();
		distance.sub(this.pos);
		
		// Are we there yet?  If not, move toward the target.
		if(distance.length() > 1) {
			
			// Get a heading toward the pointer.
			var steer = this._steer(this.pos, this.target, true);
			steer.normalize();
			
			// Apply steering vector to velocity.
			this.vel.x += this.accel.x * steer.x * me.timer.tick;
			this.vel.y += this.accel.y * steer.y * me.timer.tick;
			
			return true;
			
		} else {
			this.target = null;
			return false;
		}
	},

    update: function() {
        hadSpeed = this.vel.y !== 0 || this.vel.x !== 0;
		
		// Gather current input.
        this.handleInput();
		
		// Use pointer movement (if applicable).
		if(this.target != null) this._handlePointerMovement();
		
        // check & update player movement
        updated = this.updateMovement();
		
		// check for collision
		var res = me.game.collide(this);
		
        if (this.vel.y === 0 && this.vel.x === 0) {
            if (hadSpeed) {
                updated = true;
            }
        }
		
        // update animation
        if (updated) {
            // update object animation
            this.parent(this);
        }
        return updated;
    },

    handleInput: function() {
        if (this.destinationX < this.pos.x - 10)
        {
            this.vel.x -= this.accel.x * me.timer.tick;
            this.direction = 'left';
        }
        else if (this.destinationX > this.pos.x + 10)
        {
            this.vel.x += this.accel.x * me.timer.tick;
            this.direction = 'right';
        }

        if (this.destinationY < this.pos.y - 10)
        {
            this.vel.y = -this.accel.y * me.timer.tick;
            this.direction = 'up';
        }
        else if (this.destinationY > this.pos.y + 10)
        {
            this.vel.y = this.accel.y * me.timer.tick;
            this.direction = 'down';
        }
    }
})

// Borrowed from The Mana World project for a starting point.
var PlayerEntity = Character.extend({

    init: function(x, y, settings) {
        // call the parent constructor
        this.parent(x, y, settings);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		
    },

    handleInput: function() {
        if (me.input.isKeyPressed('left'))
        {
            this.vel.x -= this.accel.x * me.timer.tick;
            this.direction = 'left';
			
			// Cancel pointer movement.
			this.target = null;
        }
        else if (me.input.isKeyPressed('right'))
        {
            this.vel.x += this.accel.x * me.timer.tick;
            this.direction = 'right';
			
			// Cancel pointer movement.
			this.target = null;
        }

        if (me.input.isKeyPressed('up'))
        {
            this.vel.y = -this.accel.y * me.timer.tick;
            this.direction = 'up';
			
			// Cancel pointer movement.
			this.target = null;
        }
        else if (me.input.isKeyPressed('down'))
        {
            this.vel.y = this.accel.y * me.timer.tick;
            this.direction = 'down';
			
			// Cancel pointer movement.
			this.target = null;
        }
		else if (me.input.isKeyPressed("mouse_move")) {
			// Where are we headed?
			var target = me.input.mouse.pos.clone();
			target.add(me.game.viewport.pos);
			
			// center the sprite.
			var w = this.width / 2;
			var h = this.height / 2;
			target.sub(new me.Vector2d(w,h));
			
			this.target = target;
		}
    }

});