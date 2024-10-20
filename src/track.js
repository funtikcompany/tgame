// track.js

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { scene } from './scene.js';
import TrackModel from '../public/content/TrackFloor.glb';


const trackLoader = new GLTFLoader();
let trackLength;
export const tracks = [];
// Завантаження треку
export function loadTrack() {
    return new Promise((resolve, reject) => {
        trackLoader.load(
            TrackModel,
            function (gltf) {
                const track = gltf.scene;
                track.scale.set(2, 10, 10);
                track.position.set(0, 0, 20);
                track.rotation.set(0, 0, 0);

                const bbox = new THREE.Box3().setFromObject(track);
                trackLength = bbox.max.z - bbox.min.z;

                track.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshStandardMaterial();
                    }
                });

                scene.add(track);
                tracks.push(track);

                createAdditionalTrack();
                resolve();
            },
            undefined,
            function (error) {
                console.error('Error loading the track model:', error);
                reject(error);
            }
        );
    });
}

// Функція для створення та позиціонування додаткових доріжок
export function createAdditionalTrack() {
    const lastTrack = tracks[tracks.length - 1];
    const clonedTrack = lastTrack.clone();
    clonedTrack.position.set(
        lastTrack.position.x,
        lastTrack.position.y,
        lastTrack.position.z - trackLength
    );
    scene.add(clonedTrack);
    tracks.push(clonedTrack);
}

// Функція оновлення позицій треків на основі позиції гравця
export function updateTrackPosition(playerPositionZ) {
    const lastTrack = tracks[tracks.length - 1];

    if (playerPositionZ - lastTrack.position.z < trackLength / 2) {
        createAdditionalTrack();
    }

    if (tracks.length > 5) {
        const firstTrack = tracks[0];
        if (playerPositionZ - firstTrack.position.z > trackLength * 2) {
            scene.remove(firstTrack);
            tracks.shift();
        }
    }
}
