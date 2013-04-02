var manifest = [
{ type: 'img', src: 'assets/img/background.png', name: 'background'},
{ type: 'img', src: 'assets/img/bike-body-red.png', name: 'bike-body-red'},
{ type: 'img', src: 'assets/img/ramp1.png', name: 'ramp1'},
{ type: 'img', src: 'assets/img/ramp2.png', name: 'ramp2'},
{ type: 'img', src: 'assets/img/ramp3.png', name: 'ramp3'},
{ type: 'img', src: 'assets/img/wheel.png', name: 'wheel'},
{ type: 'img', src: 'assets/img/helmet-red.png', name: 'helmet-red'},
{ type: 'img', src: 'assets/img/finish.png', name: 'finish'},
{ type: 'img', src: 'assets/img/gate-up.png', name: 'gate-up'},
{ type: 'img', src: 'assets/img/gate-down.png', name: 'gate-down'},
{ type: 'audio', src: 'assets/audio/intro.mp3', name: 'intro-music'},
{ type: 'audio', src: 'assets/audio/track.mp3', name: 'track-music'}
];

jQuery(document).ready(function() {
	gSM.create();
	gAssetLoader.loadManifest(manifest, function() { 
		gBikeGame.run();
	});
	//gBikeGame.run();
});