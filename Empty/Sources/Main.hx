package;

import kha.Scheduler;
import kha.System;

class Main {
	
	public static function main() {
		System.init({
            title : "Empty", 
            width : 320, 
            height : 240
        },
        initialized);
	}
	
	private static function initialized(): Void {
		var game = new Empty();
		System.notifyOnRender(game.render);
		Scheduler.addTimeTask(game.update, 0, 1 / 60);
	}
}
