

SoundManager = Class.extend({
	clips: {},
	enabled: true,
	_context: null,
	_mainNode: null,
	_playerNode: null,

	bgMusic: {
		path: null,
		source: null
	},

	//----------------------------
	create: function () {
		return;
		try {
			gSM._context = new webkitAudioContext();
		} catch (e) {
			alert('Web Audio API is not supported in this browser');
		}

		gSM._mainNode = gSM._context.createGainNode(0);
		gSM._mainNode.connect(gSM._context.destination);

		gSM._playerNode = gSM._context.createGainNode(0);
		gSM._playerNode.connect(gSM._context.destination);
	},

	//----------------------------
	// Parameters:
	//	1) path: a string representing the path to the sound
	//           file.
	//  2) callbackFcn: a function to call once loading the sound file
	//                  at 'path' is complete. This should take a Sound
	//                  object as a parameter.
	//----------------------------
	loadAsync: function (path, callbackFcn) {
		if (gSM.clips[path]) {
			callbackFcn(gSM.clips[path].s);
			return gSM.clips[path].s;
		}

		var clip = {
			s: new Sound(),
			b: null,
			l: false
		};
		gSM.clips[path] = clip;
		clip.s.path = path;

		var request = new XMLHttpRequest();
		request.open('GET', path, true);
		request.responseType = 'arraybuffer';
		request.onload = function () {
			gSM._context.decodeAudioData(request.response,

			function (buffer) {
				gSM.clips[path].b = buffer;
				gSM.clips[path].l = true;
				callbackFcn(gSM.clips[path].s);
			},

			function (data) {});

		};
		request.send();


		return clip.s;

	},

	//----------------------------
	togglemute: function() {
		// Check if the gain value of the main node is 
		// 0. If so, set it to 1. Otherwise, set it to 0.
		if(gSM._mainNode.gain.value>0) {
			gSM._mainNode.gain.value = 0;
		}
		else {
			gSM._mainNode.gain.value = 1;
		}

		if(gSM._playerNode.gain.value>0) {
			gSM._playerNode.gain.value = 0;
		}
		else {
			gSM._playerNode.gain.value = 1;
		}
	},

	//----------------------------
	stopAll: function()
	{
		// Disconnect the main node, then create a new 
		// Gain Node, attach it to the main node, and 
		// connect it to the audio context's destination. 
		gSM._mainNode.disconnect();
		gSM._mainNode = gSM._context.createGainNode(0);
		gSM._mainNode.connect(gSM._context.destination);

		gSM._playerNode.disconnect();
		gSM._playerNode = gSM._context.createGainNode(0);
		gSM._playerNode.connect(gSM._context.destination);
	},

	stopPlayer: function()
	{
		// Disconnect the main node, then create a new 
		// Gain Node, attach it to the main node, and 
		// connect it to the audio context's destination. 

		gSM._playerNode.disconnect();
		gSM._playerNode = gSM._context.createGainNode(0);
		gSM._playerNode.connect(gSM._context.destination);
	},

	//----------------------------
	// Parameters:
	//	1) path: a string representing the path to the sound
	//           file.
	//  2) settings: a dictionary representing any game-specific
	//               settings we might have for playing this
	//               sound. In our case the only ones we'll be
	//               concerned with are:
	//               {
	//                   looping: a boolean indicating whether to
	//                            loop.
	//                   volume: a number between 0 and 1.
	//               }
	//----------------------------
	playSound: function (path, settings) {
		return;
		// Check if the Sound Manager has been enabled,
		// return false if not.
		if (!gSM.enabled) return false;

		// Set default values for looping and volume.
		var looping = false;
		var volume = 0.2;

		// Check if the given settings specify the volume
		// and looping, and update those appropriately.
		if (settings) {
			if (settings.looping) looping = settings.looping;
			if (settings.volume) volume = settings.volume;
		}

		// Check if the path has an associated sound clip,
		// and whether the sound has been loaded yet.
		// Return false if either of these sanity checks
		// fail.
		var sd = this.clips[path];
		if (sd == null) return false;
		if (sd.l == false) return false;

		var currentClip = null;

		// create a new buffer source for the sound we want
		// to play. We can do this by calling the 'createBufferSource'
		// method of gSM._context.
		currentClip = gSM._context.createBufferSource();

		// Set the properties of currentClip appropriately in order to
		// play the sound.
		currentClip.buffer = sd.b; // tell the source which sound to play
		currentClip.gain.value = volume;
		currentClip.loop = looping;

		// Connect currentClip to the main node, then play it. We can do
		// this using the 'connect' and 'noteOn' methods of currentClip.
		currentClip.connect(gSM._mainNode);
		currentClip.noteOn(0);



		return true;
	},

	setBgMusic: function(path, clip) {
		gSM.bgMusic = {
			path: path,
			source: clip
		};
	},

	getBgMusic: function() {
		return gSM.bgMusic;
	},

	initBgMusic: function(path, settings) {
		return;
		// Check if the Sound Manager has been enabled,
		// return false if not.
		if (!gSM.enabled) return false;

		// Set default values for looping and volume.
		var looping = false;
		var volume = 0.2;

		// Check if the given settings specify the volume
		// and looping, and update those appropriately.
		if (settings) {
			if (settings.looping) looping = settings.looping;
			if (settings.volume) volume = settings.volume;
		}

		// Check if the path has an associated sound clip,
		// and whether the sound has been loaded yet.
		// Return false if either of these sanity checks
		// fail.
		var sd = this.clips[path];
		if (sd === null) return false;
		if (sd.l === false) return false;

		var currentClip = null;

		// create a new buffer source for the sound we want
		// to play. We can do this by calling the 'createBufferSource'
		// method of gSM._context.
		currentClip = gSM._context.createBufferSource();

		// Set the properties of currentClip appropriately in order to
		// play the sound.
		currentClip.buffer = sd.b; // tell the source which sound to play
		currentClip.gain.value = volume;
		currentClip.loop = looping;

		// Connect currentClip to the main node, then play it. We can do
		// this using the 'connect' and 'noteOn' methods of currentClip.
		currentClip.connect(gSM._mainNode);
		currentClip.noteOn(0);

		gSM.setBgMusic(path, currentClip);

		return true;
	},

	initMotorSound: function(path, settings) {
		return;
		// Check if the Sound Manager has been enabled,
		// return false if not.
		if (!gSM.enabled) return false;

		// Set default values for looping and volume.
		var looping = false;
		var volume = 0.2;

		// Check if the given settings specify the volume
		// and looping, and update those appropriately.
		if (settings) {
			if (settings.looping) looping = settings.looping;
			if (settings.volume) volume = settings.volume;
		}

		// Check if the path has an associated sound clip,
		// and whether the sound has been loaded yet.
		// Return false if either of these sanity checks
		// fail.
		var sd = this.clips[path];
		if (sd === null) return false;
		if (sd.l === false) return false;

		var currentClip = null;

		// create a new buffer source for the sound we want
		// to play. We can do this by calling the 'createBufferSource'
		// method of gSM._context.
		currentClip = gSM._context.createBufferSource();

		// Set the properties of currentClip appropriately in order to
		// play the sound.
		currentClip.buffer = sd.b; // tell the source which sound to play
		currentClip.gain.value = volume;
		currentClip.loop = looping;

		// Connect currentClip to the main node, then play it. We can do
		// this using the 'connect' and 'noteOn' methods of currentClip.
		currentClip.connect(gSM._mainNode);
		currentClip.noteOn(0);

		gSM.setMotorSound(path, currentClip);

		return true;
	},

	playPlayerSound: function (path, settings) {
		return;
		// Check if the Sound Manager has been enabled,
		// return false if not.
		if (!gSM.enabled) return false;

		// Set default values for looping and volume.
		var looping = false;
		var volume = 0.2;

		// Check if the given settings specify the volume
		// and looping, and update those appropriately.
		if (settings) {
			if (settings.looping) looping = settings.looping;
			if (settings.volume) volume = settings.volume;
		}

		// Check if the path has an associated sound clip,
		// and whether the sound has been loaded yet.
		// Return false if either of these sanity checks
		// fail.
		var sd = this.clips[path];
		if (sd === null) return false;
		if (sd.l === false) return false;

		var currentClip = null;

		// create a new buffer source for the sound we want
		// to play. We can do this by calling the 'createBufferSource'
		// method of gSM._context.
		currentClip = gSM._context.createBufferSource();

		// Set the properties of currentClip appropriately in order to
		// play the sound.
		currentClip.buffer = sd.b; // tell the source which sound to play
		currentClip.gain.value = volume;
		currentClip.loop = looping;

		// Connect currentClip to the main node, then play it. We can do
		// this using the 'connect' and 'noteOn' methods of currentClip.
		currentClip.connect(gSM._playerNode);
		currentClip.noteOn(0);

		return true;
	}
});

//----------------------------
Sound = Class.extend({
	play: function(loop) {
		// Call the playSound function with the appropriate path and settings.
		gSM.playSound(this.path,{looping:loop, volume:1});
	}
});

//----------------------------
function playSoundInstance(soundpath) {
	// Load a new Sound object, then call its play method.
	var sound = gSM.loadAsync(soundpath, function(sObj) {sObj.play(false);});
}

var gSM = new SoundManager();
