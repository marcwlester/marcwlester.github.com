var Screen = Class.extend({
	elementId: null,
	element: null,
	app: null,
	keyBindings: {},

	init: function(id) {
		//console.log(id);
		this.elementId = id;
		this.element = document.getElementById(id);
		this.element.style.display = 'none';
	},

	render: function(dt) {},

	resize: function() {},

	show: function() {
		this.element.style.display = 'block';
		this.element.focus();
		gInputEngine.attach(this);
		this.resize();
		//gInputEngine.applyBindMap(this.keyBindings);
	},
	hide: function() {
		this.element.style.display = 'none';
		this.element.blur();
		gInputEngine.detach(this);
	},

	setApp: function(app) {
		this.app = app;
	}
});