GameWorld = Class.extend({

	map: null,

	entities: [],

	init: function(settings) {
		merge(this, settings);
	}
});