### Marching.js in Atom
[Marching.js](https://charlieroberts.github.io/marching) is a JavaScript library for compiling raymarchers that run on the GPU and experimenting with volumetric rendering / constructive solid geometry. This plugin enables it to run in Atom; no browser required.

### Running Atom-Marching
0. Install the `atom-marching` package from Atom
1. Restart atom or hit `ctrl+alt+command+l` to reload all packages.
2. To start `marching.js`, select packages > atom-marching > toggle or use the keyboard shortcut `ctrl+alt+m`
3. Create a file with a .js extension in Atom
4. Type `march( Sphere() ).render()` in your new file to test
5. Select your code, then use `ctrl+enter` to run it
6. Use `alt+enter` to run a block of code, delimited by blank lines
7. `ctrl+.` will clear the current scene
8. For examples, tutorials, and documentation, see [the online marching.js playground](https://charlieroberts.github.io/marching/playground/) (Chrome / Firefox).

### Error: webgl not supported
Try running atom from the command line as follows:
`atom --ignore-gpu-blacklist `

Code for this plugin adapted from:
* https://atom.io/packages/atom-hydra
