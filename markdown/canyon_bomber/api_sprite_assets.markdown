Sprites are bitmap images that can be moved around the screen; they replace the rectangles we've been using up until this point. Adding sprites will make the game feel a lot less prototype-y. This is a big step and walks us through the asset creation process as well as code.

First of all, we need to have some assets to work with.

[Mockup](LINKME)

I drew up a mockup with some simple sprites and tiles, based on the original game, but adding a little more detail.

---

Now, we have a few options for turning this mockup into usable assets. Kha will take care of converting and packaging the image when we rebuild the project. But we still need to assign "meanings" to the assets that make them equivalent to the rectangles we've been using up until now. 
* We could split it into one image for each asset, and refer to different files. 
* We could realign them in a simple tile pattern, and then index by the tile number. 
* Or we could define bounding boxes on the original image.

I'm going to take this last approach, using my own tool, [Pixelbound](http://triplefox.itch.io/pixelbound). It's free(or pay what you want) and comes with source code. Pixelbound makes it very simple to define bounding boxes on mockups. This also has the benefit of letting me specify collision boxes independently of the sprite, if I want.

The output of Pixelbound is a JSON file containing some coordinates:

### spritedata.json
```json
{"images":[{"names":["blimp","plane","block","boulder","bomb","explosion1","explosion2","explosion3","explosion4","blocktl","blocktr","blockbl","blockbr","alphabet1","rect035","rect036","rect037","rect038","rect039","rect040","rect041","rect042","rect043","rect044","rect045","rect046","rect047","rect048","rect049","rect050","rect051","rect052","rect053","rect054","rect055","rect056","rect057","rect058","rect059","numbers1","rect015","rect016","rect017","rect018","rect019","rect020","rect021","rect022","rect023","alphabet2","rect061","rect062","rect063","rect064","rect065","rect066","rect067","rect068","rect069","rect070","rect071","rect072","rect073","rect074","rect075","rect076","rect077","rect078","rect079","rect080","rect081","rect082","rect083","rect084","rect085","numbers2","rect025","rect026","rect027","rect028","rect029","rect030","rect031","rect032","rect033"],"image_relative":"sprites.png","rects":[\[0,0,32,15,0],[83,5,22,10,0],[48,16,8,8,0],[72,16,8,8,0],[15,18,3,4,0],[66,30,4,4,0],[72,31,8,7,0],[81,29,10,7,0],[93,31,7,5,0],[8,40,8,8,0],[24,40,8,8,0],[40,40,8,8,0],[56,40,8,8,0],[90,73,5,6,0],[96,73,5,6,0],[102,73,4,6,0],[107,73,5,6,0],[113,73,4,6,0],[118,73,4,6,0],[123,73,6,6,0],[130,73,5,6,0],[136,73,4,6,0],[141,73,4,6,0],[146,73,5,6,0],[90,80,4,6,0],[95,80,7,6,0],[103,80,6,6,0],[110,80,5,6,0],[116,80,5,6,0],[122,80,5,6,0],[128,80,5,6,0],[134,80,4,6,0],[139,80,4,6,0],[144,80,5,6,0],[90,87,6,6,0],[97,87,7,6,0],[105,87,5,6,0],[111,87,5,6,0],[117,87,5,6,0],[33,57,4,6,0],[38,57,5,6,0],[44,57,4,6,0],[49,57,5,6,0],[55,57,5,6,0],[61,57,5,6,0],[67,57,5,6,0],[73,57,5,6,0],[79,57,5,6,0],[85,57,5,6,0],[71,97,5,6,0],[77,97,5,6,0],[83,97,4,6,0],[88,97,5,6,0],[94,97,4,6,0],[99,97,4,6,0],[104,97,6,6,0],[111,97,5,6,0],[117,97,4,6,0],[122,97,4,6,0],[127,97,5,6,0],[71,104,4,6,0],[76,104,7,6,0],[84,104,6,6,0],[91,104,5,6,0],[97,104,5,6,0],[103,104,5,6,0],[109,104,5,6,0],[115,104,4,6,0],[120,104,4,6,0],[125,104,5,6,0],[71,111,6,6,0],[78,111,7,6,0],[86,111,5,6,0],[92,111,5,6,0],[98,111,5,6,0],[32,67,4,6,0],[37,67,5,6,0],[43,67,4,6,0],[48,67,5,6,0],[54,67,5,6,0],[60,67,5,6,0],[66,67,5,6,0],[72,67,5,6,0],[78,67,5,6,0],[84,67,5,6,0]\],"image_absolute":"C:\\khastuff\\Empty-master\\Assets\\sprites.png"}],"palette":[\[230,153,0],[0,153,128],[242,230,64],[0,115,179],[89,179,230],[204,102,0],[204,153,179],[0,0,0]\]}
```

* Now I take both of these files and add them to "Assets". 
* Since we populated khafile.js when we added the font, we can run khamake now to add them to the project build.

Finally, we write some library code to parse the JSON into easily-accessed assets, and build some drawing functionality that lets us easily swap out our existing code:

### BoundsData.hx
```haxe
import haxe.Json;
import kha.FastFloat;
import kha.graphics2.Graphics;
import kha.Image;
class BoundsImage {
	public var names : Array<String>;
	public var rects : Array<Array<Int>>;
	public var names_map : Map<String, Int>;
	public var image_relative : String;
	public var image_absolute : String;
	public function new() {
		
	}
	public function updateCache() {
		names_map = new Map();
		for (i0 in 0...names.length) {
			names_map.set(names[i0], i0);
		}
	}
	public inline function nameToRect(name : String, ?offset : Int=0) {
		return rects[names_map.get(name)+offset];
	}	
}

class BoundsData {
	public var images : Array<BoundsImage>;
	public var palette : Array<Array<Int>>;
	
	public function new(data : String)
	{
		var jd = Json.parse(data);
		this.palette = jd.palette;
		this.images = [];
		for (img in cast(jd.images,Array<Dynamic>)) {
			var rimg = new BoundsImage();
			rimg.names = img.names;
			rimg.rects = img.rects;
			rimg.image_relative = img.image_relative;
			rimg.image_absolute = img.image_absolute;
			rimg.updateCache();
			this.images.push(rimg);
		}
	}
}

typedef FontData = { font_name : String,
	image_idx : Int, sprite_name:String, characters:String,
	whitespace : Int
	};

class KhaBoundsData {
	public var boundsdata : BoundsData;
	public var images : Array<Image>;
	public var fonts : Map<String, FontData>;
	public var font_cache : Map<String, Map<Int, Int>>;
	public function new( data : String, images : Array<Image>,
		fonts : Array<FontData>) {
		this.boundsdata = new BoundsData(data);
		this.images = images;
		this.fonts = new Map();
		for (n in fonts) this.fonts.set(n.font_name, n);
		this.font_cache = new Map();
		for (f0 in fonts) {
			var f1 = new Map<Int, Int>();
			for (o in 0...f0.characters.length) {
				var dest = o;
				var src = f0.characters.charCodeAt(o);
				f1.set(src, 
				boundsdata.images[f0.image_idx].names_map.get(
					f0.sprite_name) + dest);				
			}
			font_cache.set(f0.font_name, f1);
		}
	}
	public inline function draw(g2 : Graphics, x : FastFloat, y : FastFloat, 
		image_idx : Int, sprite_name : String, ?sprite_offset : Int=0)
	{
		var bound = get(image_idx, sprite_name, sprite_offset);
		g2.drawSubImage(images[image_idx], 
			x, y, bound[0], bound[1], bound[2], bound[3]);
	}
	public inline function drawCenter(g2 : Graphics, 
		x : FastFloat, y : FastFloat,
		w : FastFloat, h : FastFloat,
		image_idx : Int, sprite_name : String, ?sprite_offset : Int = 0)
	{
		var bound = get(image_idx, sprite_name, sprite_offset);
		var cx = x + w / 2 - bound[2] / 2;
		var cy = y + h / 2 - bound[3] / 2;
		g2.drawSubImage(images[image_idx], 
			cx, cy, bound[0], bound[1], bound[2], bound[3]);
	}
	public inline function drawCenterScaled(g2 : Graphics, 
		x : FastFloat, y : FastFloat,
		w : FastFloat, h : FastFloat,
		sw : FastFloat, sh : FastFloat,
		image_idx : Int, sprite_name : String, ?sprite_offset : Int = 0)
	{
		var bound = get(image_idx, sprite_name, sprite_offset);
		var dw = bound[2] * sw;
		var dh = bound[3] * sh;
		var cx = x + w / 2 - dw / 2;
		var cy = y + h / 2 - dh / 2;
		g2.drawScaledSubImage(images[image_idx], 
			bound[0], bound[1], bound[2], bound[3], cx, cy, 
			dw, dh);
	}
	public inline function get(image_idx : Int, sprite_name : String, 
		?sprite_offset : Int=0)
	{
		return boundsdata.images[image_idx].nameToRect(sprite_name, 
			sprite_offset);
	}
	public inline function stringWidth(text : String, font : String,
		spacing : Int) {
		var f0 = fonts.get(font);
		var f1 = font_cache.get(font);
		var result = 0;
		for (i0 in 0...text.length) {
			var c = text.charCodeAt(i0);
			if (f1.exists(c)) {
				var bd = boundsdata.images[f0.image_idx].rects[f1.get(c)];
				result += bd[2];
			} else if (c == ' '.charCodeAt(0)) {
				result += f0.whitespace;
			}
			if (i0 < text.length-1)
				result += spacing;
		}
		return result;
	}
	public inline function stringHeight(text : String, font : String) {
		var f0 = fonts.get(font);
		var f1 = font_cache.get(font);
		var result = 0;
		for (i0 in 0...text.length) {
			var c = text.charCodeAt(i0);
			if (f1.exists(c)) {
				var bd = boundsdata.images[f0.image_idx].rects[f1.get(c)];
				if (bd[3] > result) result = bd[3];
			}
		}
		return result;
	}
	public inline function string(g2 : Graphics, x : Int, y : Int,
		text : String, font : String,
		spacing : Int) {
		var f0 = fonts.get(font);
		var f1 = font_cache.get(font);
		for (i0 in 0...text.length) {
			var c = text.charCodeAt(i0);
			if (f1.exists(c)) {
				var bd = boundsdata.images[f0.image_idx].rects[f1.get(c)];
				var img = images[f0.image_idx];
				g2.drawSubImage(img, x, y, bd[0], bd[1], bd[2], bd[3]); 
				x += bd[2];
			} else if (c == ' '.charCodeAt(0)) {
				x += f0.whitespace;
			}
			if (i0 < text.length-1)
				x += spacing;
		}
	}	
}
```

In the main code, we replace the sprite calls, add some branching to switch between plane/blimp and mirror them for the correct direction, add a "smoothing" process to the walls so that the diagonals look nicer, add an explosion "particle", and replace the Kha font calls with our cool bitmapped font. Whew! Adding graphics sure does require a lot of code!

Let's break each of those things down:

# Drawing Plane, Blimp, and Bomb

This is the simplest kind of sprite drawing: take some coordinates and throw an image up on the screen. It's only different from the rectangle drawing in that we're going to conform to the size of the sprite(and we don't even have to do that, necessarily, if we scale the sprite).

We also mirror the plane and blimp. This is done by scaling the sprite with a negative X value.

We can reuse all of our coloring code because I had the foresight to design the sprites to be grayscale, meaning we have a very colorful game without much effort!

> As explained in the Graphics2 API section, if you find the look of the scaling to be "wrong," try switching from using transforms on FastMatrix3 to using a backbuffer at your preferred resolution.

# Smoothing the Walls

Now we have more of a "real" tilemap situation, where some tiles look different from others but share the same behaviors. One way we could approach the problem is to separate the visuals from the collision entirely - this is done by most games. But the simpler way for our game is to add a few more values to the Enum, and then update the corresponding switch statements to either behave the same way or render something different.

Then the only thing left to do is to actually populate the walls correctly, which is done in an additional pass after the original canyon generation process finishes.

# Add a Particle

Real particle effects tend to involve some kind of particle simulation that can produce fluid-like effects like smoke, flames, bubbles, etc. Again, we can simplify to "basic" particle programs whose instances hold a position and velocity state. We only use one type here to add little puffs when the rocks are broken, but more are certainly possible! And because we are using Haxe's enums, we can pass parameters into the program so that each instance of the particles may behave a bit differently.

The way in which I spawn particles is also interesting and relevant to any case in a game where there is a "more than one" in the world. I assume that we will only ever have 64 particles at most, and allocate all of them. Then I process all of them each frame, using their timer value to determine liveness. This is a crude technique to avoid triggering garbage collection - just instance a pool of our maximum number, and never add to or remove from the pool. This limits what happens if the system is pressured with a lot of particles - it'll just stop spawning more. It also gives me a realistic measure of maximium system throughput. If I'm already iterating on my maximum quantity, then I can't be fooled into thinking I have "room to waste."

# Bitmap Font

The font data is the most complex part of this whole rendering operation. The font rendering pipeline builds on top of the sprite rendering pipeline, but it has the complication of needing to map each character of the string to a sprite. It works by mapping a given set of characters such as "ABCDEF..." to sprite indexes, starting from a certain named sprite.

I decided, after I had created them, to combine the "alphabet" and "number" groups into one continuous set each, which led to some manual rearrangement of the rectangles Pixelbound auto-generates so that they were in the proper order. Pixelbound doesn't have a group offset feature, but I was able to make the change by editing the JSON text.

After doing all that work to configure the data, the rest is a matter of computing widths for each character based on the sprite data, and then adding some spacing. A more complex font engine can extend to additional layout, effects, more precise spacing and kerning, etc. The game includes some basic layout features in string() and centerString() - it uses the two "alphabets" to make a shadow offset effect.

# Why use a single image for many sprites?

One of the benefits of using a single image for all the sprites, if you aren't aware, is that GPU drawing can be optimized. In the jargon of GPU programming, a "texture" is referenced before beginning a "draw call". During a draw call, you send a "batch" of geometry data - coordinates, offsets, etc. If you don't have to switch textures, the only unique thing the GPU has to process is geometry. Draw calls are a major bottleneck because they cause the GPU to idle, and the stop-start of frequent draw calls will kill performance. 

Therefore, the use of sprite sheets is one of the first optimizations encountered in 2D GPU drawing, and well-optimized 2D games will "pack" their sprites tightly in sheets so as to minimize draw calls. (This can be done by hand or by algorithm.)

Graphics2 will do the behind-the-scenes work of optimizing your draw calls when you use drawSubImage() and its variants, so you don't have to know any more than that basic outline to get most of the benefit when working with Kha for 2D games.

# What if I want to upgrade to Graphics4 later?

Direct quote from Robert:

>*g2 runs on g4 and can be mixed with g4 if your target supports g4 (most important exceptions are browsers that don't support webgl or don't activate it because of black-listed drivers).*

>*But g4 is a completely different thing than g2 and needs a much bigger skillset. There are Lubos' tutorials though.*

>*Oh and don't expect any speed improvements from d3d12. d3d12 (and vulkan) is about low level control, not about magic speed improvements.*

TODO Link to Lubos' tutorials

### Empty.hx
```haxe
package;
import kha.Framebuffer;
import kha.Color;
import kha.input.Keyboard;
import kha.input.Mouse;
import kha.Key;
import kha.math.FastMatrix3;
import kha.System;
import kha.Assets;
import BoundsData;

enum MapTile {
	MTNone;
	MTWall;
	MTWallTL;
	MTWallTR;
	MTRock(value : Int);
}
enum ParticleProgram {
	Explosion;
}

typedef Plane = { x:Float, y:Float, 
	w:Float, h:Float, 
	vx:Float, vy:Float, 
	dropped:Bool, passes:Int
	};
typedef Bomb = { x:Float, y:Float, 
	w:Float, h:Float, 
	vx:Float, vy:Float, 
	alive:Bool, hit:Bool, hit_time:Int };
typedef Player = {
	score : Int, lives : Int,
	plane : Plane,
	bomb : Bomb
};
typedef Particle = {
	x : Float, y : Float,
	time : Int,
	program : ParticleProgram,
	sprite_image : Int,
	sprite_name : String
};

class Empty {
	public function new() {
		if (Keyboard.get() != null) Keyboard.get().notify(onDown,onUp);
		if (Mouse.get() != null) Mouse.get().notify(onDownMouse, onUpMouse, null, null);
		Assets.loadEverything(function() { load_finished = true; startGame(); game_over = true; } );
	}
	
	public static inline var WIDTH = 320;
	public static inline var HEIGHT = 240;
	
	public static inline var TILE_W = 8;
	public static inline var TILE_H = 8;
	public static inline var MAP_W = Std.int(WIDTH / TILE_W);
	public static inline var MAP_H = Std.int(HEIGHT / TILE_H);
	public static inline var CANYON_Y = Std.int(MAP_H / 2);
	public static inline var ROCKFALL_TIMER = 4;
	public static inline var PLANE_MINY = Std.int(HEIGHT * 0.1);
	public static inline var PLANE_MAXY = Std.int(HEIGHT * 0.4);
	public static inline var BOMB_HIT_TIMER = 6;
	public static inline var BOMB_GRAVITY = 0.08;
	public static inline var EXPLODE_0 = 10 * 4/4;
	public static inline var EXPLODE_1 = 10 * 3/4;
	public static inline var EXPLODE_2 = 10 * 2/4;
	public static inline var EXPLODE_3 = 10 * 1/4;
	public static inline var IS_BLIMP_UNTIL_VX = 1.0;
	
	public var load_finished = false;
	public var fire = false;
	var player : Array<Player>;
	var map : Tilemap<MapTile>;
	var rockfall_time : Int;
	var game_over : Bool;
	var high_score : Int = 100;
	var particle : Array<Particle>;
	var sprite : KhaBoundsData;
	
	public function startGame() {
		player = [{ bomb:null, plane:null, score:0, lives:5 }];
		game_over = false;
		particle = [for (n in 0...64) 
			{x:0., y:0., program:Explosion, time: -1, 
			sprite_image:0, sprite_name:null}
		];
		sprite = new KhaBoundsData(
			Assets.blobs.spritedata.toString(),
			[Assets.images.sprites],
			[
			{
				font_name:"alphabet1",
				image_idx:0,
				sprite_name:"alphabet1",
				characters:"ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
				whitespace:4
			},
			{
				font_name:"alphabet2",
				image_idx:0,
				sprite_name:"alphabet2",
				characters:"ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
				whitespace:4
			}
			]
			);
		startLevel();
	}
	
	public function startLevel() {
		rockfall_time = 0;
		for (p in player) {
			p.plane = { x:0., y:0., w:8., h:8., vx:2., vy:0.,
				dropped:false, passes:0
			};
			respawnPlane(p.plane);
			p.bomb = { x:0., y:0., w:4., h:4., vx:0., vy:0., alive:false, hit:false,
				hit_time:BOMB_HIT_TIMER
			};
		}
		fire = false;
		map = new Tilemap(MAP_W, MAP_H, TILE_W, TILE_H, MTNone); // initial sizing
		var columns = new Array<Int>();
		for (x in 0...MAP_W) { // generate walls
			var y = 0;
			if (x == 0 || x == MAP_W - 1) { y = CANYON_Y; } // sides blocked
			else { // procedural wall pattern
				y = Math.round(Math.sin((x / MAP_W) * 3.14159) * // take half a sine
					(MAP_H - CANYON_Y)); // scaling
				y += CANYON_Y; // offset
				y += Std.int(Math.random() * 6 - 3); // noise
				// clamp:
				if (y < CANYON_Y) y = CANYON_Y;
				if (y >= MAP_H) y = MAP_H - 1;
			}
			columns.push(y);
		}
		for (x in 0...MAP_W - 2) { // smooth columns to prevent narrow gaps
			if (columns[x] < columns[x + 1] && columns[x + 2] < columns[x + 1])
			{
				columns[x + 1] = columns[x];
			}
		}
		for (x in 0...MAP_W) { // set the columns
			var wall_y = columns[x];
			for (y in 0...MAP_H) {
				var idx = map.i(x, y);
				if (y >= CANYON_Y) { // start drawing canyon here
					if (y >= wall_y) {
						map.d[idx] = MTWall;
					} else {
						map.d[idx] = // score based on depth
						MTRock(Std.int((y - CANYON_Y + 1) * 5 / 
							(MAP_H - CANYON_Y)));
					}
				} else {
					map.d[idx] = MTNone;
				}
			}
		}
		for (y in 0...map.h) { // smooth canyon
			for (x in 0...map.w) {
				var idx = map.i(x, y);
				if (map.d[idx] == MTWall && 
					y > 0 && 
					map.d[idx - MAP_W] != MTWall &&
					map.d[idx - MAP_W] != MTWallTL &&
					map.d[idx - MAP_W] != MTWallTR
					) {
					if (x > 0 && map.d[idx - 1] != MTWall &&
						map.d[idx - 1] != MTWallTL &&
						map.d[idx - 1] != MTWallTR)
						map.d[idx] = MTWallTL;
					else if (x < map.w - 1 && 
						map.d[idx + 1] != MTWall &&
						map.d[idx + 1] != MTWallTL &&
						map.d[idx + 1] != MTWallTR)
						map.d[idx] = MTWallTR;
				}
			}
		}		
	}
	
	public function onDown(k : Key, s : String) {
		fire = true;
	}
	public function onUp(k : Key, s : String) {
		fire = false;
	}
	public function onDownMouse(button : Int, x : Int, y : Int) {
		fire = true;
	}
	public function onUpMouse(button : Int, x : Int, y : Int) {
		fire = false;
	}
	
	public function render(framebuffer: Framebuffer): Void {
		if (!load_finished) return;
		// color settings
		var col_bg = Color.Black;
		var col_plane = Color.White;
		var col_bomb = Color.Red;
		var col_wall = Color.Blue;
		var col_rock = [Color.Orange, Color.Pink, Color.Purple, 
			Color.Red, Color.Cyan];
		var col_explosion = Color.White;
		var transform = FastMatrix3.scale(
			System.pixelWidth / WIDTH, 
			System.pixelHeight / HEIGHT);
		{ // graphics2 calls
			var g = framebuffer.g2;
			g.begin();
			g.pushTransformation(transform);
			{ // render bg
				g.clear(col_bg);
			}
			{ // render canyon
				var x = 0.;
				var y = 0.;
				for (t0 in map.d) {
					switch(t0) {
						case MTNone:
						case MTWall:
							g.color = col_wall;
							sprite.draw(g, 
								x * TILE_W, y * TILE_H, 
								0, "block");
						case MTWallTL:
							g.color = col_wall;
							sprite.draw(g, 
								x * TILE_W, y * TILE_H, 
								0, "blocktl");
						case MTWallTR:
							g.color = col_wall;
							sprite.draw(g, 
								x * TILE_W, y * TILE_H, 
								0, "blocktr");
						case MTRock(v):
							g.color = col_rock[v%5];
							sprite.draw(g, 
								x * TILE_W, y * TILE_H, 
								0, "boulder");							
					}
					x += 1;
					if (x >= MAP_W) { x = 0; y += 1; }
				}
			}
			for (p in player) {
				{ // render plane
					g.color = col_plane;
					var mirror = 1;
					var plane = p.plane;
					if (plane.vx < 0) mirror = -1;
					var spr = "plane";
					if (isBlimp(plane))
						spr = "blimp";
					sprite.drawCenterScaled(g, plane.x, plane.y,
						plane.w, plane.h, 
						mirror, 1, 0, spr);
				}
				if (p.bomb.alive) { // render bomb
					var bomb = p.bomb;
					g.color = col_bomb;
					sprite.drawCenter(g, bomb.x, bomb.y, bomb.w, bomb.h, 
						0, "bomb");
				}
			}
			for (p in particle) { // render particles
				if (p.time > 0) {
					g.color = col_explosion;
					sprite.draw(g, p.x, p.y, p.sprite_image, p.sprite_name);
				}
			}
			{ // render some text
				if (game_over) {
					string(
						g, 'SCORE ${player[0].score}     HIGH ${high_score}',
						8, 8, 1
					);
					var gotxt = 'Game Over'.toUpperCase();
					centerString(
						g, 
						gotxt,
						WIDTH / 2,
						HEIGHT / 2,
						1
					);
				} else {
					string(
						g,
						'LIVES ${player[0].lives}     SCORE ${player[0].score}' +
						'     HIGH ${high_score}',  
						8, 8, 1
					);
				}
			}
			g.popTransformation();
			g.end();
		}
	}
	
	public function outOfBounds(plane : Plane) {
		return (plane.x > WIDTH + plane.w || plane.x < -plane.w * 2);
	}
	public function respawnPlane(plane : Plane) {
		if (Math.random() > 0.5) {
			plane.x = -plane.w + 1;
			plane.vx = 1;
		} else {
			plane.x = WIDTH + 1;
			plane.vx = -1;
		}
		plane.y = (Math.random() * (PLANE_MAXY - PLANE_MINY)) 
			+ PLANE_MINY;
		plane.vx *= Math.min(0.5 + (plane.passes+1) * 0.15, 1.5);
	}
	
	public function update(): Void {
		if (!load_finished) return;
		for (p in player) {
			var bomb = p.bomb;
			var plane = p.plane;
			{ // if we tapped the button spawn the bomb, if possible
				if (!game_over && fire && !bomb.alive && p.lives > 0)  {
					bomb.alive = true;
					bomb.x = plane.x + plane.w / 2 - bomb.w / 2;
					bomb.y = plane.y + plane.h;
					bomb.vx = plane.vx;
					bomb.vy = 0.;
					bomb.hit = false;
					bomb.hit_time = BOMB_HIT_TIMER;
					p.plane.dropped = true;
				} else if (fire && game_over) {
					startGame();
				}
			}
			{ // advance plane movement
				plane.x += plane.vx;
				plane.y += plane.vy;
				// move plane into new passing position; end turn
				var turn_over = false;
				if (outOfBounds(plane) && !bomb.alive)
				{
					plane.passes += 1;
					respawnPlane(plane);
					turn_over = true;
				}
				if (turn_over && !game_over) {
					// test for whether turn was successful
					if (!p.plane.dropped) {
						p.lives -= 1;
					}
					p.plane.dropped = false;
					// test for new level
					var newlevel = true;
					for (t in map.d) {
						if (t.getIndex() == MTRock(0).getIndex()) {
							newlevel = false;
						}
					}
					if (newlevel) {
						startLevel();
					}
					if (p.lives < 1) {
						game_over = true;
						if (p.score > high_score)
							high_score = p.score;
					}
				}
			}
			{ // advance bomb movement
				if (bomb.alive) {
					bomb.vy += BOMB_GRAVITY; // gravity
					bomb.x += bomb.vx;
					bomb.y += bomb.vy;
					var top = bomb.y;
					var left = bomb.x;
					var right = bomb.x + bomb.w;
					var bottom = bomb.y + bomb.h;
					var i0 = map.p2i(left, top);
					var i1 = map.p2i(right, top);
					var i2 = map.p2i(left, bottom);
					var i3 = map.p2i(right, bottom);
					var damage = 0;
					damage = Std.int(Math.max(damage, bombCollision(i0, p)));
					damage = Std.int(Math.max(damage, bombCollision(i1, p)));
					damage = Std.int(Math.max(damage, bombCollision(i2, p)));
					damage = Std.int(Math.max(damage, bombCollision(i3, p)));
					bomb.hit_time -= damage;
					if (bomb.hit_time < 1) bomb.alive = false;
					if (bomb.y > HEIGHT)
						bomb.alive = false;
					if (!bomb.alive && !bomb.hit)
						p.lives -= 1;
				}
			}
		}
		if (rockfall_time < 1) { // advance the rock fall
			rockfall_time = ROCKFALL_TIMER;
			for (y in 1...MAP_H) {
				var iy0 = (MAP_H - 1) - y; // rock to fall
				var iy1 = iy0 + 1; // tile underneath
				for (x in 0...MAP_W) {
					var idx0 = map.i(x, iy0);
					var idx1 = map.i(x, iy1);
					if (map.d[idx0].getIndex() == Type.enumIndex(MTRock(0))
						&& map.d[idx1] == MTNone)
					{
						map.d[idx1] = map.d[idx0];
						map.d[idx0] = MTNone;
					}
				}
			}
		} else {
			rockfall_time--;
		}
		for (p in particle) { // particle simulation
			if (p.time > 0) {
				switch(p.program) { // run particle program
					case Explosion:
						p.sprite_image = 0;
						if (p.time > EXPLODE_1) {
							p.sprite_name = "explosion1";
						}
						else if (p.time > EXPLODE_2) {
							p.sprite_name = "explosion2";
						}
						else if (p.time > EXPLODE_3) {
							p.sprite_name = "explosion3";
						}
						else {
							p.sprite_name = "explosion4";
						}
						p.y -= 0.2;
				}
				p.time -= 1;
			}
		}
	}
	
	public function bombCollision(idx : Int, p : Player) : Int {
		if (idx < 0 || idx > map.d.length) return 0;
		else switch(map.d[idx]) {
			case MTNone: return 0;
			case MTWall, MTWallTL, MTWallTR: return BOMB_HIT_TIMER;
			case MTRock(v): map.d[idx] = MTNone; 
				p.score += v;
				p.bomb.hit = true;
				spawnParticle(
					map.x2p(map.x(idx)), 
					map.y2p(map.y(idx)), Explosion);
				return 1;
		}
	}
	
	public function spawnParticle(x : Float, y : Float, program : ParticleProgram) {
		for (pi in 0...particle.length) {
			var p = particle[pi];
			if (p.time <= 0) {
				p.program = program;
				p.x = x;
				p.y = y;
				switch(program) {
					case Explosion:
						p.time = Std.int(EXPLODE_0 + Math.random() * 6);
				}
				return pi;
			}
		}
		return -1;
	}
	
	public function isBlimp(p : Plane) {
		return (Math.abs(p.vx) < IS_BLIMP_UNTIL_VX);
	}
	
	public function string(g, s, x : Float, y : Float, spacing) {
		sprite.string(
			g, 
			Std.int(x + 1),
			Std.int(y + 1),
			s,
			"alphabet2", spacing
		);
		sprite.string(
			g, 
			Std.int(x),
			Std.int(y),
			s,
			"alphabet1", spacing
		);
	}
	public function centerString(g, s, x : Float, y : Float, spacing) {
		sprite.string(
			g, 
			Std.int(x - sprite.stringWidth(s, "alphabet2", spacing) / 2 + 1),
			Std.int(y - sprite.stringHeight(s, "alphabet2") / 2 + 1),
			s,
			"alphabet2", spacing
		);
		sprite.string(
			g, 
			Std.int(x - sprite.stringWidth(s, "alphabet1", spacing) / 2),
			Std.int(y - sprite.stringHeight(s, "alphabet1") / 2),
			s,
			"alphabet1", spacing
		);
	}
	
}
```