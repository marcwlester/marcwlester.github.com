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
		this.setScreen(this.screens['intro']);
		this.render();
	}
});

var gBikeGame = new BikeGame();