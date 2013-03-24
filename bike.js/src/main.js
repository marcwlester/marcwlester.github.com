var manifest = [
{ src: 'assets/img/background.png', name: 'background'},
{ src: 'assets/img/bike-body-red.png', name: 'bike-body-red'},
{ src: 'assets/img/ramp1.png', name: 'ramp1'},
{ src: 'assets/img/ramp2.png', name: 'ramp2'},
{ src: 'assets/img/wheel.png', name: 'wheel'}
];

jQuery(document).ready(function() {
	gAssetLoader.loadManifest(manifest, function() { gBikeGame.run(); });
	//gBikeGame.run();
});