var AssetLoader = Class.extend({
	assets: {},
	manifest: [],
	numAssets: 0,
	loadedAssets: 0,

	onComplete: null,
	onAssetLoaded: null,

	loadManifest: function(manifest, onComplete, onAssetLoaded) {
		this.manifest = manifest;
		this.numAssets = manifest.length;
		this.loadedAssets = 0;
		this.onComplete = onComplete;
		this.onAssetLoaded = onAssetLoaded;

		for (var i = 0; i < this.numAssets; i++) {
			var name = manifest[i].name;
			var src = manifest[i].src;
			var type = manifest[i].type;

			if (type == 'img') {
				this.assets[name] = new Image();
				this.assets[name].onload = gAssetLoader.imageOnload;
				this.assets[name].src = src;
			}

			if (type == 'audio') {
				gSM.loadAsync(src, gAssetLoader.audioOnload);
			}
		}
	},

	imageOnload: function() {
		gAssetLoader.loadedAssets += 1;
		gAssetLoader.onAssetLoaded();

		if (gAssetLoader.loadedAssets == gAssetLoader.numAssets) {
			gAssetLoader.onComplete();
		}
	},

	audioOnload: function(s) {
		gAssetLoader.loadedAssets += 1;
		gAssetLoader.onAssetLoaded();

		if (gAssetLoader.loadedAssets == gAssetLoader.numAssets) {
			gAssetLoader.onComplete();
		}
	}
});

var gAssetLoader = new AssetLoader();