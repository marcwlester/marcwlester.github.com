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
		//this.clearScreen();
		gPhysicsEngine.world.Step(1/60, 10, 10);
		gPhysicsEngine.world.DrawDebugData();
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