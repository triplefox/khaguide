# Project Setup

## How should I get started with Kha?

There are two ways to work with Kha, the "haxelib" way and the "standalone" way. The haxelib way is familiar to existing Haxe users. The standalone way allows a project's whole environment to be maintained without accidentially losing important dependencies, and so it is less dependent on the "Haxe ecosystem".

In both cases, your workflow after installation is:

1. Run khamake to compile the assets and project metadata for a target platform(html5, windows, etc.)
2. Test and debug using additional compilers and IDEs appropriate to your target(e.g. Visual Studio, Unity editor, browser).

Robert says:

> *The haxelib version is for beginners, standalone is for pros. Using haxelib is easier (when you already use Haxe) and haxelib Kha isn't copied to the actual projects, so it takes up less space. Standalone is highly recommended when starting an actual project because you can then version Kha with your project.*
> 
> *The only actual differences are that haxelib Kha includes a copy of node.js. Standalone Kha doesn't but includes a slightly modified version of Haxe (usual Haxe calls haxelib when Java or C# targets are used to download some stuff, in Kha's Haxe that's already included).*
>
> *This arrangement is a little more complex but allows you to maintain all of the project code as a cohesive whole.*

### Haxelib

Install a copy of [Haxe](http://www.haxe.org) and run 

    haxelib install kha

at the command line, after Haxe is setup.

An "Empty" project exists in the haxelib package. Copy this to make your project, or download and unzip the [github archived copy](https://github.com/KTXSoftware/Empty/archive/master.zip). Then cd to "Empty".

**To run khamake type:**

    haxelib run kha

The remainder of this guide will alias this line as "khamake". You can add targets and options to it.

### Standalone

Standalone installation requires [git](https://git-scm.com/) and [node](https://nodejs.org/). Use this git line:

    git clone --recursive https://github.com/KTXSoftware/Empty.git

This will download lots of stuff, since it's including all of Kha. When it's done, cd into "Empty".

**To run khamake type:**

    node Kha/make

The remainder of this guide will alias this line as "khamake". You can add targets and options to it.

Alternate method, using a script that runs khamake:

**From Windows cmd type:**

    cd build
    build

**From bash type:**

    cd build
    ./build

This script brings up a prompt for target and options like this, and then runs khamake:

```
___________________________________
khamake builder
type q to quit.
___________________________________
Specify target:html5
Specify options:
```
 
# Build Options

    khamake
        -> visual studio solution (uncompiled)
            
    khamake --compile
        -> visual studio solution (run compiler after)
            
    khamake --compile --visualstudio vs2013
        -> visual studio solution (run visual studio 2013 instead of other versions)
            
    khamake flash
        -> flash swf
            
    khamake html5
        -> html/js

    For more commands:
        khamake --help

The resulting project or binary will live somewhere in the "/build" directory and when run should give you a blank screen. For more on builds:

[[Testing and Publishing the Project]]

# Converting a haxelib project to a standalone project 

If you have a project using Kha in haxelib form, without git, and want to convert, the simplest way is to clone the Empty project and copy your project files in on top.

If you have an existing git repository, you can add Kha as a submodule like this:

    git submodule add https://github.com/KTXSoftware/Kha
    git submodule update --init --recursive
    git commit -m "add Kha" 

# Updating Kha (haxelib)

    haxelib upgrade

# Updating Kha (standalone)

    git submodule foreach --recursive git pull origin master
    git commit -m "update Kha"

# Dependencies with standalone projects

In a standalone project we recommend making a copy of dependencies within the project. If you want to update from Haxelib, do so manually.

# FlashDevelop

FlashDevelop (or FD for short) is one of the most popular IDEs for Haxe on the Windows platform. Originally made for Flash and Actionscript projects, it was extended to support Haxe many years ago. Kha can generate FD project files.

1. To work with Kha and FD, visit the /build directory to notice a project file for your build target. Open this to get full IDE integration.
            
2. F5 is your "test build" button. It will run Haxe and emit new code. If you want new targets or a complete build including assets, run khamake again.

# IntelliJ

IntelliJ contains a well-maintained Haxe plugin, available from its internal plugin browser, and Kha generates project files for it. Make sure the plugin is installed. Then visit the /build directory and open the project file for your build target.

1. IntelliJ will complain about the Git repository settings, but you can safely ignore this or replace the settings with your own if you wish to fix the Git integration.

2. You must also set up the project's SDK. IntelliJ will pop up the "Project Structure" dialog and prompt you to add a correct SDK when you first try to build the project. You can add it by clicking the "New" button adjacent to "Module SDK". This will point to the appropriate Haxe compiler and will depend on whether you are in a Haxelib or standalone project:

* For Haxelib, use your preferred installation of Haxe. 
* For standalone, use "<project>/Tools/haxe".

4. Finally, in the "Project Structure" dialog, under the "Haxe" tab, make sure that the "Skip compilation" checkbox is unchecked.

5. Ctrl+F9 is your "test build" button. It will run Haxe and emit new code. If you want new targets or a complete build including assets, run khamake again.

# Getting around in Haxe

Here is a quick example to familiarize yourself:

```haxe
package; // Package namespaces are organized by directory structure, supplemented with compiler options
import Std;
import Type;

class Test { // code must be contained inside classes

    public static function main() { // typical boilerplate for a "global" function

        trace("hello world"); // debug print
        
        var i = 100; // assign Int
        var f = 3.14; // assign Float
        var s = "50"; // assign String
        
        var si = Std.parseInt(s); // Std contains everyday type conversions
        
        if (i + si == 150) { // ECMA-style optional-brace syntax
           // print "100 + 50 = 150" two ways:
           
           // with concatenation
           trace(Std.string(i) + " + " + s + " = 150");
           // with string interpolation
           trace('$i + $s = ${i+si}');
        }
        
        var iar = [1,2,3]; // array assignment
        var iar2 = new Array<Int>(); // alternate method
        var iar3 : Array<Int>; // declare without assignment
        
        // assemble [1,2,3] in iar2
        iar2.push(iar[0]); // 0-indexing
        iar2.push(2);
        iar2.push(iar[iar.length-1]);
        
        for (idx in 0...iar.length) { // counting loop
            trace(iar[idx] == iar2[idx]);
        }
        for (n in iar) { // iterator loop
            trace(iar[n - 1] == n);
        }
        { // braces define a new variable scope
            var c = 0; // this will not live outside the braces
            while(c < iar.length) c+=1;
        }
        
        if (iar3 == null) { // null checks aren't "falsy"
            iar3 = iar.concat(iar2); // concat makes a copy
            trace(iar3.length == 6);
        }
        
        // instantiate a class and call some methods
        var q = new Inserter();
        q.insert(0);
        q.insert("hello world");
        q.insert(iar);
        trace(q.numberOfInts()==1);

    }

}

/* one file can contain multiple classes; import rules will default-import classes in the same namespace with the same filename. Additional classes will be hidden until the file is explicitly imported.
*/

class Inserter {

    public var a : Array<Dynamic>; // Haxe allows you to access dynamic typing (but it is considered bad style)
    public var count = 0; // default values can also be used

    public function new() { // all instantiated classes require a new()
        a = [];
    }
    
    public function insert(v : Dynamic) {
        a.push(v);
        count += 1;
    }
    
    public function numberOfInts() : Int {
        var result = 0;
        for (n in a) {
            if (Type.typeof(n)==TInt) // runtime type detection
                result += 1;
        }
        return result;
    }

}

```

Also visit [Try Haxe](http://try.haxe.org/) for some more basic examples.