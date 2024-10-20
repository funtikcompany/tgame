import * as THREE from 'three';
import { scene, camera, renderer } from './scene.js';
import { loadPlayer, player, mixer } from './player.js';
import { loadTrack, updateTrackPosition } from './track.js';
import { createBrainsSequence, updateBrains } from './brains.js';
import { setupControls } from './controls.js';
import TutorialHand from '../public/content/hand.png';
import SwipeToStart from '../public/content/swipe_to_start.png';
import { createTextSprite, updateTextSprite, updateUISpritePosition } from './ui.js';

let speed = 0.2;
let clock = new THREE.Clock();
let brainCount = 0;
let brainCountSprite;

// Ініціалізація елементів
async function init() {
    const preloader = document.getElementById('preloader');

    try {
        // Завантаження всіх моделей перед початковим рендером
        await loadPlayer();
        await loadTrack();
        setupControls(player);

        // Створення спрайта з початковим значенням 0
        brainCountSprite = createTextSprite('0');
        scene.add(brainCountSprite);

        // Початковий рендер сцени
        renderer.render(scene, camera);

        preloader.style.display = 'none';

        const tutorial = document.getElementById('tutorial');
        tutorial.style.display = 'flex';

        const tutorialHandImg = document.querySelector("#tutorial .hand");
        const swipeToStartImg = document.querySelector("#tutorial .swipe");

        tutorialHandImg.src = TutorialHand;
        swipeToStartImg.src = SwipeToStart;

        // Запускаємо анімацію, щоб Idle-стан гравця був видимий

        tutorial.addEventListener('click', onTutorialClick);
        window.addEventListener('resize', onWindowResize);
    } catch (error) {
        console.error('Помилка під час завантаження ресурсів:', error);
        preloader.innerText = 'Не вдалося завантажити гру. Спробуйте ще раз.';
    }
}


// Оновлення розмірів рендерера і камери при зміні розміру вікна
function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.render(scene, camera);
}

// Починаємо гру після кліку на туторіал

function onTutorialClick() {
    const tutorial = document.getElementById('tutorial');
    tutorial.style.display = 'none';
    // startRunningAnimation()
    animate();
}

// Анімація гри

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    if (player) {
        player.position.z -= speed;
        camera.position.z = player.position.z + 20; // Відстань до гравця
        camera.position.x = player.position.x;
        camera.position.y = player.position.y + 10; // Додатково піднімаємо камеру для кращого огляду

        updateTrackPosition(player.position.z);
        updateUISpritePosition(brainCountSprite);

        if (Math.random() < 0.02) {
            createBrainsSequence(player.position.z - 75);
        }

        brainCount = updateBrains(brainCount, updateTextSprite, brainCountSprite);
    }

    renderer.render(scene, camera);
}

window.addEventListener('load', () => {
    init();
});
