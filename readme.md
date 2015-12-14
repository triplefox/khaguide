# Kha's First Game Jam

This guide is intended to give you a "real-world" introduction to problems and techniques found in game programming, as well as the Kha APIs and how to use them in games. A simple but finished 2D game is presented with its full source code at each stage of development, from the early drawing routines to the final polish.

Its intended audience is existing programmers who don't necessarily know game programming or the Haxe language, and experienced game programmers who would like to see a whole project workflow in action.

# Project Structure

* /html contains the documentation as a single html file.
* /docbook contains the DocBook source.
* /Empty contains the final source code and assets of the example game project.
* /markdown contains old draft versions of the documentation.


# Building the Docs

1. Install a copy of xsltproc.
2. Install the DocBook XSL stylesheets
3. Run this command from the project root:
    
        xsltproc -o build/book.html <docbookpath>/html/docbook.xsl docbook/book.xml 
        
Or if you don't want to install DocBook:

        xsltproc -o build/book.html http://docbook.sourceforge.net/release/xsl/current/html/docbook.xsl docbook/book.xml

