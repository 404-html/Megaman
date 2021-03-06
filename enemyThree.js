// ====
// ENEMYONE
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function enemyThree(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    


    // Default sprite and scale, if not otherwise specified
    this.sprite = g_sprites.CharL[0];
    this.scale  = 4;

};

enemyThree.prototype = new Entity();

enemyThree.prototype.cx = 700;
enemyThree.prototype.cy = 502;
enemyThree.prototype.velX = -3.5;
enemyThree.prototype.velY = 0;
enemyThree.prototype.health = 10;
enemyThree.prototype.shootTimer = 150;

enemyThree.prototype.update = function (du) {

    spatialManager.unregister(this);

    if (this._isDeadNow && this.health === 0) return entityManager.KILL_ME_NOW; 
    if (this._isDeadNow) {
        this._isDeadNow = false;
        this.health--;
    }

    if (this.shootTimer > 75 || this.shootTimer === 0) {
        this.movement(du);
        var spriteNumber = animationHandle.cycle(1,2,3);
        if (this.velX < 0) {this.sprite = g_sprites.CharL[spriteNumber];}
        else {this.sprite = g_sprites.CharR[spriteNumber];}
    } else {
        this.sprite = g_sprites.CharL[4];
    }

    this.maybeShoot();

    var maybeChar = this.findHitEntity();
    if (maybeChar === entityManager._char[0]) {
        entityManager._char[0].kill();
    }

    spatialManager.register(this);
};

enemyThree.prototype.movement = function(du) {
    if (this.cx < 30) {this.velX = 3.5;}
    if (this.cx > 970) {this.velX = -3.5;}

    this.cx += this.velX *du;

    if (this.cy < 502) {
        this.velY += 1;
    } else {
        this.velY = 0;
        this.cy = 502;
    }

    if (this.cy >= 502 && this.shootTimer <= 0) {
        this.velY = -20;
        this.shootTimer = 150;
    }

    this.cy += this.velY * du;
};

enemyThree.prototype.maybeShoot = function () {
    if (this.shootTimer) {
        if (this.shootTimer == 75) {
            entityManager.fireRocket(
                this.cx+this.velX*16,
                this.cy-10,
                this.velX*2, 0, 0
            );
        }
    this.shootTimer--;
    }
};


enemyThree.prototype.getRadius = function () {
    return this.scale * (this.sprite.width / 2) * 0.9;
};

enemyThree.prototype.takeBulletHit = function() {
    this.kill();
};


enemyThree.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
    this.sprite.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
