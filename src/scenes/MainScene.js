import React, { Component } from "react";
import classNames from "classnames";

import "./MainScene.scss"

import CanvasManager from "../canvas/managers/CanvasManager";
import CameraController from "../canvas/controllers/CameraController";


import p5App from "../canvas/commons/createP5"
import p5AppVer2 from "../canvas/commons/createP5ver2"
import gsap from "gsap/all";

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

class MainScene extends Component {

  constructor(props) {
    super(props);

    this.state = {
      assetsLoadComp: false,
      isStarted: false
    };

    // console.log("sakana");
    window.REF_assetsLocaComp = () => this.assetsLocaComp();
    window.REF_setLoadProgress = (v) => this.setLoadProgress(v);

    window.REF_fadeBlackIn = () => this.fadeBlackIn();
    window.REF_fadeBlackOut = () => this.fadeBlackOut();

    window.REF_setCountry = (name, area) => this.setCountry(name, area);
    window.REF_showCaption = (str) => this.showCaption(str);
    window.REF_showTitle = () => this.showTitle();
    window.REF_showExample = () => this.showExample();
  }

  componentDidMount() {

    p5App(this.p5Container);
    p5AppVer2(this.p5Container, () => {
      this.container.appendChild(CanvasManager.getElement());
      CanvasManager.init()
    });

    // setTimeout(() => {

    //   this.container.appendChild(CanvasManager.getElement());
    //   CanvasManager.init()

    // }, 200);
  }

  componentWillUnmount() {
    this.container.removeChild(CanvasManager.getElement());
  }

  assetsLocaComp() {
    const isDebug = params.hasOwnProperty("debug");
    setTimeout(() => {
      this.setState({
        assetsLoadComp: true
      })

      if (isDebug) {
        this.start();
      }

    }, isDebug ? 33 : 1000);
  }

  setLoadProgress(v) {
    v = Math.min(1.0, v);
    console.log(v);
  }

  start(e) {
    CanvasManager.start();

    this.setState({
      isStarted: true
    })

  }

  fadeBlackIn() {
    gsap.to(this.blackFill, { autoAlpha: 0, duration: 2 })
  }

  fadeBlackOut() {
    gsap.to(this.blackFill, { autoAlpha: 1, duration: 1 })
  }

  showCaption(str) {
    this.caption.innerHTML = str;
  }

  setCountry(name, area) {
    this.countryName.innerHTML = name;
    this.countryAreaName.innerHTML = area;
  }
  showTitle() {
    gsap.to(this.infoContainer, { autoAlpha: 1, duration: 1 })
    gsap.to(this.uiCreditImg, { autoAlpha: 1, duration: 1 })
  }

  showExample() {
    gsap.to(this.uiExampleImg, { autoAlpha: 1, duration: 1 })
  }

  render() {
    return (
      <div className="MainScene">

        <div className="CanvasContainer" ref={container => {
          this.container = container;
        }} />

        <div className="P5CanvasContainer" ref={container => {
          this.p5Container = container;
        }} />

        <div className={classNames({
          "TopContainer": true,
          "fadeIn": this.state.assetsLoadComp,
          "fadeOut": this.state.isStarted,
        })} />

        <div ref={container => this.infoContainer = container} className="InfoContainer">
          <div ref={container => this.countryName = container} className="CountryName">JAPAN</div>
          <div ref={container => this.countryAreaName = container} className="CountryAreaName">Country in Sounth Asia</div>
        </div>

        <div className="CaptionContainer">
          <div ref={container => this.caption = container} className="Caption"></div>
        </div>


        <div className="TEST_UI">
          <img ref={container => this.uiExampleImg = container} src={`${process.env.PUBLIC_URL}/Assets/video-ui/ui-example.png`} alt="ui" />
          <img ref={container => this.uiCreditImg = container} src={`${process.env.PUBLIC_URL}/Assets/video-ui/ui-title-credit.png`} alt="ui" />
          <div className="blackFill" ref={container => this.blackFill = container} />
        </div>

      </div>
    );
  }
}

export default MainScene;
