var manifest = [
{ src: 'assets/img/background.png', name: 'background'},
{ src: 'assets/img/bike-body-red.png', name: 'bike-body-red'},
{ src: 'assets/img/ramp1.png', name: 'ramp1'},
{ src: 'assets/img/ramp2.png', name: 'ramp2'},
{ src: 'assets/img/ramp3.png', name: 'ramp3'},
{ src: 'assets/img/wheel.png', name: 'wheel'},
{ src: 'assets/img/helmet-red.png', name: 'helmet-red'},
{ src: 'assets/img/finish.png', name: 'finish'},
{ src: 'assets/img/gate-up.png', name: 'gate-up'},
{ src: 'assets/img/gate-down.png', name: 'gate-down'}
];

jQuery(document).ready(function() {
	gAssetLoader.loadManifest(manifest, function() { 
		gBikeGame.run();
	});
	//gBikeGame.run();
});