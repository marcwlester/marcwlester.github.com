var RenderEngine = Class.extend({
	scale: 20,

	images: {},

	init: function() {
		this.images['background'] = {
			img: document.getElementById('img-background'),
			width: document.getElementById('img-background').width,
			height: document.getElementById('img-background').height,
			half_width: document.getElementById('img-background').width / 2,
			half_height: document.getElementById('img-background').height / 2,
			x_offset: 0,
			y_offset: 0
		};
		this.images['bikes'] = {};
		this.images['bikes']['red'] = {
			img: document.getElementById('bike-body-red'),
			width: document.getElementById('bike-body-red').width,
			height: document.getElementById('bike-body-red').height,
			half_width: document.getElementById('bike-body-red').width / 2,
			half_height: document.getElementById('bike-body-red').height / 2,
			x_offset: 0,
			y_offset: -10
		};
		this.images['wheel'] = {
			img: document.getElementById('bike-wheel'),
			width: document.getElementById('bike-wheel').width,
			height: document.getElementById('bike-wheel').height,
			half_width: document.getElementById('bike-wheel').width / 2,
			half_height: document.getElementById('bike-wheel').height / 2
		};

		this.images['ramp1'] = {
			img: document.getElementById('ramp-1'),
			width: document.getElementById('ramp-1').width,
			height: document.getElementById('ramp-1').height,
			half_width: document.getElementById('ramp-1').width / 2,
			half_height: document.getElementById('ramp-1').height / 2,
			x_offset: 0,
			y_offset: -9
		};
		this.images['ramp2'] = {
			img: document.getElementById('ramp-2'),
			width: document.getElementById('ramp-2').width,
			height: document.getElementById('ramp-2').height,
			half_width: document.getElementById('ramp-2').width / 2,
			half_height: document.getElementById('ramp-2').height / 2,
			x_offset: -18,
			y_offset: -20
		}
	},

	render: function(ctx, x, y) {
		this.renderBg(ctx, x, y);
		
		var ramps = gPhysicsEngine.bodies.ramps;
		for (var i = 0; i < ramps.length; i++) {
			var name = ramps[i].GetUserData().name;
			switch (name) {
				case "ramp1":
				this.renderRamp1(ctx, x, y, ramps[i]);
				break;
				case "ramp2":
				this.renderRamp2(ctx, x, y, ramps[i]);
				break;
			}
		}

		this.renderFrontWheel(ctx, x, y);
		this.renderRearWheel(ctx, x, y);
		this.renderBike(ctx, x, y);
	},

	renderBg: function(ctx, x, y) {
		var bg = this.images['background'];
		var bikex = gPhysicsEngine.bodies.bike.base.GetPosition().x;
		var bg_offset = (bikex * this.scale + x) % bg.width;
		ctx.drawImage(bg.img, 0 - bg_offset, 0 + y);
		ctx.drawImage(bg.img, bg.width - bg_offset, 0 + y);
		ctx.drawImage(bg.img, (bg.width * 2) - bg_offset, 0 + y);
		ctx.drawImage(bg.img, (bg.width * 3) - bg_offset, 0 + y);
	},

	renderBike: function(ctx, x, y) {
		var bodyPos = gPhysicsEngine.bodies.bike.base.GetPosition();
		var bodyAngle = gPhysicsEngine.bodies.bike.base.GetAngle();
		var baseOffset = gPhysicsEngine.bodies.bike.base.GetPosition().x;
		var base = this.images.bikes.red;
		var body_cx = (bodyPos.x - baseOffset) * this.scale + x;
		var body_cy = bodyPos.y * this.scale + y;

		ctx.save();
		ctx.translate(body_cx, body_cy);
		ctx.rotate(bodyAngle);
		ctx.drawImage(base.img, -base.half_width + base.x_offset, -base.half_height + base.y_offset)
		ctx.restore();
	},

	renderFrontWheel: function(ctx, x, y) {
		var pos = gPhysicsEngine.bodies.bike.fwheel.GetPosition();
		var angle = gPhysicsEngine.bodies.bike.fwheel.GetAngle();
		var offset = gPhysicsEngine.bodies.bike.base.GetPosition().x;
		var image = this.images.wheel;
		var wheel_cx = ((pos.x - offset) * this.scale) + x;
		var wheel_cy = (pos.y * this.scale) + y;

		jQuery('#debug').html(wheel_cx + ", " + wheel_cy);

		ctx.save();
		ctx.translate(wheel_cx, wheel_cy);
		ctx.rotate(angle);
		ctx.drawImage(image.img, -image.half_width, -image.half_height);
		ctx.restore();
	},

	renderRearWheel: function(ctx, x, y) {
		var pos = gPhysicsEngine.bodies.bike.rwheel.GetPosition();
		var angle = gPhysicsEngine.bodies.bike.rwheel.GetAngle();
		var offset = gPhysicsEngine.bodies.bike.base.GetPosition().x;
		var image = this.images.wheel;
		var wheel_cx = ((pos.x - offset) * this.scale) + x;
		var wheel_cy = (pos.y * this.scale) + y;

		ctx.save();
		ctx.translate(wheel_cx, wheel_cy);
		ctx.rotate(angle);
		ctx.drawImage(image.img, -image.half_width, -image.half_height);
		ctx.restore();
	},

	renderRamp1: function(ctx, x, y, ramp) {
		var pos = ramp.GetPosition();
		var offset = gPhysicsEngine.bodies.bike.base.GetPosition().x;
		var image = this.images.ramp1;
		var ramp1_cx = (pos.x - offset) * this.scale + x;
		var ramp1_cy = pos.y * this.scale + y;
		ctx.save();
		ctx.translate(ramp1_cx, ramp1_cy);
		ctx.drawImage(image.img, -image.half_width + image.x_offset, -image.half_height + image.y_offset)
		ctx.restore();
	},

	renderRamp2: function(ctx, x, y, ramp) {
		var pos = ramp.GetPosition();
		var offset = gPhysicsEngine.bodies.bike.base.GetPosition().x;
		var image = this.images.ramp2;
		var ramp1_cx = (pos.x - offset) * this.scale + x;
		var ramp1_cy = pos.y * this.scale + y;
		ctx.save();
		ctx.translate(ramp1_cx, ramp1_cy);
		ctx.drawImage(image.img, -image.half_width + image.x_offset, -image.half_height + image.y_offset)
		ctx.restore();
	},
});

var gRenderEngine = new RenderEngine();