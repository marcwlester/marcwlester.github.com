var RaceScreen = Screen.extend({

	keyBindings: {
		65: 'lean-back',
		68: 'lean-forward',
		75: 'drive',
		76: 'over-drive'
	},

	canvas: null,
	ctx: null,
	debugDraw: null,

	MAX_DRIVE: 20,
	MAX_OVERDRIVE: 28,
	motorSpeed: 0,
	motorOn: false,
	motorStep: 0.05,
	minTorque: 200,
	maxTorque: 800,

	init: function(id) {
		//console.log(this.parent);
		this.parent(id);

		this.canvas = document.getElementById('game_canvas');
		this.ctx = this.canvas.getContext('2d');
		this.debugDraw = new b2DebugDraw();
		this.debugDraw.SetSprite(this.ctx);
		this.debugDraw.SetDrawScale(gPhysicsEngine.scale);
		this.debugDraw.SetFillAlpha(0.3);
		this.debugDraw.SetLineThickness(1.0);
		this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		//this.resize();
	},

	render: function(dt) {
		gPhysicsEngine.bodies.bike.rjoint.SetMotorSpeed(0);
		gPhysicsEngine.bodies.bike.rjoint.SetMaxMotorTorque(this.minTorque);
		gPhysicsEngine.bodies.bike.fjoint.SetMotorSpeed(0);
		gPhysicsEngine.bodies.bike.fjoint.SetMaxMotorTorque(10);

		var head_injury = gPhysicsEngine.bodies.bike.base.GetFixtureList().GetUserData().headInjury;
		this.motorOn = false;
		
		if (gInputEngine.action('drive')) {
			this.motorOn = true;
			if (gPhysicsEngine.bodies.bike.base.GetLinearVelocity().x < this.MAX_DRIVE) {
				this.motorSpeed = Math.min(this.motorSpeed + this.motorStep, this.MAX_DRIVE);
				gPhysicsEngine.bodies.bike.rjoint.SetMotorSpeed(-this.motorSpeed);
				
			}
			gPhysicsEngine.bodies.bike.rjoint.SetMaxMotorTorque(this.minTorque);
		} else if (gInputEngine.action('over-drive')) {
			this.motorOn = true;
			if (gPhysicsEngine.bodies.bike.base.GetLinearVelocity().x < this.MAX_OVERDRIVE) {
				this.motorSpeed = Math.min(this.motorSpeed + this.motorStep, this.MAX_OVERDRIVE);
				gPhysicsEngine.bodies.bike.rjoint.SetMotorSpeed(-this.motorSpeed);
			}
			gPhysicsEngine.bodies.bike.rjoint.SetMaxMotorTorque(this.maxTorque);
		}

		if (!this.motorOn) {
			this.motorSpeed -= Math.max(this.motorSpeed - this.motorStep, 0);
			gPhysicsEngine.bodies.bike.rjoint.SetMotorSpeed(0);
			gPhysicsEngine.bodies.bike.rjoint.SetMaxMotorTorque(10);
		}

		if (gInputEngine.action('lean-back')) {
			var angle_speed = 1;
			gPhysicsEngine.bodies.bike.base.ApplyImpulse(new b2Vec2(0,-10 * angle_speed), new b2Vec2(gPhysicsEngine.bodies.bike.base.GetWorldCenter().x + 1.5, gPhysicsEngine.bodies.bike.base.GetWorldCenter().y));
			gPhysicsEngine.bodies.bike.base.ApplyImpulse(new b2Vec2(0,10 * angle_speed), new b2Vec2(gPhysicsEngine.bodies.bike.base.GetWorldCenter().x - 1.5, gPhysicsEngine.bodies.bike.base.GetWorldCenter().y));
		} else if (gInputEngine.action('lean-forward')) {
			var angle_speed = 1;
			gPhysicsEngine.bodies.bike.base.ApplyImpulse(new b2Vec2(0,10 * angle_speed), new b2Vec2(gPhysicsEngine.bodies.bike.base.GetWorldCenter().x + 1.5, gPhysicsEngine.bodies.bike.base.GetWorldCenter().y));
		}

		this.clearScreen();
		gPhysicsEngine.world.Step(1/60, 10, 10);

		if (head_injury) {
			gPhysicsEngine.bodies.bike.base.SetLinearVelocity(new b2Vec2(0,0));
			gPhysicsEngine.bodies.bike.base.SetAngularVelocity(0);
			gPhysicsEngine.bodies.bike.fwheel.SetLinearVelocity(new b2Vec2(0,0));
			gPhysicsEngine.bodies.bike.rwheel.SetLinearVelocity(new b2Vec2(0,0));
			gPhysicsEngine.bodies.bike.fwheel.SetAngularVelocity(0);
			gPhysicsEngine.bodies.bike.rwheel.SetAngularVelocity(0);
			gPhysicsEngine.bodies.bike.base.SetPositionAndAngle(new b2Vec2(gPhysicsEngine.bodies.bike.base.GetPosition().x,0), 0);
			gPhysicsEngine.bodies.bike.fwheel.SetPosition(new b2Vec2(gPhysicsEngine.bodies.bike.fwheel.GetPosition().x,0));
			gPhysicsEngine.bodies.bike.rwheel.SetPosition(new b2Vec2(gPhysicsEngine.bodies.bike.rwheel.GetPosition().x,0));
			gPhysicsEngine.bodies.bike.base.GetFixtureList().GetUserData().headInjury = false;
		}

		gPhysicsEngine.world.DrawDebugData();
		gRenderEngine.render(this.ctx, (this.canvas.width / 3), 100);
		gPhysicsEngine.world.ClearForces();
	},

	resize: function() {
		this.canvas.width = this.canvas.style.width = jQuery(window).width();
		this.canvas.height = this.canvas.style.height = 800;
	},

	clearScreen: function()
	{
		this.ctx.save();
		this.ctx.setTransform(1,0,0,1,0,0);
		this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
		this.ctx.restore();
	},

	loadTrack: function(track) {
		var self = this;
		xhrGet('assets/tracks/' + track + '.json', function(revent) {
			var data = this.response;
			var tdata = JSON.parse(data);
			gPhysicsEngine.init();
			gPhysicsEngine.makeTrack(tdata.size, 1);
			gPhysicsEngine.makeBike(5, 1);
			for (var i = 0; i < tdata.track.length; i++) {
				var pos = tdata.track[i].pos;
				switch(tdata.track[i].type) {
					case "ramp1":
					gPhysicsEngine.makeRamp1(pos, 1);
					break;
					case "ramp2":
					gPhysicsEngine.makeRamp2(pos, 1);
					break;
					case "ramp3":
					gPhysicsEngine.makeRamp3(pos, 1);
					break;
					case "ramp4":
					gPhysicsEngine.makeRamp4(pos, 1);
					break;
				}
			}

			if (self.debugDraw !== null) {
				//console.log(self.debugDraw);
				gPhysicsEngine.world.SetDebugDraw(self.debugDraw);
			}
			//console.log(gPhysicsEngine.world);
		});
	}
});

gBikeGame.screens['race'] = new RaceScreen('screen-race');