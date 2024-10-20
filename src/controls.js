// controls.js

let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

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
    document.addEventListener('touchstart', function(e) {
        isDragging = true;
        previousMousePosition.x = e.touches[0].clientX;
    });

    document.addEventListener('touchmove', function(e) {
        if (isDragging) {
            const deltaMove = {
                x: e.touches[0].clientX - previousMousePosition.x
            };
            handleMove(deltaMove.x, player);
            previousMousePosition.x = e.touches[0].clientX;
        }
    });

    document.addEventListener('touchend', function(e) {
        isDragging = false;
    });
}
