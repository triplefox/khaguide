/*

    This script runs on Node v5.1.0 for Windows.
    It uses cheerio for HTML parsing and highlight.js for the highlighter.

*/

var fs = require('fs'),
    cheerio = require('cheerio'),
    hljs = require('highlight.js');

var bookpath = 'build/book.html';

hljs.configure({
    tabReplace: '    ', // 4 spaces
    classPrefix: ''     // don't append class prefix
});

fs.readFile(bookpath, function(err, data) {

    $ = cheerio.load(data, {});

    var pl = $('.programlisting').toArray();

    pl.forEach(function (v, k) {
        var rawtext = v.children[0].data;
        var result = hljs.highlight('haxe',rawtext).value;
        v.children = $.parseHTML(result);
    });

    var result = $.html();
    
    /* 
        Either DocBook or cheerio is to blame for the oddness in chapter headings.
        I fix this up with a little string replacer:
    */
    var entity = "&#xFFFD;";
    result = result.split(entity).join(" "); 

    //console.log(result);
    fs.writeFile(bookpath, result);

});