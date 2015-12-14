We will make a clone of the 70's Atari game "Canyon Bomber". In this game, a plane flies over a canyon in side view and drops bombs, trying to clear away all the rocks on the board without missing. It's one of the earliest "one-button games" and presents a well-rounded exercise for Kha's toolset.

In this passage we'll work on moving a rectangle across the screen over time, introducing timing and simple animation. The rectangle will later become the "bomber plane" in our game.

## Timing in Kha

Kha contains a sophisticated timing and scheduling system, but also lets you dig into raw timing data.

    Scheduler.addTimeTask(game.simulate, 0, 1 / 60);

This uses the Scheduler API to call game.simulate 60 times a second(every ~16.6 ms), indefinitely.

### Period vs. Duration

Period is the total length of a scheduled task. Duration is the frequency at which the task is repeated.

For example, if you wish to call an event 30 times a second, but for only 2 seconds, you would add a task with a duration of 1/30 and a period of 2.

### realTime() and time()

To get the current time since start, you can use:

    Scheduler.time();

and

    Scheduler.realTime();

Scheduler will automatically apply smoothing, limiting, and atomization to timing data so that the average-case experience is as jitter and pause-free as possible.

 * Scheduler.time() is the time that has passed after these adjustments.
 * Scheduler.realTime() is the system global time, or "wall clock" time. Use this one for performance data, or if you want to do your own timing from scratch.

### Why atomic timing is useful

It is tempting to plug in a delta time into your physics equations, tweens, etc. and allow the time to float freely. Sometimes this is even a correct approach.

However, there are two reasons not to do this. One is that it makes physics simulations inconsistent - often wildly so. Jump heights will be unpredictable, people will go flying at strange velocities, etc. The other is that it hurts reproducability otherwise, for example if you are recording a demo for playback.

Therefore, the most flexible approach is to chop up delta times into regular "atoms" of time, and play through them one at a time. This is what Kha does inside its Scheduler API. It is even designed to support complex use-cases where timers get called in a certain order, or are paused or cancelled while active.

## Drawing rectangles

We use Graphics2.fillRect() to draw some rectangles. In doing so, we also make use of the "color" attribute on Graphics2. We already used some color to do our full-screen strobe, but here we can see more clearly what is going on.

Graphics2 uses a "finite state" model of rendering, where we describe a configuration for drawing, and then issue a command that updates the state of the framebuffer we are drawing to. So when we change color, that changes the color of the drawing commands we issue after that change.

## Scaling

Oh, how inconvenient! We aren't always going to get the resolution we request returned in System.pixelWidth and System.pixelHeight. After all, the system can't always give you what you ask for.

That also means that if we want to force a certain pixel resolution - and this is the type of game where that happens - we're going to have to think about scaling.

There are two ways we can approach this. 

1. The more "pixel-perfect" way would be to have a "*back buffer*". Instance an Image at our ideal resolution, draw the gameplay on that, then draw     that, scaled, to the display buffer. That guarantees that everything stays on the same pixel grid, no matter what we do.
2. But we'll go the other route of adding a *scaling transform* using a FastMatrix3 before our drawing calls. This will give us the correct proportions, and it avoids an additional trip through the GPU, so it may be somewhat faster, but it means that objects may look "wrong" if they are scaled, rotated, or placed on subpixel coordinates.

It's very easy to swap between these two methods if you prefer one or the other. Variations like only scaling to integer factors of the original, cropping the image, etc. are also possible.

## The plane's data structure and algorithms

I decided to make the plane a Haxe Typedef with an x and y position, x and y velocity, and a width and height. Although we don't have to define a width and height as a *variable* on the plane - it's never going to change during gameplay - it's convenient for us, so I splurged. 

The screen space and the physics space in Canyon Bomber are 1:1, and the camera is locked in one position, so no coordinate conversions have to take place during rendering - I just enter the position and size directly. If I wanted to scroll the screen or zoom in and out, this part would become more complex.

Then I wrote a routine to move it across the screen each update, and make it wrap around as it runs off the edge. This routine will get more complex later(and so will the plane's data).

---

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

class Empty {
	public function new() {
		if (Keyboard.get() != null) Keyboard.get().notify(onDown,onUp);
		if (Mouse.get() != null) Mouse.get().notify(onDownMouse,onUpMouse, null, null);
	}
	
	public static inline var WIDTH = 320;
	public static inline var HEIGHT = 240;
	
	public var fire = false;
	var plane = { x:0., y:0., w:8., h:8., vx:1., vy:0. };
	
	public function onDown(k : Key, s : String) {
		trace(s + " down");
		fire = true;
	}
	public function onUp(k : Key, s : String) {
		trace(s+" up");
		fire = false;
	}
	public function onDownMouse(button : Int, x : Int, y : Int) {
		trace('$button down');
		fire = true;
	}
	public function onUpMouse(button : Int, x : Int, y : Int) {
		trace('$button up');
		fire = false;
	}
	
	public function render(framebuffer: Framebuffer): Void {
		// color settings
		var col_bg = Color.Black;
		if (fire) 
			col_bg = Color.Red;
		var col_plane = Color.White;
		var transform = FastMatrix3.scale(
			System.pixelWidth / WIDTH, 
			System.pixelHeight / HEIGHT);
		{ // graphics2 calls
			var g = framebuffer.g2;
			g.begin();
			g.clear(col_bg);
			g.pushTransformation(transform);
			g.color = col_plane;
			g.fillRect(plane.x, plane.y, plane.w, plane.h);
			g.popTransformation();
			g.end();
		}
	}
	
	public function update(): Void {
		{ // advance plane movement
			plane.x += plane.vx;
			plane.y += plane.vy;
			// wrap around
			if (plane.x > WIDTH)
				plane.x = -plane.w + 1;
			else if (plane.x < -plane.w)
				plane.x = WIDTH + 1;
		}
	}
}
```