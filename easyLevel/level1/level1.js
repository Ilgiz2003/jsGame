function getRandomPosition(containerWidth, containerHeight) {
    var blockContainer = document.getElementById("blockContainer");
    var containerRect = blockContainer.getBoundingClientRect();
    var posX = Math.floor(Math.random() * containerRect.right);
    var posY = Math.floor(Math.random() * containerRect.bottom);
    while (posX > containerWidth - 60 || posY > containerHeight - 60) {
        posX = Math.floor(Math.random() * containerWidth);
        posY = Math.floor(Math.random() * containerHeight);
    }
    return [posX, posY];
}

function checkOverlap(posX, posY, blocks) {
    for (var i = 0; i < blocks.length; i++) {
        var block = blocks[i];
        if (
            posX < block.x + 55 &&
            posX + 55 > block.x &&
            posY < block.y + 55 &&
            posY + 55 > block.y
        ) {
            return true;
        }
    }
    return false;
}

function placeBlocks() {
    var blockContainer = document.getElementById("blockContainer");
    var containerRect = blockContainer.getBoundingClientRect();
    var positions = [];
    var idCounter = 0;
    for (var i = 0; i < 10; i++) {
        var position = getRandomPosition(containerRect.width, containerRect.height);
        var overlap = checkOverlap(position[0], position[1], positions);
        while (overlap) {
            position = getRandomPosition(containerRect.width, containerRect.height);
            overlap = checkOverlap(position[0], position[1], positions);
        }
        positions.push({
            x: position[0],
            y: position[1],
        });
        var block = document.createElement("div");
        block.className = "block";
        block.style.left = position[0] + "px";
        block.style.top = position[1] + "px";
        block.x = position[0];
        block.y = position[1];
        block.innerHTML = i;
        blockContainer.appendChild(block);
    }
    document.querySelectorAll('.block').forEach(block => {
        addClickHandlerToBlock(block);
    });
}

function addClickHandlerToBlock(block) {
    block.addEventListener('click', () => {
        if (block.classList.contains('selected')) {
            block.classList.remove('selected');
            block.style.backgroundColor = 'transparent';
        } else {
            block.classList.add('selected');
            block.style.backgroundColor = '#cccccc';
        }
    });
}

document.querySelectorAll('.block').forEach(block => {
    addClickHandlerToBlock(block);
});

document.getElementById('checkBtn').addEventListener('click', () => {
    const selectedBlocks = document.querySelectorAll('.selected');
    var countCorrectAnswers = 0;
    var countIncorrectAnswers = 0;
    selectedBlocks.forEach(block => {
        const number = parseInt(block.innerHTML);
        if (number % 2 !== 0) {
            countCorrectAnswers++;
            block.style.backgroundColor = 'yellow';
        } else {
            countIncorrectAnswers++;
            block.style.backgroundColor = 'red';
        }
    });
    const score = document.getElementById('scoreContainer')
    if (countIncorrectAnswers >= countCorrectAnswers) {
        score.innerHTML = "Вы не справились! Очки: 0";
    } else {
        score.innerHTML = "Очки: " + (countCorrectAnswers - countIncorrectAnswers);
        document.getElementById('nextBtn').style.opacity = 1;
    }
    score.style.opacity = 1;
    const user = localStorage.getItem('inputValue');
    const userScore = Number(localStorage.getItem(user));
    const allUserScore = userScore + countCorrectAnswers - countIncorrectAnswers
    localStorage.setItem(user, allUserScore);
});

document.addEventListener("DOMContentLoaded", function (event) {
    placeBlocks();
});

document.getElementById('restartBtn').addEventListener('click', function() {
    location.reload();
});

document.getElementById('levelBtn').addEventListener('click', function() {
    window.location.href = '../../selectLevelPage/selectLevel.html';
});

document.getElementById('nextBtn').addEventListener('click', function() {
    const levels = ['level1', 'level2', 'level3'];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    window.location.href = '../' + randomLevel + '/' + randomLevel + '.html';
});