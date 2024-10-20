// ui.js

import * as THREE from 'three';
import { player } from './player.js';
// Лічильник підібраних мізків
export function createTextSprite(message) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    context.font = 'Bold 80px Arial';
    context.fillStyle = 'rgba(255,255,255,1.0)';
    context.textAlign = 'center';
    context.fillText(message, canvas.width / 2, canvas.height / 2 + 30);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 1, 1);

    sprite.userData.canvas = canvas;
    sprite.userData.context = context;

    return sprite;
}

export function updateTextSprite(sprite, message) {
    const context = sprite.userData.context;
    const canvas = sprite.userData.canvas;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillText(message, canvas.width / 2, canvas.height / 2 + 30);

    sprite.material.map.needsUpdate = true;
}

export function updateUISpritePosition(sprite) {
    if (player) {
        sprite.position.set(player.position.x, player.position.y + 10, player.position.z);
    }
}
