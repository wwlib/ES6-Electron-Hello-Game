'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
    value: true
});
/**
 * Created by andrew on 4/7/15.
 */

var _Sprite = require('./sprite');

var _Sprite2 = _interopRequireWildcard(_Sprite);

var _Player = require('./player');

var _Player2 = _interopRequireWildcard(_Player);

var _Bullet = require('./bullet');

var _Bullet2 = _interopRequireWildcard(_Bullet);

var _Enemy = require('./enemy');

var _Enemy2 = _interopRequireWildcard(_Enemy);

var _BouncingObject = require('./bouncingObject');

var _BouncingObject2 = _interopRequireWildcard(_BouncingObject);

var _SoundManager = require('./soundManager');

var _SoundManager2 = _interopRequireWildcard(_SoundManager);

var _Rect = require('./rect');

var _Rect2 = _interopRequireWildcard(_Rect);

var Game = (function () {
    function Game(canvas_context, player_sprite, debris_sprite, crystal_sprite, bullet_sprite) {
        _classCallCheck(this, Game);

        this.canvasContext = canvas_context;
        this.playerSprite = player_sprite;
        this.debrisSprite = debris_sprite;
        this.crystalSprite = crystal_sprite;
        this.bulletSprite = bullet_sprite;

        this.player = new _Player2['default'](this.playerSprite, 50, 530, { x: 0, y: 0 });
        this.crystal = new _BouncingObject2['default'](this.crystalSprite, 0, 100, null, 3000, 375);
        this.enemy = new _Enemy2['default'](this.debrisSprite, 100, 0, { x: 0, y: 1 });

        this.gameBoundsRect = new _Rect2['default']({ top: 0, left: 0, width: 630, height: 580 });
        this.enemy.boundsRect = this.gameBoundsRect;

        this.crystalBoundsRect = new _Rect2['default']({ top: 100, left: 0, width: 630, height: 50 });
        this.crystal.boundsRect = this.crystalBoundsRect;

        this.activeBullets = 0;
        this.maxBullets = 20;

        this.playerBullets = [];
        this.enemies = [this.enemy];
        this.crystals = [this.crystal];

        this.lastSpawnTime = 0;
    }

    _createClass(Game, [{
        key: 'collides',

        // Collision Handling
        value: function collides(a, b) {
            return a.coords.x < b.coords.x + b.width && a.coords.x + a.width > b.coords.x && a.coords.y < b.coords.y + b.height && a.coords.y + a.height > b.coords.y;
        }
    }, {
        key: 'handleCollisions',
        value: function handleCollisions() {
            var _this = this;

            this.playerBullets.forEach(function (bullet) {
                _this.enemies.forEach(function (enemy) {
                    if (_this.collides(bullet, enemy)) {
                        enemy.die();
                        bullet.die();
                    }
                });
            });

            this.enemies.forEach(function (enemy) {
                if (_this.collides(enemy, _this.player)) {
                    enemy.die();
                    _this.player.die();
                }
            });

            this.playerBullets.forEach(function (bullet) {
                _this.crystals.forEach(function (crystal) {
                    if (_this.collides(bullet, crystal)) {
                        crystal.die();
                        bullet.die();
                    }
                });
            });
        }
    }, {
        key: 'removeDeadObjects',
        value: function removeDeadObjects() {
            var bullets = [];
            var enemies = [];
            var crystals = [];

            this.playerBullets.forEach(function (bullet) {
                if (bullet.alive) {
                    bullets.push(bullet);
                }
            });

            this.playerBullets = bullets;

            this.enemies.forEach(function (enemy) {
                if (enemy.alive) {
                    enemies.push(enemy);
                }
            });

            this.enemies = enemies;

            this.crystals.forEach(function (crystal) {
                if (crystal.alive) {
                    crystals.push(crystal);
                }
            });

            this.crystals = crystals;
        }
    }, {
        key: 'update',
        value: function update(timestamp) {

            if (this.player.alive) {
                this.player.update(timestamp);
            }

            this.enemies.forEach(function (enemy) {
                enemy.update(timestamp);
            });

            this.crystals.forEach(function (crystal) {
                crystal.update(timestamp);
            });

            this.playerBullets.forEach(function (bullet) {
                bullet.update(timestamp);
            });

            this.handleCollisions();
            this.removeDeadObjects();
            this.spawnEnemy(timestamp);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            if (this.player.alive) {
                this.player.draw(this.canvasContext);
            }

            this.enemies.forEach(function (enemy) {
                enemy.draw(_this2.canvasContext);
            });

            this.crystals.forEach(function (crystal) {
                crystal.draw(_this2.canvasContext);
            });

            this.playerBullets.forEach(function (bullet) {
                bullet.draw(_this2.canvasContext);
            });
        }
    }, {
        key: 'warp',
        value: function warp() {
            this.player.moveTo(this.gameBoundsRect.right - 25, this.gameBoundsRect.bottom - 50);
        }
    }, {
        key: 'right',
        value: function right() {
            this.player.velocity = { x: 5, y: 0 };
        }
    }, {
        key: 'left',
        value: function left() {
            this.player.velocity = { x: -5, y: 0 };
        }
    }, {
        key: 'shoot',
        value: function shoot() {
            _SoundManager2['default'].playSoundWithIdAndTime('shoot', 0);

            if (this.player.alive) {
                var bulletPosition = this.player.midpoint;
                var bullet = new _Bullet2['default'](this.bulletSprite, bulletPosition.x, bulletPosition.y, { x: 0, y: -10 });
                bullet.boundsRect = this.gameBoundsRect;

                this.playerBullets.push(bullet);
            }
        }
    }, {
        key: 'spawnEnemy',
        value: function spawnEnemy(timestamp) {
            if (timestamp - this.lastSpawnTime > 2000) {
                this.lastSpawnTime = timestamp;

                var enemy = new _Enemy2['default'](this.debrisSprite, 10, 10, { x: 0, y: 1 });
                enemy.boundsRect = this.gameBoundsRect;
                enemy.randomizeCoords();
                this.enemies.push(enemy);
            }
        }
    }]);

    return Game;
})();

exports['default'] = Game;
module.exports = exports['default'];
//# sourceMappingURL=../game/game.js.map