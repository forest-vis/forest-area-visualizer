import * as p5 from 'p5';
import { CompressedPixelFormat } from 'three';

import Stats from 'three/examples/jsm/libs/stats.module'

const stats = Stats()
// document.body.appendChild(stats.dom)
stats.dom.style.cssText = 'position:absolute;top:0px;left:0px;';

const SIZE = 2048

var _cellSize = 30;
var _numX, _numY;
var _cellArray;

let maskImg;
let dataImg;
let isStart = false;
let isJapan = false;
let isLoaded = false;

const DATA_LEVEL = 21.0;
let adjustDataFactor = 1.0;

const getMask = (x, y) => {
  const index = Math.floor(y) * Math.floor(SIZE / _cellSize) + Math.floor(x);
  return maskImg.pixels[index * 4];
}

const getData = (x, y) => {
  // if (x < 0 || y < 0) return 0;
  const index = Math.floor(y) * Math.floor(SIZE / _cellSize) + Math.floor(x);
  // console.log(index * 4, dataImg.pixels.length)
  if (index < 0) return 0;
  if (index * 4 >= dataImg.pixels.length) return 0;
  return Math.round(dataImg.pixels[index * 4] * adjustDataFactor);
}

const restart = () => {

  for (var x = 0; x < _numX; x++) {
    for (var y = 0; y < _numY; y++) {
      const initState = getMask(x, y) > 10;
      var newCell = new Cell(x, y, initState);
      _cellArray[x][y] = newCell;
    }
  }

  for (var x = 0; x < _numX; x++) {
    for (var y = 0; y < _numY; y++) {
      var above = y - 1;
      var below = y + 1;
      var left = x - 1;
      var right = x + 1;

      if (above < 0) { above = _numY - 1; }
      if (below == _numY) { below = 0; }
      if (left < 0) { left = _numX - 1; }
      if (right == _numX) { right = 0; }

      _cellArray[x][y].addNeighbour(_cellArray[left][above]);
      _cellArray[x][y].addNeighbour(_cellArray[left][y]);
      _cellArray[x][y].addNeighbour(_cellArray[left][below]);
      _cellArray[x][y].addNeighbour(_cellArray[x][below]);
      _cellArray[x][y].addNeighbour(_cellArray[right][below]);
      _cellArray[x][y].addNeighbour(_cellArray[right][y]);
      _cellArray[x][y].addNeighbour(_cellArray[right][above]);
      _cellArray[x][y].addNeighbour(_cellArray[x][above]);
    }
  }

  isLoaded = true;
}


const loadImages = countryName => {

  let loadCount = 0;
  const comp = () => {
    loadCount += 1;
    if (loadCount >= 2) {
      restart();
    }
  }

  maskImg = app.loadImage('Assets/data/' + countryName + '_mask.png', img => {
    maskImg.resize(SIZE / _cellSize, SIZE / _cellSize);
    maskImg.loadPixels();
    comp();
  });

  dataImg = app.loadImage('Assets/data/' + countryName + '_data.png', img => {
    dataImg.resize(SIZE / _cellSize, SIZE / _cellSize);
    dataImg.loadPixels();
    comp();
  });

}

function initP(p) {

  p.setup = () => {

    p.createCanvas(SIZE, SIZE);
    p.noStroke();

    p.frameRate(10);

    _numX = Math.floor(SIZE / _cellSize);
    _numY = Math.floor(SIZE / _cellSize);
    _cellArray = [_numY];
    for (var i = 0; i < _numX; i++) {
      _cellArray[i] = [_numX];
    }


    _callback();

  }


  p.draw = () => {

    if (isStart == false) return;
    if (isLoaded == false) return;

    for (var x = 0; x < _numX; x++) {
      for (var y = 0; y < _numY; y++) {
        _cellArray[x][y].calcNextState();
      }
    }

    p.translate(_cellSize / 2, _cellSize / 2);
    for (var x = 0; x < _numX; x++) {
      for (var y = 0; y < _numY; y++) {
        _cellArray[x][y].drawMe();
      }
    }

    stats.update();

  }

};


class Cell {

  constructor(x, y, initState) {
    this.init(x, y, initState);
  }

  init(x, y, initState) {
    this.x = x * _cellSize;
    this.y = y * _cellSize;
    if (Math.random() * 2.0 > 1) {
      this.nextState = true;
    } else {
      this.nextState = false;
    }

    // this.nextState = initState;
    this.isLive = this.nextState;
    this.neighbours = [];
    this.color = 0;

    const mask = (getMask(this.x / _cellSize, this.y / _cellSize) > 10);
    this.isMasked = mask;

  }


  addNeighbour(cell) {
    this.neighbours.push(cell);
  }

  calcNextState() {
    if (!this.isMasked) return;
    var liveCount = 0;

    for (var i = 0; i < this.neighbours.length; i++) {
      if (this.neighbours[i].isLive == true) {
        liveCount++;
      }
    }

    if (this.isLive == true) {
      if ((liveCount == 2) || (liveCount == 3)) {
        this.nextState = true;
      } else {
        if (this.color > 0 && Math.random() > 0.9) {
          // no die
        } else {
          this.nextState = false;
        }
      }
    } else {
      if (
        (liveCount == 3)
        // || (liveCount == 2 && Math.sin(time * 10.0) > 0)
        || (isJapan && liveCount <= 5 && Math.random() > 0.9)
        // || (this.color > 0 && Math.random() > 0.9)
      ) {
        this.nextState = true;
      } else {
        this.nextState = false;
      }
    }

    let data = getData(this.x / _cellSize, this.y / _cellSize);
    this.color = data;
    // if () {
    // console.log(this.color);
    // }

  }

  drawMe() {

    if (!this.isMasked) return;
    this.isLive = this.nextState;

    if (this.isLive == true) {
      app.fill(0, 0, 0, 150);
      // app.fill(this.color * 10.0, 0, 0)
      // app.tint(255, 126);
      app.rect(this.x, this.y, _cellSize, _cellSize);

      // if (this.color > 1) {
      //   app.image(lossMarkImg, this.x, this.y, _cellSize, _cellSize);
      // } else {
      //   app.image(forestMarkImg, this.x, this.y, _cellSize, _cellSize);
      // }

    } else {
      app.fill(255, 255, 255, 10);
      // app.tint(255, 126);
      app.rect(this.x, this.y, _cellSize, _cellSize);
      // app.rect(this.x, this.y, _cellSize, _cellSize);
    }

  }


}



let _callback;
let app;
const init = (element, callback) => {
  _callback = callback;
  app = new p5(initP, element)
}

export default init;




export class P5Canvas2Manager {

  static init() {
    console.log("init")
  }

  static start(_isJapan) {
    isStart = true
    isJapan = _isJapan;
  }

  static stop() {
    isStart = false
  }

  static reset() {
    app.clear()
    isLoaded = false;
  }

  static load(countryName) {
    loadImages(countryName)
  }

  static getCanvasElement() {
    return app.canvas;
  }

}