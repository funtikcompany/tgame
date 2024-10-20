
import * as THREE from 'three';

// Створення сцени
export const scene = new THREE.Scene();

// Встановлення фону сцени
scene.background = new THREE.Color(0x87CEEB);

// Додавання туману для створення градієнтного ефекту
scene.fog = new THREE.Fog(0x87CEEB, 10, 80);
// Створення камери
export const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 10, 20);

// Створення рендерера
export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); 
document.body.appendChild(renderer.domElement);

const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0xffffff, 0.8); 
scene.add(hemisphereLight);

// Ambient Light для базового освітлення
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); 
scene.add(ambientLight);

// Directional Light для додаткового спрямованого освітлення
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);
