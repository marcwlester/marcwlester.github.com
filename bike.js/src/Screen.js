var Screen = Class.extend({
	elementId: null,
	element: null,
	app: null,
	keyBindings: {},

	init: function(id) {
		console.log(id);
		this.elementId = id;
		this.element = document.getElementById(id);
		this.element.style.display = 'none';
	},

	render: function(dt) {},

	show: function() {
		this.element.style.display = 'block';
		gInputEngine.attach(this);
		//gInputEngine.applyBindMap(this.keyBindings);
	},
	hide: function() {
		this.element.style.display = 'none';
		gInputEngine.detach(this);
	},

	setApp: function(app) {
		this.app = app;
	}
});