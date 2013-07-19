
# term-list

  Renders an interactive list to the terminal that users
  can navigate using the arrow keys. Developers can bind
  to "keypress" events to support removal or opening of items etc.

  ![interactive terminal list](https://dsz91cxz97a03.cloudfront.net/YNqOchbrMD-150x150.png)

## Installation

```
$ npm install term-list
```

## Example

  A fully interactive list demonstrating removal via backspace,
  and opening of the websites via the return key.

```js
var List = require('term-list');
var exec = require('child_process').exec;

var list = new List({ marker: '\033[36m› \033[0m', markerLength: 2 });
list.add('http://google.com', 'Google');
list.add('http://yahoo.com', 'Yahoo');
list.add('http://cloudup.com', 'Cloudup');
list.add('http://github.com', 'Github');
list.start();

list.on('keypress', function(key, item){
  switch (key.name) {
    case 'return':
      exec('open ' + item);
      list.stop();
      console.log('opening %s', item);
      break;
    case 'backspace':
      list.remove(list.selected);
      break;
  }
});

list.on('empty', function(){
  list.stop();
});
```

### API

  - [List()](#list)
  - [List.add()](#listaddidstringlabelstring)
  - [List.remove()](#listremoveidstring)
  - [List.at()](#listatinumber)
  - [List.select()](#listselectidstring)
  - [List.draw()](#listdraw)
  - [List.up()](#listup)
  - [List.down()](#listdown)
  - [List.stop()](#liststop)
  - [List.start()](#liststart)

### List()

  Initialize a new `List` with `opts`:
  
  - `marker` optional marker string defaulting to '› '
  - `markerLength` optional marker length, otherwise marker.length is used

### List.add(id:String, label:String)

  Add item `id` with `label`.

### List.remove(id:String)

  Remove item `id`.

### List.at(i:Number)

  Return item at `i`.

### List.select(id:String)

  Select item `id`.

### List.draw()

  Re-draw the list.

### List.up()

  Select the previous item if any.

### List.down()

  Select the next item if any.

### List.stop()

  Reset state and stop the list.

### List.start()

  Start the list.

## License

  MIT
