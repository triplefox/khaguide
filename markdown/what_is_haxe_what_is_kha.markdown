# What is Haxe?

Haxe is an ECMAScript-like source code language. It compiles to many different source and binary targets, including C++, PHP, Flash SWF, JS... It eases portability difficulties by providing a single source language, with low-level access to the idioms of each target platform.

# What is Kha?

Kha is a low-level framework that builds on the Haxe compiler technology. Like Haxe itself, it abstracts the details of different platforms to ease portability concerns. Kha builds on Haxe to offer a framework suitable for real-time multimedia applications, particularly games.

# I don't understand what that means?

Write code in Haxe. The Kha build process produces an appropriate build for the target platform.

Then work with the toolchain of the target platform to debug it.

# What is the benefit?

Haxe is designed for high compatibility. It is a easy language to get started with if you are familiar with popular scripting languages like Javascript, Lua, Python, or Ruby. It has many features that those languages do not have, and a fast, powerful compiler that will catch many errors for you and perform optimizations that would be out of reach otherwise.

Haxe is also excellent at allowing you to defer final technology choices until later. The same codebase can compile to many different targets, and also many different APIs. If you discover, for example, that Kha does not work out, you have many options to migrate the code to a different API - either native APIs or another framework. You will not have to rewrite the entire codebase in another language.

Lastly, by working in Haxe you will learn techniques for writing reliable, highly portable code - not just in Haxe, but in all the environments Haxe targets. The Haxe ecosystem is designed around making sure all targets have a viable solution. You gain the possibility of using the debugging tools of more than one target, which improves your chances of quickly resolving a difficult bug.

Many Haxe users claim higher overall productivity with Haxe than in other environments.

# What weaknesses does Haxe have?

Although Haxe is mostly familiar for a former Actionscript or Javascript programmer, some aspects may be new and challenging. The compiler's type inference engine will catch many of your minor mistakes quickly, but typing time is higher. Haxe style encourages full use of static types, and many of the tricks based on dynamic typing that are used in, for example, Ruby, are poor style in Haxe because they do not leverage the type system efficiently. There are plenty of new static-typed tricks to learn instead :)

You will also encounter more friction within the toolchain because it is not exactly designed around the native tools of the target environment. Debugging problems buried in the toolchain may require domain knowledge that "bridges the gap" from the framework into the target. Because crossplatform frameworks have multiple implementations of their APIs, behaviors may change slightly across targets, leading to "write once debug everywhere". Good frameworks like Kha will also get out of the way and ease the process of writing things in a cross-platform way.

Haxe expects a garbage-collected environment, and builds itself on a relatively high-level runtime. This limits its utility for the most demanding games that need low-level control over memory allocation behaviors. In the average case, garbage collection problems can be overcome by eliminating spurious allocations and reusing more data, through, for example, object pooling. Memory allocation only becomes a serious concern as your project becomes more likely to allocate memory. Simpler scenes and simulations will make garbage collections both smaller and less frequent, limiting any potential impact on framerates.

## Why is Kha special?

    Kha aims for a new standard of crossplatform games technology, with a graphics and sound API that can successfully span many different environments and accommodate major variations in features exposed.

# Kha versus OpenFL and Unity3D

## Is Kha related to OpenFL or NME? Will one give me better performance? Will I be locked in?

OpenFL is another project that uses the Haxe technology to create a cross-platform framework. The goals of the projects are different: 

* OpenFL is best for programmers who wish to continue to work with the Flash APIs, and primarily in 2D. It aims to provide a Flash-like experience everywhere, but also provides certain low-level features that are not native to Flash.
* NME is a variant on OpenFL that has at various times been the same project, sharing similar goals. It presently aims to be a purely "native platform" target, supporting more low-level access.
* Kha is a purely low-level cross-platform framework, and supports 2D and 3D. It provides fewer and simpler APIs, but has strong provisions for graphics rendering, including fonts and shaders.

The featuresets of each of these frameworks overlap, but all are capable of decent to great performance, depending on what you do and how you do it. Because they use the same language, you will also enjoy a less costly migration if you discover you need to switch frameworks.

## Is Kha better than Unity3D?

Many core capabilities are already available in Kha, but Unity is much more fleshed out and tested as a game engine. The difference is in whether you are aiming to implement "engine bits" like collision detection and physics, or if you can use an off-the-shelf solution effectively.

If you want to mix Kha and Unity, or Haxe and Unity, that is also an option: Kha has a Unity3D export target, and there are several bindings to Unity APIs from Haxe, ensuring that your codebase can be migrated if necessary.