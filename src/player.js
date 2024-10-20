// player.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { scene } from './scene.js';
import StickmanModel from '../public/content/Stickman.glb';

 let player;
 let mixer;

const loader = new GLTFLoader();

export function loadPlayer() {
    return new Promise((resolve, reject) => {
        loader.load(
            StickmanModel,
            function (gltf) {
                player = gltf.scene;
                player.scale.set(1.5, 1.5, 1.5);
                player.position.y = 0;
                player.rotation.y = Math.PI;
                scene.add(player);

                mixer = new THREE.AnimationMixer(player);

                const animations = gltf.animations;
                const runClip = THREE.AnimationClip.findByName(animations, 'Run');

                if (runClip) {
                    const runAction = mixer.clipAction(runClip);
                    runAction.enabled = true;
                    runAction.setLoop(THREE.LoopRepeat);
                    runAction.play();
                    resolve();
                } else {
                    console.error('Не вдалося знайти необхідні анімації.');
                    reject('Animation not found');
                }
            },
            undefined,
            function (error) {
                console.error('Помилка при завантаженні моделі:', error);
                reject(error);
            }
        );
    });
}

export { player, mixer };