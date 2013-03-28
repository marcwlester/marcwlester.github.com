var RenderEngine = Class.extend({
	scale: 20,

	images: {},

	rpmMeter: null,
	rpmData: null,
	rpmMeterValue: 0,
	speedMeter: null,
	speedMeterValue: 0,

	init: function() {
		//console.log(google.visualization);
		//this.rpmMeter = new google.visualization.Gauge(document.getElementById('rpm-gauge'));
		//this.speedMeter = new google.visualization.Gauge(document.getElementById('speed-gauge'));
	},

	

	loadContent: function() {
		
		var background = gAssetLoader.assets['background'];
		this.images['background'] = {
			img: background,
			width: background.width,
			height: background.height,
			half_width: background.width / 2,
			half_height: background.height / 2,
			x_offset: 0,
			y_offset: 0
		};
		this.images['bikes'] = {};

		var redbike = gAssetLoader.assets['bike-body-red'];
		this.images['bikes']['red'] = {
			img: redbike,
			width: redbike.width,
			height: redbike.height,
			half_width: redbike.width / 2,
			half_height: redbike.height / 2,
			x_offset: 0,
			y_offset: -10
		};
		var redhelmet = gAssetLoader.assets['helmet-red'];

		this.images['helmets'] = {};
		this.images['helmets']['red'] = {
			img: redhelmet,
			width: redhelmet.width,
			height: redhelmet.height,
			half_width: redhelmet.width / 2,
			half_height: redhelmet.height / 2,
			x_offset: 10,
			y_offset: -60,
		};
		var wheel = gAssetLoader.assets['wheel'];
		this.images['wheel'] = {
			img: wheel,
			width: wheel.width,
			height: wheel.height,
			half_width: wheel.width / 2,
			half_height: wheel.height / 2
		};

		var ramp1 = gAssetLoader.assets['ramp1'];
		this.images['ramp1'] = {
			img: ramp1,
			width: ramp1.width,
			height: ramp1.height,
			half_width: ramp1.width / 2,
			half_height: ramp1.height / 2,
			x_offset: 0,
			y_offset: -9
		};

		var ramp2 = gAssetLoader.assets['ramp2'];
		this.images['ramp2'] = {
			img: ramp2,
			width: ramp2.width,
			height: ramp2.height,
			half_width: ramp2.width / 2,
			half_height: ramp2.height / 2,
			x_offset: -18,
			y_offset: -20
		}
		jQuery('#rpm-gauge').gauge({
			min: 0,
			max: 10000,
			label: 'RPM',
			bands: [
				{color: "#ffff00", from: 6000, to: 8000},
				{color: "#ff0000", from: 8000, to: 10000}
			]
		}).gauge('setValue', 0);
		jQuery('#speed-gauge').gauge({
			min: 0,
			max: 100,
			label: 'KM/H'
		}).gauge('setValue', 0);
		jQuery('#boost-gauge').gauge({
			min: 0,
			max: 100,
			label: 'NOS'
		}).gauge('setValue', 0);
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
		//var b = this.blur(ctx, 0, 0, ctx.width, ctx.height, 5, 0, 10);
		//if (!b) console.log('no blur');
		this.renderFrontWheel(ctx, x, y);
		this.renderRearWheel(ctx, x, y);
		this.renderBike(ctx, x, y);
		this.renderHelmet(ctx, x, y);
		jQuery('#rpm-gauge').gauge('setValue', gBikeGame.screens['race'].torqueValue * 10);
		jQuery('#speed-gauge').gauge('setValue', Math.max(gPhysicsEngine.bodies.bike.base.GetLinearVelocity().x * 2, 0));
		jQuery('#boost-gauge').gauge('setValue', (gBikeGame.screens['race'].boostCount / gBikeGame.screens['race'].maxBoostCount) * 100);
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
		var helmet = this.images.helmets.red;
		var body_cx = (bodyPos.x - baseOffset) * this.scale + x;
		var body_cy = bodyPos.y * this.scale + y;

		ctx.save();
		ctx.translate(body_cx, body_cy);
		ctx.rotate(bodyAngle);
		ctx.drawImage(base.img, -base.half_width + base.x_offset, -base.half_height + base.y_offset);
		ctx.drawImage(helmet.img, -helmet.half_width + helmet.x_offset, -helmet.half_height + helmet.y_offset);
		ctx.restore();
	},

	renderHelmet: function(ctx, x, y) {

	},

	renderFrontWheel: function(ctx, x, y) {
		var pos = gPhysicsEngine.bodies.bike.fwheel.GetPosition();
		var angle = gPhysicsEngine.bodies.bike.fwheel.GetAngle();
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

	blur: function(ctx, x, y, width, height, blurX, blurY, quality) {
		var targetCtx = ctx;
		var targetX = x;
		var targetY = y;

		try {
			var imageData = ctx.getImageData(x, y, width, height);
		} catch(e) {
			throw new Error("unable to access local image data: " + e);
			return false;
		}
 
		var radiusX = blurX;
		if ( isNaN(radiusX) || radiusX < 0 ) return false;
		radiusX |= 0;
 
		var radiusY = blurY;
		if ( isNaN(radiusY) || radiusY < 0 ) return false;
		radiusY |= 0;
 
		if ( radiusX == 0 && radiusY == 0 ) return false;
 
		var iterations = quality;
		if ( isNaN(iterations) || iterations < 1  ) iterations = 1;
		iterations |= 0;
		if ( iterations > 3 ) iterations = 3;
		if ( iterations < 1 ) iterations = 1;
 
		var pixels = imageData.data;
 
		var rsum,gsum,bsum,asum,x,y,i,p,p1,p2,yp,yi,yw;
		var wm = width - 1;
		var hm = height - 1;
		var rad1x = radiusX + 1;
		var divx = radiusX + rad1x;
		var rad1y = radiusY + 1;
		var divy = radiusY + rad1y;
		var div2 = 1 / (divx * divy);
 
		var r = [];
		var g = [];
		var b = [];
		var a = [];
 
		var vmin = [];
		var vmax = [];
 
		while ( iterations-- > 0 ) {
			yw = yi = 0;
 
			for ( y=0; y < height; y++ ){
				rsum = pixels[yw]   * rad1x;
				gsum = pixels[yw+1] * rad1x;
				bsum = pixels[yw+2] * rad1x;
				asum = pixels[yw+3] * rad1x;
 
 
				for( i = 1; i <= radiusX; i++ ) {
					p = yw + (((i > wm ? wm : i )) << 2 );
					rsum += pixels[p++];
					gsum += pixels[p++];
					bsum += pixels[p++];
					asum += pixels[p]
				}
 
				for ( x = 0; x < width; x++ ) {
					r[yi] = rsum;
					g[yi] = gsum;
					b[yi] = bsum;
					a[yi] = asum;
 
					if(y==0){
						vmin[x] = Math.min( x + rad1x, wm ) << 2;
						vmax[x] = Math.max( x - radiusX, 0 ) << 2;
					}
 
					p1 = yw + vmin[x];
					p2 = yw + vmax[x];
 
					rsum += pixels[p1++] - pixels[p2++];
					gsum += pixels[p1++] - pixels[p2++];
					bsum += pixels[p1++] - pixels[p2++];
					asum += pixels[p1]   - pixels[p2];
 
					yi++;
				}
				yw += ( width << 2 );
			}
 
			for ( x = 0; x < width; x++ ) {
				yp = x;
				rsum = r[yp] * rad1y;
				gsum = g[yp] * rad1y;
				bsum = b[yp] * rad1y;
				asum = a[yp] * rad1y;
 
				for( i = 1; i <= radiusY; i++ ) {
				  yp += ( i > hm ? 0 : width );
				  rsum += r[yp];
				  gsum += g[yp];
				  bsum += b[yp];
				  asum += a[yp];
				}
 
				yi = x << 2;
				for ( y = 0; y < height; y++) {
				  pixels[yi]   = (rsum * div2 + 0.5) | 0;
				  pixels[yi+1] = (gsum * div2 + 0.5) | 0;
				  pixels[yi+2] = (bsum * div2 + 0.5) | 0;
				  pixels[yi+3] = (asum * div2 + 0.5) | 0;
 
				  if( x == 0 ){
					vmin[y] = Math.min( y + rad1y, hm ) * width;
					vmax[y] = Math.max( y - radiusY,0 ) * width;
				  }
 
				  p1 = x + vmin[y];
				  p2 = x + vmax[y];
 
				  rsum += r[p1] - r[p2];
				  gsum += g[p1] - g[p2];
				  bsum += b[p1] - b[p2];
				  asum += a[p1] - a[p2];
 
				  yi += width << 2;
				}
			}
		}
 		
		targetCtx.putImageData(imageData, targetX, targetY);
		return true;
	}
});

var gRenderEngine = new RenderEngine();