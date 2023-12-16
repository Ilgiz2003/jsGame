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

var currentBlock = 0;

function addClickHandlerToBlock(block) {
    block.addEventListener('click', () => {
        if (parseInt(block.innerHTML) === currentBlock) {
            currentBlock++;
            var circle = document.createElement('div');
            circle.className = 'circle';
            circle.innerHTML = currentBlock;
            block.appendChild(circle);
        }
    });
}

document.querySelectorAll('.block').forEach(block => {
    addClickHandlerToBlock(block);
});

document.getElementById('checkBtn').addEventListener('click', () => {
    clearInterval(timer);
    const score = document.getElementById('scoreContainer')
    if (currentBlock === 10 && timeLeft !== 0) {
        score.innerHTML = 'Очки: 10';
        document.getElementById('nextBtn').style.opacity = 1;
    } else {
        score.innerHTML = 'Вы не справились! Очки: 0';
    }
    score.style.opacity = 1;
    const user = localStorage.getItem('inputValue');
    const userScore = Number(localStorage.getItem(user));
    const allUserScore = userScore + 10;
    localStorage.setItem(user, allUserScore);
    timeLeft = 0;
});

document.addEventListener("DOMContentLoaded", function (event) {
    placeBlocks();
});

document.getElementById('restartBtn').addEventListener('click', function() {
    location.reload();
});

var timeLeft = 30;
function startTimer() {
    timer = setInterval(function() {
        timeLeft--;
        if(timeLeft < 10){
            document.getElementById('timer').innerHTML = 'Время: ' + '0:0'+ timeLeft;
        } else {
            document.getElementById('timer').innerHTML = 'Время: ' + '0:'+ timeLeft;
        }
        if (timeLeft <= 0) {
            clearInterval(timer);
            if (currentBlock !== 10) {
                const score = document.getElementById('scoreContainer')
                score.innerHTML = 'Вы не успели! Очки: 0';
                score.style.opacity = 1;
            } else {
                document.getElementById('nextBtn').style.opacity = 1;
                const score = document.getElementById('scoreContainer')
                score.innerHTML = 'Очки: 10';
                score.style.opacity = 1;
                const user = localStorage.getItem('inputValue');
                const userScore = Number(localStorage.getItem(user));
                const allUserScore = Number(userScore + 10)
                localStorage.setItem(user, allUserScore.toString());
            }
        }
    }, 1000);
}

startTimer();

document.getElementById('levelBtn').addEventListener('click', function() {
    window.location.href = '../../selectLevelPage/selectLevel.html';
});

document.getElementById('nextBtn').addEventListener('click', function() {
    const levels = ['level1', 'level2', 'level3'];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    window.location.href = '../' + randomLevel + '/' + randomLevel + '.html';
});