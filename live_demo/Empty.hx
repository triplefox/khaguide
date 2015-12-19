package;
import kha.Framebuffer;
import kha.Color;

class Empty {
	public function new() {
		
	}
	
	public function render(framebuffer: Framebuffer): Void {
		var nextcolor = [Color.Purple, Color.White, Color.White, Color.White, Color.Purple][Std.int(Math.random() * 5)];
		var g = framebuffer.g2;
		g.begin();
		g.clear(nextcolor);
		g.end();
	}
	
	public function update(): Void {
		
	}
}
