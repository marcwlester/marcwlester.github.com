var BikeGame = Class.extend({
	_screen: null,
	screens: {},

	setScreen: function(scr) {
		if (this._screen != null) this._screen.hide();
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

	run: function() {
		//gInputEngine.setup();
		this.setScreen(this.screens['intro']);
		this.render();
	}
});

var gBikeGame = new BikeGame();