
var List = require('./');
var exec = require('child_process').exec;

var list = new List({ marker: '\033[36m› \033[0m', markerLength: 2 });
list.add('http://google.com', 'Google');
list.add('http://yahoo.com', 'Yahoo');
list.add('http://cloudup.com', 'Cloudup');
list.add('http://github.com', 'Github');
list.start();

setTimeout(function(){
  list.add('http://cuteoverload.com', 'Cute Overload');
  list.draw();
}, 2000);

setTimeout(function(){
  list.add('http://uglyoverload.com', 'Ugly Overload');
  list.draw();
}, 4000);

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
    case 'c':
      if (key.ctrl) {
        list.stop();
        process.exit();
      }
      break;
  }
});

list.on('empty', function(){
  list.stop();
});