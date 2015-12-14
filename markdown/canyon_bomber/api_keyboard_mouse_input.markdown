Next, let's respond to the keyboard and mouse. Kha provides raw input abstractions - you will still have to provide the high-level stuff like user customization.

For our game, we're only going to have one button. We'll take this an extra step by also mapping the mouse buttons. The example code now toggles the screen between white and black when the button is pressed.

### Empty.hx
```haxe
package;
import kha.Framebuffer;
import kha.Color;
import kha.input.Keyboard;
import kha.input.Mouse;
import kha.Key;

class Empty {
	public function new() {
		if (Keyboard.get() != null) Keyboard.get().notify(onDown,onUp);
		if (Mouse.get() != null) Mouse.get().notify(onDownMouse,onUpMouse, null, null);
	}
	
	public var fire = false;
	
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
		var nextcolor = Color.White;
		if (fire) 
			nextcolor = Color.Black;
		var g = framebuffer.g2;
		g.begin();
		g.clear(nextcolor);
		g.end();
	}
	
	public function update(): Void {
		
	}
}
```

# kha.input.Keyboard

This is an abstraction for keyboard input. It has a get() method that optionally takes a number. This allows more than one keyboard to be detected and used by Kha; a similar pattern applies for all input devices.

Once you have a Keyboard, register callbacks using notify(). The Keyboard callback uses these arguments:

    key : Key, string : String 

where "key" is the Key enum and "string" is the character value of the key.

# kha.Key

This is an Enum for the keypress type. Some frameworks monitor "held" keys like Shift, Ctrl or Alt and pass them in as flags on the keyboard event, but Kha takes the approach of sending a new event for each one. It also includes some non-character keys like the arrow keys in this enum. 

For everything else, Kha passes in string data to the Keyboard callback.

# kha.input.Mouse

As with Keyboard, Mouse.get() returns a device instance and notify() registers callbacks. The Mouse callback uses these arguments:

    button : Int, x : Int, y : Int 
    
where "button" is the button pressed and "x" and "y" are the screen coordinates.

Mouse additionally has methods for locking the cursor focus and hiding its display.