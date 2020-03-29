// @ts-check
/// <reference path="../types/phaser/phaser.d.ts" />

import 'https://unpkg.com/phaser@3.22.0/dist/phaser.min.js';

import * as maths from './maths.js';

const debug = document.location.search.indexOf('debug') > -1;

// 360-element array of amazing colours
const hsv = Phaser.Display.Color.HSVColorWheel();

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    useTicker: true, // is this needed? IDFK
    physics: {
        default: 'arcade',
        arcade: {
            debug,
            gravity: { y: 400 }
        }
    },
    scene: {
        preload: preload,
        create: create, 
        update: update
    }
});

/** @type {Phaser.GameObjects.Image} */
let thinger;
/** @type {number} */
let thinger_speed;

/**
 * @type {Phaser.Types.Scenes.ScenePreloadCallback}
 * @this {Phaser.Scene}
 */
function preload ()
{
    this.load.setBaseURL('/');

    this.load.image('sky', 'assets/space3.png');
    this.load.image('thing', 'assets/budbrain_chick.png');
    this.load.image('red', 'assets/ghost.png');
    this.load.image('block', 'http://labs.phaser.io/assets/sprites/block.png');

    this.load.audio('bounce', 'http://labs.phaser.io/assets/audio/SoundEffects/battery.wav');
}

/**
 * @type {Phaser.Types.Scenes.SceneCreateCallback}
 * @this {Phaser.Scene}
 */
function create ()
{
    var sky_image = this.add.image(400, 300, 'sky');

    const logo = this.physics.add.image(400, 100, 'thing');
    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    const particles = this.add.particles('red');
    const emitter = particles.createEmitter({
        speed: 200,
        scale: { start: 0, end: 1 },
        alpha: { start: 1, end: 0 },
        tint: { start: 0x0000aa, end: 0xffffff }, // how to blend colours?
        lifespan: 2000, // yo what
        frequency: 75, // YES
        radial: true, // default
        blendMode: 'ADD',
        follow: logo
    });

    const text = this.add.text(100, 100, 'THE BEST GAME EVER?', { fontSize: '50px' }); // Need source on this
    text.setFontFamily('"Comic Sans MS"');

    var bounce = this.sound.add('bounce');

    var block = this.physics.add.image(400, 100, 'block')
        .setVelocity(0,0)
        .setBounce(1, 1)
        .setCollideWorldBounds(true);
    this.physics.add.collider(logo, block, function() {
        //bounce.play() // Boing!
    });
    
    this.input.setDraggable(block.setInteractive());
    this.input.on('dragstart', function (pointer, obj)
    {
        obj.body.moves = false; // Seems to stop collision working properly
        //obj.body.setVelocity(0,0);
    });

    this.input.on('drag', function (pointer, obj, dragX, dragY)
    {
        obj.setPosition(dragX, dragY);
        //obj.body.setVelocity(0,0);
        //obj.body.velocity = pointer.velocity
    });

    this.input.on('dragend', function (pointer, obj)
    {
        obj.body.moves = true;
        //obj.body.velocity = pointer.velocity
        
    });

    thinger = this.add.image(0, 76, 'thing').setOrigin(0);

    thinger_speed = Phaser.Math.GetSpeed(600, 6);

    sky_image.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);

    // I think this will tint the sky when you click the mouse? 
    this.input.on('pointerdown', function (pointer) {
        var a = Phaser.Math.Between(0, 359);
        var b = Phaser.Math.Between(0, 359);
        var c = Phaser.Math.Between(0, 359);
        var d = Phaser.Math.Between(0, 359);

        sky_image.setTint(
            hsv[a].color, 
            hsv[b].color, 
            hsv[c].color, 
            hsv[d].color
        );
    });

    var shader = this.add.shader('Stripes', 400, 300, 800, 600).setVisible(false);

    shader.setUniform('size.value', 0.0);

    var mask = shader.createBitmapMask();
    sky_image.setMask(mask)

    this.tweens.add({
        targets: shader.uniforms.size,
        value: 32,
        duration: 6000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    })
}

/**
 * @param {number} time
 * @param {number} delta
 * @this {Phaser.Scene}
 */
function update(time, delta)
{
    // probably makes the chicken thinger move across the window in a loop?
    thinger.x += thinger_speed * delta;

    if (thinger.x > window.innerWidth)
    {
        thinger.x = -thinger.w;
    }
}
