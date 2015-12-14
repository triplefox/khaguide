# Contributor's guide

The goal of this guide is provide a narrative of game development, as a way of familiarizing readers with Kha and also with broader processes involved in game development.

To do this, the guide provides complete code examples, allowing the reader to bring them into a "real" environment as soon as possible by copy-pasting example code. The API is introduced gradually and naturally, in the way it would appear in a real project.

The guide opts, where reasonable, to be brave. It presents genuine challenges that put the framework to the test, rather than small synthetic examples.

The guide's format is [Github-flavored Markdown](https://help.github.com/articles/github-flavored-markdown/). (Should the needs of the guide change, format conversion may be considered in the future.)

External editors are recommended to ease the pain of syntax and organization. @Triplefox uses a mix of [Twine 2](http://twinery.org/) (hypertext design) and [MdCharm](http://www.mdcharm.com/) (body text formatting).

## Common Technical Writing Practices

* Lead with the "what" and "why" of each item: What is this, and why do I need it?
  * Follow up with the "when" and "where": in which situation is it needed?
* Do not use "should", "may", "can", or "when" to describe a task.
  * Prefer "shall", "must", "will" or "shall not", "must not", "will not".
* Break tasks into 7 steps, plus or minus two. 
  *   If more steps are required, use subheadings and group the steps into logical categories.

## Terms

"haxelib" vs "standalone" builds of Kha projects. The former use the version of Kha currently updated on Haxelib. The latter use Kha as a Git submodule.

## Style

Quotes and asides are written using blockquote syntax:

According to Plato,
> *The beginning is the most important part of the work.*

Source should be kept inline with the document where possible, using the appropriate syntax highlighting hint:

```haxe

class HelloWorld {
    public function new() {
        trace("hello world");
    }
}

```

