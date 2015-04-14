'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
    value: true
});
/**
 * Created by andrew on 4/7/15.
 */

var _MovingObject2 = require('./movingObject');

var _MovingObject3 = _interopRequireWildcard(_MovingObject2);

var _SoundManager = require('./soundManager');

var _SoundManager2 = _interopRequireWildcard(_SoundManager);

var Enemy = (function (_MovingObject) {
    function Enemy(sprite, x, y, velocity) {
        _classCallCheck(this, Enemy);

        _get(Object.getPrototypeOf(Enemy.prototype), 'constructor', this).call(this, sprite, x, y, velocity);
        this.friction = { x: 0, y: 0 };
    }

    _inherits(Enemy, _MovingObject);

    _createClass(Enemy, [{
        key: 'update',
        value: function update() {
            _get(Object.getPrototypeOf(Enemy.prototype), 'update', this).call(this);
            if (!this.inBounds) {
                this.die();
            }
        }
    }, {
        key: 'die',
        value: function die() {
            _SoundManager2['default'].playSoundWithIdAndTime('explosion', 0);
            _get(Object.getPrototypeOf(Enemy.prototype), 'die', this).call(this);
        }
    }]);

    return Enemy;
})(_MovingObject3['default']);

exports['default'] = Enemy;
module.exports = exports['default'];
//# sourceMappingURL=../game/enemy.js.map