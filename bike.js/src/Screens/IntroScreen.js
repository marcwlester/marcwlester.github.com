var IntroScreen = Screen.extend({

	keyBindings: {
		40: 'next-option',
		38: 'prev-option',
		13: 'select',
		83: 'next-option',
		87: 'prev-option'
	},

	buttonCooldownMax: 50,
	buttonCooldown: 0,

	show: function() {
		this.parent();
		gSM.playSound('assets/audio/intro.mp3', {looping: true});
	},

	hide: function() {
		this.parent();
		gSM.stopAll();
	},

	render: function(dt) {
		//console.log(gInputEngine);
		// if (gInputEngine.action('select')) {
		// 	console.log('making selection');
		// 	gBikeGame.screens['race'].loadTrack('track1', function() {
		// 		gBikeGame.setScreen(gBikeGame.screens['race']);
		// 	});
		// }
		// if (this.buttonCooldown == 0) {
		// 	this.buttonCooldown = this.buttonCooldownMax;
		// 	if (gInputEngine.action('next-option')) {
		// 		console.log('next option');
		// 	}
		// 	if (gInputEngine.action('prev-option')) {
		// 		console.log('previous option');
		// 	}
		// }
		// this.buttonCooldown = Math.max(this.buttonCooldown - 1, 0)
	}
});

gBikeGame.screens['intro'] = new IntroScreen('screen-intro');