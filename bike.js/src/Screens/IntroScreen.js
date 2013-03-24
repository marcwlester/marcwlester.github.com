var IntroScreen = Screen.extend({

	keyBindings: {
		40: 'next-option',
		38: 'prev-option',
		13: 'select',
		83: 'next-option',
		87: 'prev-option'
	},

	render: function(dt) {
		//console.log(gInputEngine);
		if (gInputEngine.action('select')) {
			console.log('making selection');
			gBikeGame.screens['race'].loadTrack('track1', function() {
				gBikeGame.setScreen(gBikeGame.screens['race']);
			});
		}
		if (gInputEngine.action('next-option')) {
			console.log('next option');
		}
		if (gInputEngine.action('prev-option')) {
			console.log('previous option');
		}
	}
});

gBikeGame.screens['intro'] = new IntroScreen('screen-intro');