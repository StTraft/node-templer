## Intention

As a developer, it is not uncommon to copy and paste skeleton boilerplate across projects. Some IDEs provide nice and handly skeleton (e.g.: xcode).
However there seems no such thing in the world of javascript. Hence I decide to make a tiny tools for project based templating.

## Install

```
npm install node-templer
```

## Example

Let's say in a [React](https://reactjs.org/) project with the app structure like this:
```
src /
  components /
    MyButton /
      index.js
      test.js
      style.css
    MyCard /
      index.js
      test.js
      style.css
// ...
```

At project root, run:
```
bash $ node-templer init
```
or
```
bash $ npx node-templer init
```

This will create a `.temp` folder in the project root for storing templates.

After that, create a folder in `.temp` named with the type of template you want to create and add files with extension `temp` in it.
For example:
```
.temp /
  components /
    index.js.temp
    style.css.temp
    test.js.temp
```
In those `.temp` files, edit your own skeleton:

#### index.js.temp
```
// .temp/components/index.js.temp

import React from 'react'
import './style.css'

export default class %%name%% extends React.Component {
  render() {
    return (
      <div className="%%classname%%">
        This is %%name%% component
      </div>
    )
  }
}

```
#### style.css.temp
```
// .temp/components/style.css.temp

.%%classname%% {
  // component style goes here
}

```

#### test.js.temp
```
// .temp/components/test/js/temp

import React from 'react'
import { shallow } from 'enzyme'
import %%name%% from './index'

describe('Component: %%name%%', () => {
  it('renders without crashes', () => {
    shallow(<%%name%% />)
  })
})

```

If we want to add a `MyForm` component, just run:
```
bash $ node-templer create components Form classname=custom_form
```
and it will generate files:

#### index.js
```
// src/components/MyForm/index.js

import React from 'react'
import './style.css'

export default class MyForm extends React.Component {
  render() {
    return (
      <div className="custom_form">
        This is MyForm component
      </div>
    )
  }
}

```

#### style.css
```
// src/components/MyForm/style.css

.custom_form {
  // component style goes here
}

```

#### test.js
```
// src/components/MyForm/test.js

import React from 'react'
import { shallow } from 'enzyme'
import MyForm from './index'

describe('Component: MyForm', () => {
  it('renders without crashes', () => {
    shallow(<MyForm />)
  })
})

```

## Usage
```
node-templer <command>

Commands:
  node-templer init                         Initialize templer to the project.
  node-templer create <temp> <name>         Create templates defined in .temp
  [vars..]                                  folders.

Options:
  --version       Show version number                                  [boolean]
  -r, --root      Set base folder of templates to be created.   [default: "src"]
  -e, --encoding  Set file encoding.                           [default: "utf8"]
  --help          Show help                                            [boolean]
```
For the command `node-templer create` will create nested folder `<temp>/<name>` in the `root` folder (default: `src`).
You can still define `name=something` in `[vars]`, it will *not* affacting the name of the folder but the variable `%%name%%` in your template files.
For example, in the above case, if we use command

`node-templer create components MyForm classname=custom_form name=OtherName`,

it will create files in path `src/components/MyForm`, while in the context of the files, `%%name%%` will be replaced by `OtherName` instead of `MyForm`.


