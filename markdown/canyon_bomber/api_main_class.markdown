# Kha API 1: Main class, System

The Empty project already has Kha configure some things about the display and update timing, so let's review. For laziness and simplicity reasons, we're going to stick with the "Empty" naming convention throughout this guide, although you may want to pick a cuter name for your project's title and main class.

### Main.hx
```haxe
package;

import kha.Scheduler;
import kha.System;

class Main {
	public static function main() {
		System.init("Empty", 640, 480, initialized);
	}
	
	private static function initialized(): Void {
		var game = new Empty();
		System.notifyOnRender(game.render);
		Scheduler.addTimeTask(game.update, 0, 1 / 60);
	}
}
```
### Empty.hx
```haxe
package;
import kha.Framebuffer;

class Empty {
	public function new() {
		
	}
	
	public function render(framebuffer: Framebuffer): Void {
		
	}
	
	public function update(): Void {
		    
	}
}
```

Running this should still give you a blank screen. We have three Kha classes to look at:

## System

This class is the "global state" of your Kha app: It holds the render callback, it says how big the screen is and how fast it refreshes, etc. We use it here to initialize the screen, and then to set up the rendering callback. System also contains:

* callbacks for various OS/windowing-level events, like being minimized or shutdown
* a global "time" value (since startup, measured in seconds)
* vsync control
* systemID - what target you are on, e.g. "HTML5".

## Scheduler

This class governs all the interesting timing information in Kha. We'll discuss it in depth later. For now, just know that it lets you set up recurring tasks like updates to your gameplay, independently of the render callback. Although System has a  "time", Scheduler has a "framerate-corrected" time, so consider using it first if the time is used for gameplay.

## Framebuffer

This is a class that represents the display we're drawing to from the rendering callback. This will get more attention shortly, as our next API chapter is about simple drawing.

