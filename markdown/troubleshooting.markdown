# I got an error, but who should I ask about it?

* If you encounter *language or code generation errors*, it is probably a Haxe issue.
    
* If you encounter *API, asset import, or build problems*, it is probably a Kha issue.


    TODO(how to contact people)

# Debugging Performance Issues

If you are testing in the browser, make sure it's a clean environment. In Firefox 42.0, for example, old open tabs will share garbage collection pauses with your game.

Make sure you are using appropriate timing mechanisms. Most simulation code runs best as a Scheduler TimeTask. You can divide up the simulation into multiple tasks running on different intervals if necessary; the framework will do its best to run your tasks in the correct order given the intervals and priorities you set. If the hotspot code is related to rendering, then it should probably be a FrameTask.

# Build and Asset Problems

Make sure there aren't file locking issues. Disable any automatic sync programs, reopen the project if it's been regerated, close and reopen editors and command consoles, reboot if you're feeling particularly paranoid.

Make sure you've tried to load your assets before using them - if you aren't using loadEverything(), make sure you've loaded the *right* assets.

Make sure you're applying the correct type. For example, if you used --addallassets to add music, you would still have to change the type from sound to music, since it would default to sound.

# HTML5 Builds

When targeting the Web, security and networking considerations come into play as part of loading your game. In many cases you can point your browser at the generated index.html to run the game.

You can also force your Khabuild process to run a server with the --server parameter. It defaults to [http://localhost:8080](http://localhost:8080).

