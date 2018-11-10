# LUX TOGGLE
Demo: https://jesschampion.github.io/lux-toggle/

A utility for creating toggleable dom elements with JavaScript. 
Inspired by bootstrap's toggle utility but without the overhead. Implemented in vanillaJS in a functional style.
The utility has baked in animation and accessibility support/

Set the toggle button by adding the attribute `data-lux-toggle`, with the value being the ID of the element to be toggled.  
        
The following classes will be added to the target to indicate current state.   
- open: `toggle--open`,  
- opening: `toggle--opening`,  
- closing: `toggle--closing`  

CSS will need to be coded to define the display state, as the script only modifies the elements classes.
 
Any clicks outside the toggle button or target will cause the target to close automatically.
 
Three other optional attributes can be added to the toggle element to customise its behaviour.

-   `data-lux-toggle-group` can be set with a string representing the group name.
    Whenever a toggle in a group is opened it will check if there are other siblings open in the group,
    and delay the opening animation for the current toggle to allow the closing animation for the sibling.

-   `data-lux-toggle-close` set the value to the ID of any element inside the toggle target.
     The element will function as a close button.
     
-   `data-lux-toggle-mode` configure the closing behaviour of the toggle section. Options:  
    -   **manual**:   close only when clicking toggle, by keyboard or close area. (DEFAULT)
    -   **group**:    close siblings when another in the same group is opened.
    -   **outside**:  always close on click outside

Accessibility support includes:
    -   Keyboard navigation
    -   Automatic application of aria-expanded and aria-controls tags to target and toggles.
 
## Installation & Usage
### Installation
lux-toggle can be installed from NPM `yarn add lux-toggle`

### Usage
Import into your main javascript package
 
```
import luxToggle from 'lux-toggle';
   
luxToggle();
``` 

Define toggles and targets in html using the given data attributes

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

- __push dist/demo sub folder to github pages branch__:
`yarn deploy:demo`

### Build TODO - update
#### Running locally
1. Build by running
  `yarn build` or`yarn watch`
2. Open `lux-toggle/dist/demo/index.html` in a browser

#### Demo build
1. Build
  `yarn build`
2. Commit changes
  `git commit -am"V X.Y.Z"`
3. Push to gh-pages branch
  `yarn deploy-demo`
4. Update version number in `package.json` and push to master

#### Production build
1. Build `yarn build`
2. Update version number in `package.json`
3. Commit changes
  `git commit -am"V X.Y.Z"` 
4. Deploy to npm
   `npm publish`

### Code Style
There are linters set up to enforce code style, run with `yarn lint`.

### Tests
JavaScript unit tests are implemented with Jest
The specs are located in `/test` and can be run with `yarn test`
Test coverage can be reported by running `yarn test:coverage`

### Enhancement Backlog
- Automatically add tab-index to toggle if needed.
- Make config actually configurable 
