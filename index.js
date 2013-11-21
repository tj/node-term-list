
/**
 * Module dependencies.
 */

var Emitter = require('events').EventEmitter;
var Canvas = require('term-canvas');
var canvas = new Canvas(100, 200);
var ctx = canvas.getContext('2d');

/**
 * Stdin.
 */

var stdin = process.stdin;
require('keypress')(stdin);

/**
 * Expose `List`.
 */

module.exports = List;

/**
 * Initialize a new `List` with `opts`:
 *
 * - `marker` optional marker string defaulting to '› '
 * - `markerLength` optional marker length, otherwise marker.length is used
 *
 * @param {Object} opts
 * @api public
 */

function List(opts) {
  opts = opts || {};
  this.items = [];
  this.map = {};
  this.marker = opts.marker || '› ';
  this.markerLength = opts.markerLength || this.marker.length;
  this.onkeypress = this.onkeypress.bind(this);
}

/**
 * Inherit from `Emitter.prototype`.
 */

List.prototype.__proto__ = Emitter.prototype;

/**
 * Handle keypress.
 */

List.prototype.onkeypress = function(ch, key){
  if (!key) return;

  this.emit('keypress', key, this.selected);
  switch (key.name) {
    case 'k':
    case 'up':
      this.up();
      break;
    case 'j':
    case 'down':
      this.down();
      break;
    case 'c':
      key.ctrl && this.stop();
      break;
  }
};

/**
 * Add item `id` with `label`.
 *
 * @param {String} id
 * @param {String} label
 * @api public
 */

List.prototype.add = function(id, label){
  if (!this.selected) this.select(id);
  this.items.push({ id: id, label: label });
};

/**
 * Remove item `id`.
 *
 * @param {String} id
 * @api public
 */

List.prototype.remove = function(id){
  this.emit('remove', id);
  var i = this.items.map(prop('id')).indexOf(id);
  this.items.splice(i, 1);
  if (!this.items.length) this.emit('empty');
  var item = this.at(i) || this.at(i - 1);
  if (item) this.select(item.id);
  else this.draw();
};

/**
 * Return item at `i`.
 *
 * @param {Number} i
 * @return {Object}
 * @api public
 */

List.prototype.at = function(i){
  return this.items[i];
};

/**
 * Get item by `id`.
 *
 * @param {String} id
 * @return {Object}
 * @api public
 */

List.prototype.get = function(id){
  var i = this.items.map(prop('id')).indexOf(id);
  return this.at(i);
};

/**
 * Select item `id`.
 *
 * @param {String} id
 * @api public
 */

List.prototype.select = function(id){
  this.emit('select', id);
  this.selected = id;
  this.draw();
};

/**
 * Re-draw the list.
 *
 * @api public
 */

List.prototype.draw = function(){
  var self = this;
  var y = 0;
  ctx.clear();
  ctx.save();
  ctx.translate(3, 3);
  this.items.forEach(function(item){
    if (self.selected == item.id) {
      ctx.fillText(self.marker + item.label, 0, y++);
    } else {
      var pad = Array(self.markerLength + 1).join(' ');
      ctx.fillText(pad + item.label, 0, y++);
    }
  });
  ctx.write('\n\n');
  ctx.restore();
};

/**
 * Select the previous item if any.
 *
 * @api public
 */

List.prototype.up = function(){
  var ids = this.items.map(prop('id'));
  var i = ids.indexOf(this.selected) - 1;
  var item = this.items[i];
  if (!item) return;
  this.select(item.id);
};

/**
 * Select the next item if any.
 *
 * @api public
 */

List.prototype.down = function(){
  var ids = this.items.map(prop('id'));
  var i = ids.indexOf(this.selected) + 1;
  var item = this.items[i];
  if (!item) return;
  this.select(item.id);
};

/**
 * Reset state and stop the list.
 *
 * @api public
 */

List.prototype.stop = function(){
  ctx.reset();
  process.stdin.pause();
  stdin.removeListener('keypress', this.onkeypress);
};

/**
 * Start the list.
 *
 * @api public
 */

List.prototype.start = function(){
  stdin.on('keypress', this.onkeypress);
  this.draw();
  ctx.hideCursor();
  stdin.setRawMode(true);
  stdin.resume();
};

/**
 * Prop helper.
 */

function prop(name) {
  return function(obj){
    return obj[name];
  }
}
