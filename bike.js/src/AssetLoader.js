var AssetLoader = Class.extend({
	assets: {},
	manifest: [],
	numAssets: 0,
	loadedAssets: 0,

	onComplete: null,

	loadManifest: function(manifest, onComplete) {
		this.manifest = manifest;
		this.numAssets = manifest.length;
		this.loadedAssets = 0;
		this.onComplete = onComplete;

		for (var i = 0; i < this.numAssets; i++) {
			var name = manifest[i].name;
			var src = manifest[i].src;

			this.assets[name] = new Image();
			this.assets[name].onload = gAssetLoader.imageOnload;
			this.assets[name].src = src;
		}
	},

	imageOnload: function() {
		gAssetLoader.loadedAssets += 1;

		if (gAssetLoader.loadedAssets == gAssetLoader.numAssets) {
			gAssetLoader.onComplete();
		}
	}
});

var gAssetLoader = new AssetLoader();