var manifest = [
{ src: 'assets/img/background.png', name: 'background'},
{ src: 'assets/img/bike-body-red.png', name: 'bike-body-red'},
{ src: 'assets/img/ramp1.png', name: 'ramp1'},
{ src: 'assets/img/ramp2.png', name: 'ramp2'},
{ src: 'assets/img/wheel.png', name: 'wheel'},
{ src: 'assets/img/helmet-red.png', name: 'helmet-red'}
];

jQuery(document).ready(function() {
	gAssetLoader.loadManifest(manifest, function() { 
		gBikeGame.run();
	});
	//gBikeGame.run();
});