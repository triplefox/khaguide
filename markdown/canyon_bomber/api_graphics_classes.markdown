# Kha API 2: Display
    
Now we will render a very simple "strobe the screen with different colors". **Caution: this may be seizure-inducing.** (lower the display size if you're worried)

### Empty.hx
```haxe        
package;
import kha.Framebuffer;
import kha.Color;

class Empty {
	public function new() {
		
	}
	
	public function render(framebuffer: Framebuffer): Void {
		var nextcolor = [Color.White, Color.Red, Color.Blue, Color.Green, Color.Black][Std.int(Math.random() * 5)];
		var g = framebuffer.g1;
		g.begin();
		for (y in 0...framebuffer.height) {
		for (x in 0...framebuffer.width) {
		g.setPixel(x,y,nextcolor);
		}
		}
		g.end();
	}
	
	public function update(): Void {
		
	}
}
```

## What is "backbuffer.g1"?

Kha contains different numbered "levels" of its graphics API. Graphics1 is the simplest possible system: it can plot pixels only. 

Here is a replacement of that block using Graphics2:

```haxe
var g = framebuffer.g2;
g.begin();
g.clear(nextcolor);
g.end();
```

Graphics2 adds more "standard" functionality, including clearing the screen, drawing shapes and blitting images. It's for general-case 2D applications, and its routines can be counted on to be faster than plotting individual pixels. We'll expand on Graphics2 in later chapters.

There is also a Graphics4, which exposes the full shading pipeline. In theory Graphics3 represents fixed-function GPU pipelines, but it does not exist at this time. We will not venture into Graphics4 in this guide, and focus instead on fleshing out a game in Graphics2.

## Why is there a begin() and end()?

Kha batches the graphics operations internally and processes the actual drawing commands when it reaches end(). This lets you code your own rendering logic more freely, while letting Kha optimize the commands to whatever works best in the target environment.