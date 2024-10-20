// brains.js

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { scene } from './scene.js';
import { player } from './player.js';
import BrainModel from '../public/content/Brain.glb';


const brainLoader = new GLTFLoader();
const brainColors = ['aqua', 'red', 'yellow'];
const lanes = [-4, 0, 4];
export const brains = [];


// Функція для створення моделі мозку 
export function createBrain(xPosition, zPosition, color) {
    brainLoader.load(
        BrainModel,
        function (gltf) {
            const brain = gltf.scene;
            brain.scale.set(2, 2, 2);
            brain.position.set(xPosition, 0.5, zPosition);

            brain.userData.color = new THREE.Color(color);

            brain.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.color.set(color);
                }
            });
            scene.add(brain);
            brains.push(brain);
        },
        undefined,
        function (error) {
            console.error('Помилка при завантаженні моделі мозку:', error);
        }
    );
}

// Функція для рандомної появи мозку на треку

export function createBrainsSequence(zPosition) {
    const laneIndex = Math.floor(Math.random() * lanes.length);
    const xPosition = lanes[laneIndex];

    const brainCountInSequence = Math.floor(Math.random() * 2) + 1;

    const color = brainColors[Math.floor(Math.random() * brainColors.length)];

    for (let i = 0; i < brainCountInSequence; i++) {
        const randomSpacing = Math.random() * 5 + 10; 
        const brainZPosition = zPosition - i * randomSpacing;

        createBrain(xPosition, brainZPosition, color);
    }
}

// Функція яка змінює колір персонажа у колір останнього підібраного мозку

export function updateBrains(brainCount, updateTextSprite, brainCountSprite) {
    for (let i = brains.length - 1; i >= 0; i--) {
        const brain = brains[i];
        if (brain.position.z > player.position.z) {
            continue;
        }
        if (brain.position.distanceTo(player.position) < 1) {
            // Зміна кольору персонажа
            player.traverse(function(child) {
                if (child.isMesh) {
                    let childMaterials = Array.isArray(child.material) ? child.material : [child.material];
                    childMaterials.forEach(function(material) {
                        if (material.color) {
                            material.color.set(brain.userData.color);
                        }
                    });
                }
            });

            // Збільшення лічильника мізків
            brainCount++;

            // Оновлення тексту на спрайті
            updateTextSprite(brainCountSprite, brainCount.toString());

            // Видалення мозку
            scene.remove(brain);
            brains.splice(i, 1);
        }
    }
    return brainCount;
}
