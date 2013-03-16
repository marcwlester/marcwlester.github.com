var Screen = Class.extend({
	elementId: null,
	element: null,
	app: null,

	init: function(id, renderCallback) {
		console.log(id);
		this.elementId = id;
		this.element = document.getElementById(id);
		this.element.style.display = 'none';
		this.render = renderCallback || function(dt) {};
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