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

var PhysicsEngine = Class.extend({
	world: null,
	init: function(gravity) {
		gravity = gravity || 9.8;
		this.world = new b2World(new b2Vec2(0,gravity),true);

		var listener = new Box2D.Dynamics.b2ContactListener;
		listener.BeginContact = function(contact) {
			if (contact.GetFixtureB().GetFilterData().groupIndex == 4) {
				head_injury = true;
				contact.GetFixtureB().GetUserData().headInjury = true;
			}
			
			if (contact.GetFixtureB().GetFilterData().groupIndex == 7) {
				var contactId = contact.GetFixtureA().GetUserData().id;
				if (!contact.GetFixtureB().GetUserData().contacts) contact.GetFixtureB().GetUserData().contacts = [];
				var index = contact.GetFixtureB().GetUserData().contacts.indexOf(contactId);
				if (index == -1) {
					contact.GetFixtureB().GetUserData().contacts.push(contactId);
					contact.GetFixtureB().GetUserData().inAir = false;
					bike_in_air = false;
				}
			}
		};
		listener.EndContact = function(contact) {
			if (contact.GetFixtureB().GetFilterData().groupIndex == 7) {
				var contactId = contact.GetFixtureA().GetUserData().id;
				if (!contact.GetFixtureB().GetUserData().contacts) contact.GetFixtureB().GetUserData().contacts = [];
				var index = contact.GetFixtureB().GetUserData().contacts.indexOf(contactId);
				if (index >= 0) {
					contact.GetFixtureB().GetUserData().contacts.splice(index, 1);
					if (contact.GetFixtureB().GetUserData().contacts.length == 0) {
						bike_in_air = true;
						contact.GetFixtureB().GetUserData().inAir = true;
					}
				}
			}
		};
		this.world.SetContactListener(listener);
	},

	makeBody: function(options) {
		options = options || {};
	
		var def = new b2BodyDef();
		def.position = new b2Vec2(options.pos.x, options.pos.y);
		def.type = options.type == 'static' ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
		var body = gPhysicsEngine.world.CreateBody(def);
		body.SetUserData(options.userdata || {});

		options.fixtures = options.fixtures || [];
		for (var i = 0; i < options.fixtures.length; i++) {
			var fOptions = options.fixtures[i];
			var fixture = new b2FixtureDef();
			fixture.density = fOptions.density || 1;
			fixture.friction = fOptions.friction || 1;
			fixture.restitution = fOptions.restitution || 0;
			fixture.filter.categoryBits = fOptions.categoryBits || 0x0001;
			fixture.filter.maskBits = fOptions.maskBits || 0xFFFF;
			fixture.filter.groupIndex = fOptions.groupIndex || 0;

			switch (fOptions.shape) {
				case "circle":
				fOptions.radius = fOptions.radius || 1;
				fixture.shape = new b2CircleShape(fOptions.radius);
				fixture.shape.m_p.Set(fOptions.pos.x, fOptions.pos.y);
				break;
				case "polygon":
				fixture.shape = new b2PolygonShape();
				fixture.shape.SetAsArray(fOptions.points, fOptions.points.length);
				break;
				case "block":
				fOptions.width = fOptions.width || 1;
				fOptions.height = fOptions.height || 1;
				fixture.shape = new b2PolygonShape();
				
				fOptions.rotation = fOptions.rotation || 0;
				fixture.shape.SetAsOrientedBox(fOptions.width / 2, fOptions.height / 2, new b2Vec2(fOptions.pos.x, fOptions.pos.y), fOptions.rotation);			
				break;
			}

			var fxtr = body.CreateFixture(fixture);
			fxtr.SetUserData(fOptions.userdata);
		}

		return body;
	}

	makeBike: function() {},
	makeWheel: function() {},
	makeBikeBody: function() {},
	makeRamp1: function() {},
	makeRamp2: function() {},
	makeRamp3: function() {},
	makeRamp4: function() {},
	makeTrack: function() {}
});

var gPhysicsEngine = new PhysicsEngine();