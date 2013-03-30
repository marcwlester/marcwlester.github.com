var BikeGame = Class.extend({
	_screen: null,
	screens: {},

	setScreen: function(scr) {
		if (this._screen != null) this._screen.hide();
		//console.log(scr);
		this._screen = scr;
		this._screen.setApp(this);
		if (this._screen != null) {
			this._screen.show();
		} 
	},

	render: function() {
		if (this._screen != null) {
			this._screen.render(1/60);
		}
		window.requestAnimationFrame(this.render.bind(this));
	},

	resize: function() {
		if (this._screen != null) {
			this._screen.resize();
		}
	},

	run: function() {
		//gInputEngine.setup();
		//jQuery(window).resize(this.resize.bind(this));
		gRenderEngine.loadContent();
		this.setScreen(this.screens['intro']);
		this.render();
	},

	startTrack1: function() {
		gBikeGame.screens['race'].loadTrack('track1', function() {
			jQuery('#finish').hide();
			gBikeGame.setScreen(gBikeGame.screens['race']);
		});
	},

	startTrack2: function() {
		gBikeGame.screens['race'].loadTrack('track2', function() {
			jQuery('#finish').hide();
			gBikeGame.setScreen(gBikeGame.screens['race']);
		});
	},

	startTrack3: function() {
		gBikeGame.screens['race'].loadTrack('track3', function() {
			jQuery('#finish').hide();
			gBikeGame.setScreen(gBikeGame.screens['race']);
		});
	},
	backToMenu: function() {
		this.setScreen(this.screens['intro']);
	}
});

var gBikeGame = new BikeGame();