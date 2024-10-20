// player.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { scene } from './scene.js';
import StickmanModel from '../public/content/Stickman.glb';

let player;
let mixer;
let idleAction, runAction;

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

                // Знайти Idle анімацію
                const idleClip = THREE.AnimationClip.findByName(animations, 'Idle');
                if (idleClip) {
                    idleAction = mixer.clipAction(idleClip);
                    idleAction.enabled = true;
                    idleAction.setLoop(THREE.LoopRepeat);
                    idleAction.play();
                } else {
                    console.error('Не вдалося знайти анімацію Idle.');
                }

                // Знайти Run анімацію
                const runClip = THREE.AnimationClip.findByName(animations, 'Run');
                if (runClip) {
                    runAction = mixer.clipAction(runClip);
                    runAction.enabled = true;
                    runAction.setLoop(THREE.LoopRepeat);
                } else {
                    console.error('Не вдалося знайти анімацію Run.');
                }

                // Вимкнути всі інші анімації, якщо такі є
                animations.forEach(clip => {
                    if (clip.name !== 'Idle' && clip.name !== 'Run') {
                        const action = mixer.clipAction(clip);
                        action.stop();
                        action.enabled = false;
                    }
                });

                resolve();
            },
            undefined,
            function (error) {
                console.error('Помилка при завантаженні моделі:', error);
                reject(error);
            }
        );
    });
}

// Функція для переходу з Idle на Run
export function switchToRunAnimation() {
    if (idleAction && runAction) {
        idleAction.fadeOut(0.5); // Плавне зникнення Idle
        runAction.reset().fadeIn(0.5).play(); // Плавне появлення Run
    } else {
        console.error('Анімації Idle або Run не доступні.');
    }
}

export { player, mixer };
