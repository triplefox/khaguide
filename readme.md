# Kha's First Game Jam

This guide is intended to give you a "real-world" introduction to problems and techniques found in game programming, as well as the Kha APIs and how to use them in games. A simple but finished 2D game is presented with its full source code at each stage of development, from the early drawing routines to the final polish.

Its intended audience is existing programmers who don't necessarily know game programming or the Haxe language, and experienced game programmers who would like to see a whole project workflow in action.

[View the Guide Online](http://htmlpreview.github.io/?https://raw.githubusercontent.com/triplefox/khaguide/master/build/book.html)

# Project Structure

* /html contains the documentation as a single html file.
* /docbook contains the DocBook source.
* /Empty contains the final source code and assets of the example game project.
* /markdown contains old draft versions of the documentation.
* /proc contains the post-processing script for node.js.

# Building the Docs

1. Install a copy of xsltproc.
2. Install the DocBook XSL stylesheets.
3. Install node.js.
4. Run b.bat. (In Windows. It may also work in sh.)
        
There is one hardlink that you will have to change: 

1. style.xsl hardlinks to the local installation of the DocBook XSL for HTML. Change the href line to match your own install.

Alternatively, you can change the href to point to:

        http://docbook.sourceforge.net/release/xsl/current/html/docbook.xsl

This will download DocBook each time you run the command, but you won't have to maintain a local installation.