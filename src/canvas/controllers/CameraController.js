import * as THREE from "three";
import gsap, { Sine, Quart } from "gsap/all";

import * as dat from 'dat.gui';


import { isMobile } from 'react-device-detect';
import CanvasManager from "../managers/CanvasManager";
import MathUtils from "../utils/MathUtils";
import { DoubleSide } from "three";



const lerp = (start, end, amt) => {
    return (1 - amt) * start + amt * end
}

const SPEED = isMobile ? 0.3 : 0.15;

class CameraController {

    static init(camera) {
        console.log("isMobile:", isMobile);
        this.camera = camera;

        this.clock = new THREE.Clock();
        this.time = 0.0;

        // window.camera = camera;

        this.targetRotatePos = new THREE.Vector3();
        this.targetRotateRot = new THREE.Vector3();
        this.targetPos = new THREE.Vector3();
        this.targetRot = new THREE.Vector3();

        this.tmp = new THREE.Camera();
        this.tmp2 = new THREE.Camera();
        window.tmp2 = this.tmp2;

        window.targetRotatePos = this.targetRotatePos;
        window.targetRotateRot = this.targetRotateRot;
        window.targetPos = this.targetPos;
        window.targetRot = this.targetRot;

        this.rotFactor = 1.0;
        this.rotSpeed = 0.04;
        this.camPos = 1.0;
        this.rotOffset = 0.0;
        this.camera.zoomLevel = 0.0;
        this.debug = false;
    }

    static enabeleRotation() {
        gsap.killTweensOf(this);
        gsap.to(this, {
            rotFactor: 1,
            duration: 10.0,
            ease: Quart.easeInOut
        });
    }

    static disableRotation() {
        gsap.killTweensOf(this);
        gsap.to(this, {
            rotFactor: 0,
            duration: 10.0,
            ease: Quart.easeInOut
        });
    }

    static enabeleZoom() {
        // this.camera.fov = 35;
        gsap.killTweensOf(this.camera)
        gsap.to(this.camera, {
            fov: 23,
            duration: 10.0,
            zoomLevel: 1.0,
            // duration: 1.0,
            ease: Quart.easeInOut,
            onUpdate: () => {
                this.camera.updateProjectionMatrix();
            }
        })
    }

    static disableZoom() {
        gsap.killTweensOf(this.camera)
        gsap.to(this.camera, {
            fov: 35,
            duration: 15.0,
            zoomLevel: 0.0,
            // duration: 1.0,
            ease: Quart.easeInOut,
            onUpdate: () => {
                CameraController.camera.updateProjectionMatrix();
            }
        })
    }

    static moveCamera(pos, rot, duration, callback) {

        const currentPos = CameraController.camera.position.clone();
        const currentRot = CameraController.camera.rotation.clone();


        gsap.killTweensOf(this.params);
        this.params = { value: 0 }

        gsap.killTweensOf(this.params);
        gsap.to(this.params, {
            duration: duration, value: 1, ease: Sine.easeInOut,
            onUpdate: () => {
                // console.log(this.targetPos)
                // console.log(pos)
                this.targetPos.set(
                    lerp(currentPos.x, pos.x, this.params.value),
                    lerp(currentPos.y, pos.y, this.params.value),
                    lerp(currentPos.z, pos.z, this.params.value)
                );

                if (rot == null) {

                    this.tmp.position.set(
                        currentPos.x,
                        currentPos.y,
                        currentPos.z
                    );
                    this.tmp.lookAt(0, 0, 0);

                    this.targetRot.set(
                        lerp(currentRot.x, this.tmp.rotation.x, this.params.value),
                        lerp(currentRot.y, this.tmp.rotation.y, this.params.value),
                        lerp(currentRot.z, this.tmp.rotation.z, this.params.value)
                    );


                } else {

                    this.targetRot.set(
                        lerp(currentRot.x, rot.x, this.params.value),
                        lerp(currentRot.y, rot.y, this.params.value),
                        lerp(currentRot.z, rot.z, this.params.value)
                    );
                }
            },
            onComplete: () => {
                callback();
            }
        });
    }

    static update() {

        const delta = this.clock.getDelta();
        this.time += delta;

        this.targetRotatePos.set(
            Math.sin(this.time * -this.rotSpeed + this.rotOffset) * lerp(0.5, 0.2, this.camPos),
            lerp(0.6, 1.5, this.camPos),
            Math.cos(this.time * -this.rotSpeed + this.rotOffset) * lerp(0.5, 0.2, this.camPos)
        );

        this.tmp2.position.set(
            this.camera.position.x,
            this.camera.position.y,
            this.camera.position.z
        )
        this.tmp2.lookAt(
            Math.cos(this.time * this.rotSpeed * 4.0) * 0.2 * this.camera.zoomLevel,
            0,
            0
        );

        this.targetRotateRot.set(
            this.tmp2.rotation.x,
            this.tmp2.rotation.y,
            this.tmp2.rotation.z
        );


        if (this.debug) return;
        this.camera.position.set(
            lerp(this.targetPos.x, this.targetRotatePos.x, this.rotFactor),
            lerp(this.targetPos.y, this.targetRotatePos.y, this.rotFactor),
            lerp(this.targetPos.z, this.targetRotatePos.z, this.rotFactor)
        )

        this.camera.rotation.set(
            lerp(this.targetRot.x, this.targetRotateRot.x, this.rotFactor),
            lerp(this.targetRot.y, this.targetRotateRot.y, this.rotFactor),
            lerp(this.targetRot.z, this.targetRotateRot.z, this.rotFactor)
        )
    }

    static reset() {
        this.time = 0.0;
        this.rotFactor = 1.0;
        this.camPos = 1.0;
        gsap.killTweensOf(this.params);
        gsap.killTweensOf(this.camera)
        gsap.killTweensOf(this);
    }

}

window.CameraController = CameraController;
export default CameraController;