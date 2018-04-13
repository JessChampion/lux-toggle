# LUX TOGGLE
Demo

A utility for creating toggleable items with JavaScript. 
Inspired by bootstrap's toggle utility. Implemented in vanillaJS in a functional style.
The utility has baked in animation and accessibility support.

Set the toggle button by adding the attribute `data-lux-toggle`, with the value being the ID of the element to be toggled.  
        
The following classes will be added to the target to indicate current state.   
- open: `toggle--open`,  
- opening: `toggle--opening`,  
- closing: `toggle--closing`  

CSS will need to be coded to define the display state, as the script only modifies the elements classes.
 
Any clicks outside the toggle button or target will cause the target to close automatically.
 
Three other attributes can be optionally added to the toggle element to add extra functionality.

-   `data-lux-toggle-group` can be set with a string representing the group name.
    Whenever a toggle in a group is opened it will check if there are other siblings open in the group,
    and delay the opening animation for the current toggle to allow the closing animation for the sibling.

-   `data-lux-toggle-close` set the value to the ID of any element inside the toggle target.
     The element will function as a close button.
     
-   `data-lux-toggle-mode` configure the behaviour of the toggle around closing. Options:  
    -   **manual**:   close only when clicking toggle, by keyboard or close area. (DEFAULT)
    -   **group**:    close siblings when another in the same group is opened.
    -   **outside**:  always close on click outside
 
## Installation & Usage
### Installation
CiteThis can be installed from NPM `yarn add lux-toggle` - TODO

### Usage
include 'lux-lux-toggle.js' in your html document
`<script type=text/javascript src=../cite-this.js></script>`
or import into your package javascript 
`import toggle from 'lux-toggle';` 

Define toggles and targets in your html using the given data attributes
```
<span data-lux-toggle="myTarget"
      data-lux-toggle-close="closeButton"
      data-lux-toggle-mode="outside">
  Toggle button
</span>

<div id="myTarget">
    <span id="closeButton"></span>
    <div>toggleable contents</div>
</div>
```
## Development
### Scripts
- __install dependencies__:
`yarn`

- __development build__:
`yarn build`
or
`yarn watch`

- __run linters__:
`yarn lint`

- __build for production with minification and view bundle analyzer report__:
`yarn package`

- __push dist/demo sub folder to github pages branch__:
`yarn deploy:demo`

### Build TODO - update
#### Running locally
1. Build by running
  `yarn build` or`yarn watch`
2. Open `cite-this/dist/demo/index.html` in a browser

#### Demo build
1. Build
  `yarn package`
2. Commit changes
  `git commit -am"V X.Y.Z"`
3. Push to gh-pages branch
  `yarn deploy:demo`
4. Update version number in `package.json` and push to master

#### Production build
1. Build
  `yarn package`
2. Update version number in `package.json`
3. Commit changes
  `git commit -am"V X.Y.Z"` 
5. Deploy to npm
   `npm publish`
4. Update version number in `package.json` and push to master

### Code Style
There are linters set up to enforce code style, run with `yarn lint`.

### Tests
JavaScript unit tests are implemented with Jest
The specs are located in `/test` and can be run with `yarn test`
Test coverage can be reported by running `yarn test:coverage`

### Enhancement Backlog
- Usage documentation
- Demo
- Make config actually configurable
- Publish