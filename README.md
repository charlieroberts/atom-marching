### Marching.js in Atom

### Running Atom-Marching
1. restart atom
2. packages > atom-marching > toggle
3. create a file ending with .js in atom
4. type `march( Sphere() ).render()`
5. ctrl-enter to run selected code
6. alt-enter to run a block of code

### Error: webgl not supported
Try running atom from the command line as follows:
`atom --ignore-gpu-blacklist `

Code for this plugin adapted from:
* https://atom.io/packages/atom-hydra
