// controls.js

let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};


let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 50; // Мінімальна відстань для розпізнавання свайпу

function handleMove(deltaX, player) {
    if (player) {
        player.position.x += deltaX * 0.01;
        player.position.x = Math.max(Math.min(player.position.x, 4.5), -4.5);
    }
}

export function setupControls(player) {
    // Для десктопів
    document.addEventListener('mousedown', function(e) {
        isDragging = true;
        previousMousePosition.x = e.clientX;
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const deltaMove = {
                x: e.clientX - previousMousePosition.x
            };
            handleMove(deltaMove.x, player);
            previousMousePosition.x = e.clientX;
        }
    });

    document.addEventListener('mouseup', function(e) {
        isDragging = false;
    });

    // Для мобільних пристроїв

    // Початок свайпу
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
    });
    
    // Завершення свайпу
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
    
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Свайп вправо
                handleMove('right', player);
            } else {
                // Свайп вліво
                handleMove('left', player);
            }
        }
    }
}
