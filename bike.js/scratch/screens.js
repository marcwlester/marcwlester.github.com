var Screen = Class.extend({
	elementId: null,
	element: null,
	app: null,

	init: function(id) {
		console.log(id);
		this.elementId = id;
		this.element = document.getElementById(id);
		this.element.style.display = 'none';
	},

	render: function(dt, input) {

	},

	show: function() {
		this.element.style.display = 'block';
	},
	hide: function() {
		this.element.style.display = 'none';
	},

	setApp: function(app) {
		this.app = app;
	}
});

var Application = Class.extend({
	_screen: null,
	_app: null,
	//_window: window,

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
			//console.log(this._screen);
			this._screen.render(1/60);
		}
		window.requestAnimationFrame(this._app.render);
		//var self = this;
		//window.setTimeout( this._app.render, 1000 / 60 );
		//console.log(self);
	},

	run: function(app) {
		this._app = app;
		this.render();
	}
});


var IntroScreen = new Screen('intro-screen');
IntroScreen.render = function(dt, input) {
	jQuery(this.element).html('hello');
	if (input.pressed('g')) {
		setScreen(RaceScreen);
	}
};
var RaceScreen = new Screen('race-screen');
var PauseScreen = new Screen('pause-screen');
var ResultsScreen = new Screen('results-screen');

var BikeGame = Application.extend({
	init: function() {
		this.setScreen(IntroScreen);
	}
});

//var game = new BikeGame();
//game.run(game);

/*
var g_screen = null;
var input = new THREEx.KeyboardState();
function setScreen(scr) {
	if (g_screen != null) g_screen.hide();
	g_screen = scr;
	g_screen.setApp(this);
	if (g_screen != null) {
		g_screen.show();
	}
}
function render() {
	if (g_screen != null) {
		g_screen.render(1/60, input);
	}
	window.requestAnimationFrame(render);
}

setScreen(IntroScreen);
render();
*/