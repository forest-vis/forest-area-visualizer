import * as p5 from 'p5';

import Stats from 'three/examples/jsm/libs/stats.module'

const stats = Stats()
// document.body.appendChild(stats.dom)
stats.dom.style.cssText = 'position:absolute;top:0px;left:0px;';
const SIZE = 4096;

let objs = [];
let noiseScale = 0.002;
let noiseMasterScale = 1.0;
let lifeScale = 1.0;
let time = 0;
let maskImg;
let dataImg;
let duration = 60.0;
let indexCount = 0;
let isStart = false;
let isLoaded = false;

const DATA_LEVEL = 20.0;

const getMask = (x, y) => {
  const index = Math.floor(y) * SIZE + Math.floor(x);
  return maskImg.pixels[index * 4];
}

const getData = (x, y) => {
  // if (x < 0 || y < 0) return 0;
  const index = Math.floor(y) * SIZE + Math.floor(x);
  // console.log(index * 4, dataImg.pixels.length)
  if (index < 0) return 0;
  if (index * 4 >= dataImg.pixels.length) return 0;
  return Math.round(dataImg.pixels[index * 4] / DATA_LEVEL);
}

const packFloat = v => {
  let v1 = v * 255;
  let r = Math.floor(v1);
  let v2 = (v1 - r) * 255;
  let g = Math.floor(v2);
  let v3 = (v2 - g) * 255;
  let b = Math.floor(v3);
  return { r, g, b }
}


const loadImages = countryName => {
  maskImg = app.loadImage('Assets/data/' + countryName + '_mask.png', img => {
    maskImg.resize(SIZE, SIZE);;
    maskImg.loadPixels();
  });

  dataImg = app.loadImage('Assets/data/' + countryName + '_data_ajs.png', img => {
    dataImg.resize(SIZE, SIZE);
    dataImg.loadPixels();
    isLoaded = true;
  });
}


function initP(p) {

  const getRandomMaskedPoint = () => {
    let x = 0;
    let y = 0;
    let count = 0;
    while (getMask(x, y) == 0.0 && count <= 100) {
      count += 1;
      x = p.random() * p.width;
      y = p.random() * p.height;
    }
    return { x, y }
  }

  p.setup = () => {
    // console.log("setup", p.windowWidth);

    p.createCanvas(SIZE, SIZE);
    p.noStroke();
    p.frameRate(30);

    p.background("#00000000");

    console.log("init comp");

  }

  p.draw = () => {

    if (isStart == false) return;
    if (isLoaded == false) return;

    time += p.deltaTime * 0.001;

    if (maskImg.width == 1) return;

    stats.update();

    // if (time > duration) return;

    noiseMasterScale = 1.0;
    lifeScale = 2.0;

    // for (let i = 0; i < 50; i++) {
    for (let i = 0; i < 6; i++) {
      indexCount += 1;
      if (indexCount >= SIZE) indexCount = 0;
      let randomPoint = getRandomMaskedPoint();
      objs.push(new LineDrawer(randomPoint.x, randomPoint.y, indexCount));
    }

    for (let i = 0; i < objs.length; i++) {
      objs[i].move();
      objs[i].display();
    }

    for (let j = objs.length - 1; j >= 0; j--) {
      if (objs[j].isFinished()) {
        objs.splice(j, 1);
      }
    }
  }
};

let app;
const init = element => {
  app = new p5(initP, element)
}

class LineDrawer {

  constructor(ox, oy, index) {
    this.init(ox, oy, index);
  }

  init(ox, oy, index) {
    this.index = index;
    this.vel = app.createVector(0, 0);
    this.pos = app.createVector(ox, oy);
    this.initPos = app.createVector(ox, oy);
    this.noiseScale = noiseScale * 2.0 * noiseMasterScale
    this.t = app.random(0, noiseScale * noiseMasterScale);
    this.lifeMax = app.random(150 * lifeScale, 180 * lifeScale);
    this.life = this.lifeMax;

    this.lifeMax2 = 30.0;
    this.life2 = this.lifeMax2;

    this.step = .5;//app.random(0.5, 0.5);
    this.dMax = app.random(10) >= 1 ? 2 : 8;
    // this.dMax *= 10.0;
    // this.dMax = app.random(10) >= 1 ? 1 : 4;
    this.d = this.dMax;

    this.initialDraw = true;
    this.data = getData(ox, oy);

    if (this.data == 0) {
      this.c = app.color(21, 90, 0);
      this.lifeMax *= 0.3;
      this.life *= 0.3;
    } else {
      this.c = app.color(
        255,
        app.map(this.data, 0, DATA_LEVEL / 8, 100, 0),
        0,
        255.0// (app.random() * .3 + 0.7) * 255
      );
    }


  }

  move() {
    let theta = app.map(
      app.noise(this.pos.x * this.noiseScale, this.pos.y * this.noiseScale, this.t + time * 0.005),
      0,
      1,
      -6.28,
      6.28
    );
    this.vel.x = app.cos(theta);
    this.vel.y = app.sin(theta);

    this.vel = p5.Vector.normalize(this.vel)
    this.pos.add(this.vel);
  }

  isFinished() {
    if (this.life < 0) {
      return true;
    } else {
      return false;
    }
  }

  display() {

    this.life -= this.step;
    if (this.life2 > 0.0) this.life2 -= this.step;

    this.d = app.map(
      this.life,
      0,
      this.lifeMax,
      0,
      this.dMax
    );

    const data = getData(this.pos.x, this.pos.y);

    if (this.life2 <= 0) {
      if (this.data > 0 && data == 0) this.life = 0;
      if (Math.abs(this.data - data) > 6) this.life = 0;
      if (getMask(this.pos.x, this.pos.y) == 0) {
        this.life = 0
        return;
      }
    }


    app.fill(this.c);
    app.noStroke();

    if (this.c.levels[0] < 100.0) {
      app.circle(this.pos.x, this.pos.y, this.d * 0.6);
    } else {
      app.circle(this.pos.x, this.pos.y, this.d * 0.5);
    }

    if (this.data > 1600 && this.initialDraw) {
      this.initialDraw = false;
      app.noFill();
      app.stroke(this.c);
    }


    if (this.life <= 1) {
      app.noStroke();
      app.fill(0, 0, 0, 255);
      app.rect(this.index, SIZE - 3, 1, 3);
    } else {
      app.noStroke();

      //=============================================
      let floatPosX = this.initPos.x / SIZE;
      // let floatPosX = this.pos.x / SIZE;
      const packedFloatPosX = packFloat(floatPosX)
      app.fill(
        packedFloatPosX.r,
        packedFloatPosX.g,
        packedFloatPosX.b,
        255,
      )
      app.rect(this.index, SIZE - 1, 1, 1);


      //=============================================
      let floatPosY = this.initPos.y / SIZE;
      // let floatPosY = this.pos.y / SIZE;
      const packedFloatPosY = packFloat(floatPosY)
      app.fill(
        packedFloatPosY.r,
        packedFloatPosY.g,
        packedFloatPosY.b,
        255,
      )
      app.rect(this.index, SIZE - 2, 1, 1);


      //=============================================
      app.fill(
        // this.data / DATA_LEVEL * 255.0,
        this.data / DATA_LEVEL * 255.0,
        this.life2 / this.lifeMax2 * 255,
        0,
        255,
      )
      app.rect(this.index, SIZE - 3, 1, 1);


    }

  }
}

export default init;



export class P5Canvas1Manager {

  static init() {
    console.log("init")
  }

  static start() {
    isStart = true
  }

  static stop() {
    isStart = false
  }

  static reset() {
    objs.forEach(element => {
      element = null;
    });
    objs = [];

    app.clear()
    indexCount = 0;
    time = 0;
    isLoaded = false;
  }

  static load(countryName) {
    loadImages(countryName)
  }

  static getCanvasElement() {
    return app.canvas;
  }

}