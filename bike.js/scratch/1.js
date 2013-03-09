//some music http://ozzed.net/music/

console.log(jQuery(window).width());
console.log(jQuery(document).width());
var canvas = document.getElementById('game_canvas');
var ctx = canvas.getContext('2d');
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint;
var b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint;
var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

var update_frequecy = 1/60;

var gravity = new b2Vec2(0,9.8);
var world = new b2World(gravity,true);
var input = new THREEx.KeyboardState();

var debugDraw = new b2DebugDraw();

var MAX_SPEED = 20;
var MAX_TURBO = 26;

var MIN_ANGLE = -0.8;
var MAX_ANGLE = 0.8;

var logging = false;
function clog(message) {
	if (logging) {
		console.log(message);
	}
}

function onResize() {
	canvas.width = canvas.style.width = jQuery(window).width();
	canvas.height = canvas.style.height = 600;
}

function makeBody(world, options) {
	options = options || {};
	var def = new b2BodyDef();
	def.position.x = options.x;
	def.position.y = options.y;
	def.position = new b2Vec2(options.x, options.y);
	def.type = options.type == 'static' ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
	var body = world.CreateBody(def);
	body.SetUserData(options.userdata || {});

	var fixture = new b2FixtureDef();
	fixture.density = options.density || 0;
	fixture.friction = options.friction || 1;
	fixture.restitution = options.restitution || 0;
	fixture.filter.categoryBits = options.categoryBits || 0x0001;
    fixture.filter.maskBits = options.maskBits || 0xFFFF;
    fixture.filter.groupIndex = options.groupIndex || 0;
	switch(options.shape) {
		case "circle":
		fixture.shape = new b2CircleShape(options.radius || 1);
		break;
		case "polygon":
		fixture.shape = new b2PolygonShape();
		fixture.shape.SetAsArray(options.points, options.points.length);
		break;
		case "block":
		fixture.shape = new b2PolygonShape();
		if (options.orientation) {
			fixture.shape.SetAsOrientedBox(options.width / 2, options.height / 2, options.orientation.position, options.orientation.angle)
		} else {
			fixture.shape.SetAsBox(options.width / 2, options.height / 2);
		}
		break;
	}

	body.CreateFixture(fixture);

	return body;
}

var bike_in_air = true;

var listener = new Box2D.Dynamics.b2ContactListener;
listener.BeginContact = function(contact) {
	clog('start');
	//clog(contact.GetFixtureA().GetBody().GetUserData());
	//clog(contact.GetFixtureB().GetBody().GetUserData());
	clog(contact.GetFixtureA().GetFilterData().groupIndex);
	//clog(contact.GetFixtureB().GetFilterData().groupIndex);
	if (contact.GetFixtureA().GetFilterData().groupIndex = 2) {
		bike_in_air = false;
	}
}
listener.EndContact = function(contact) {
	clog('end');
	//clog(contact.GetFixtureA().GetBody().GetUserData());
	//clog(contact.GetFixtureB().GetBody().GetUserData());
	clog(contact.GetFixtureA().GetFilterData().groupIndex);
	//clog(contact.GetFixtureB().GetFilterData().groupIndex);
	if (contact.GetFixtureA().GetFilterData().groupIndex = 2) {
		bike_in_air = true;
	}
}
listener.PostSolve = function(contact, impulse) {

}
listener.PreSolve = function(contact, oldManifold) {

}
world.SetContactListener(listener);



var floor = makeBody(world, {
	shape: 'block',
	type: 'static',
	x: 30,
	y: 20,
	height: 0.5,
	width: 1000,
	groupIndex: 2,
	friction: 1,
	density: 0,
	userdata: {
		name: 'floor'
	}
});
/*
var ramp1a = makeBody(world, {
	shape: 'block',
	type: 'static',
	x: 30,
	y: 19,
	height: 1,
	width: 5,
	groupIndex: 2,
	orientation: {
		position: new b2Vec2(0, 0),
		angle: -0.5,
	},
	friction: 1,
	density: 0,
	userdata: {
		name: 'ramp 1'
	}
});

var ramp1b = makeBody(world, {
	shape: 'block',
	type: 'static',
	x: 35,
	y: 19,
	height: 1,
	width: 5,
	groupIndex: 2,
	orientation: {
		position: new b2Vec2(0, 0),
		angle: 0.5,
	},
	friction: 1,
	density: 0,
	userdata: {
		name: 'ramp 1'
	}
});

var ramp1c = makeBody(world, {
	shape: 'block',
	type: 'static',
	x: 32.5,
	y: 19,
	height: 3.3,
	width: 1,
	groupIndex: 2,
	friction: 1,
	density: 0,
	userdata: {
		name: 'ramp 1'
	}
});*/
/*
var ramp2a = makeBody(world, {
	shape: 'block',
	type: 'static',
	x: 30 + 20,
	y: 18.5,
	height: 1,
	width: 5.7,
	groupIndex: 2,
	orientation: {
		position: new b2Vec2(0, 0),
		angle: -0.7,
	},
	friction: 1,
	density: 0
});

var ramp2b = makeBody(world, {
	shape: 'block',
	type: 'static',
	x: 35 + 20,
	y: 18.5,
	height: 1,
	width: 5.7,
	groupIndex: 2,
	orientation: {
		position: new b2Vec2(0, 0),
		angle: 0.7,
	},
	friction: 1,
	density: 0
});

var ramp2c = makeBody(world, {
	shape: 'block',
	type: 'static',
	x: 32.5 + 20,
	y: 18.5,
	height: 4.5,
	width: 1.2,
	groupIndex: 2,
	friction: 1,
	density: 0
});*/

var ramp3a = makeBody(world, {
	shape: 'block',
	type: 'static',
	x: 30 + 40,
	y: 19.2,
	height: 1,
	width: 3,
	groupIndex: 2,
	orientation: {
		position: new b2Vec2(0, 0),
		angle: -0.7,
	},
	friction: 1,
	density: 0
});
var ramp3c = makeBody(world, {
	shape: 'block',
	type: 'static',
	x: 31.2 + 40,
	y: 19.2,
	height: 2.6,
	width: 0.7,
	groupIndex: 2,
	friction: 1,
	density: 0
});

var ramp4a = makeBody(world, {
	shape: 'block',
	type: 'static',
	x: 30 - 10,
	y: 20,
	height: 1,
	width: 1,
	groupIndex: 2,
	orientation: {
		position: new b2Vec2(0, 0),
		angle: -Math.PI/4,
	},
	friction: 10,
	density: 0
});


//var base = null, rwheel = null, fwheel = null, raxle = null, faxle = null;
var base = makeBody(world, {
	shape: 'block',
	type: 'dynamic',
	x: 5,
	y: 13,
	width: 3,
	height: 0.9,
	/*points: [
		new b2Vec2(-1.5, 0.3),
		new b2Vec2(1.5, 0.3),
		new b2Vec2(1.5,-0.3),
		new b2Vec2(-1.5, -0.3)
	],*/
	density: 10,
	groupIndex: 1,
	userdata: {
		name: 'base'
	}
});
var rwheel = makeBody(world, {
	shape: 'circle',
	type: 'dynamic',
	x: 4,
	y: 15,
	radius: 1,
	density: 5,
	friction: 30,
	restitution: 0,
	groupIndex: 1,
	userdata: {
		name: 'rear wheel'
	}
});
var fwheel = makeBody(world, {
	shape: 'circle',
	type: 'dynamic',
	x: 6,
	y: 15,
	radius: 1,
	density: 5,
	friction: 30,
	restitution: 0,
	groupIndex: 1,
	userdata: {
		name: 'front wheel'
	}
});

var fwheelJointDef = new b2RevoluteJointDef();
fwheelJointDef.bodyA = fwheel;
fwheelJointDef.bodyB = base;
fwheelJointDef.collideConnected = false;
fwheelJointDef.localAnchorB.Set(1.5,0);
fwheelJointDef.enableMotor = true;
//fwheelJointDef.maxMotorTorque = 5;
//fwheelJointDef.motorSpeed = 0;
var fwheelJoint = world.CreateJoint(fwheelJointDef);

var rwheelJointDef = new b2RevoluteJointDef();
rwheelJointDef.bodyA = rwheel;
rwheelJointDef.bodyB = base;
rwheelJointDef.collideConnected = false;
rwheelJointDef.localAnchorB.Set(-1.5,0);
rwheelJointDef.enableMotor = true;
//rwheelJointDef.maxMotorTorque = 5;
//rwheelJointDef.motorSpeed = 0;
var rwheelJoint = world.CreateJoint(rwheelJointDef);

/*var raxle = makeBody(world, {
	shape: 'block',
	type: 'dynamic',
	x: 0,
	y: 13,
	width: 3,
	height: 0.6,
	orientation: {
		position: new b2Vec2(-1 - 0.6*Math.cos(Math.PI/3), -0.3 - 0.6*Math.sin(Math.PI/3)),
		angle: Math.PI/3
	}
});
*/
debugDraw.SetSprite(ctx);
debugDraw.SetDrawScale(17);
debugDraw.SetFillAlpha(0.3);
debugDraw.SetLineThickness(1.0);
debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
world.SetDebugDraw(debugDraw);
//world.DrawDebugData();

function render()
{
	rwheelJoint.SetMotorSpeed(0);
	rwheelJoint.SetMaxMotorTorque(0);
	if (!bike_in_air) {
		if (input.pressed('k')) {
			if (base.GetLinearVelocity().x < MAX_SPEED) {
				//base.ApplyImpulse(new b2Vec2(10,0), base.GetWorldCenter());
				rwheelJoint.SetMotorSpeed(-200);
				rwheelJoint.SetMaxMotorTorque(200);
			}
			
		}
		else if (input.pressed('l')) {
			if (base.GetLinearVelocity().x < MAX_TURBO) {
				//base.ApplyImpulse(new b2Vec2(10,0), base.GetWorldCenter());
				rwheelJoint.SetMotorSpeed(-200);
				rwheelJoint.SetMaxMotorTorque(400);
			}
			
		}
	}

	if (input.pressed('a')) {
		if (base.GetAngle() > MIN_ANGLE) {
			var angle_speed = Math.min((MIN_ANGLE - base.GetAngle()) / MIN_ANGLE, 1);
			base.ApplyImpulse(new b2Vec2(0,-10 * angle_speed), new b2Vec2(base.GetWorldCenter().x + 1.5, base.GetWorldCenter().y));
			base.ApplyImpulse(new b2Vec2(0,10 * angle_speed), new b2Vec2(base.GetWorldCenter().x - 1.5, base.GetWorldCenter().y));
			//base.SetAngle(base.GetAngle() - 0.05);
		}
	} else if (input.pressed('d')) {
		if (base.GetAngle() < MAX_ANGLE) {
			var angle_speed = Math.min((MAX_ANGLE - base.GetAngle()) / MAX_ANGLE, 1);
			base.ApplyImpulse(new b2Vec2(0,10 * angle_speed), new b2Vec2(base.GetWorldCenter().x + 1.5, base.GetWorldCenter().y));
			base.ApplyImpulse(new b2Vec2(0,-10 * angle_speed), new b2Vec2(base.GetWorldCenter().x - 1.5, base.GetWorldCenter().y));
			//base.SetAngle(base.GetAngle() + 0.05);
		}
	}

	if (input.pressed('p')) {
		logging = !logging;
	}

/*
	if (base.GetAngle() < MIN_ANGLE) {
		base.SetAngle(MIN_ANGLE);
	}
	if (base.GetAngle() > MAX_ANGLE) {
		base.SetAngle(MAX_ANGLE);
	}
*/
	/*if (input.pressed("a")) {
		rwheelJoint.SetMotorSpeed(15 * Math.PI);
		fwheelJoint.SetMotorSpeed(15 * Math.PI);
		rwheelJoint.SetMaxMotorTorque(50);
		fwheelJoint.SetMaxMotorTorque(50);
	} else if (input.pressed("d")) {
		rwheelJoint.SetMotorSpeed(-205 * Math.PI);
		//fwheelJoint.SetMotorSpeed(-205 * Math.PI);
		rwheelJoint.SetMaxMotorTorque(190);
		//fwheelJoint.SetMaxMotorTorque(190);
	} else {
		rwheelJoint.SetMotorSpeed(0);
		fwheelJoint.SetMotorSpeed(0);
		rwheelJoint.SetMaxMotorTorque(0);
		fwheelJoint.SetMaxMotorTorque(0);
	}*/
	world.Step(1/60, 10, 10);
	world.DrawDebugData();
	window.requestAnimationFrame(render);
	//clog(base.GetLinearVelocity().x);
	clog(base.GetAngle());
	//clog(bike_in_air);
}

jQuery(window).resize(onResize);
onResize();
render();