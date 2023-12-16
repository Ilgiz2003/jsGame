var draggedObj;
var blockContainer = document.getElementById("blockContainer");
var taskContainer = document.getElementById("taskContainer");

function getRandomPosition(containerWidth, containerHeight) {
    var blockContainer = document.getElementById("blockContainer");
    var containerRect = blockContainer.getBoundingClientRect();
    var posX = Math.floor(Math.random() * containerRect.right);
    var posY = Math.floor(Math.random() * containerRect.bottom);
    while (posX > containerWidth - 200 || posY > containerHeight - 60 || posY < containerRect.top - 50) {
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
        block.draggable = true;
        block.id = "block" + idCounter;
        idCounter++;
        block.addEventListener("dragstart", function (event) {
            draggedObj = event.target;
            event.dataTransfer.setData("text/plain", draggedObj.id);
        });
        blockContainer.appendChild(block);
    }
}

taskContainer.addEventListener("dragover", function (event) {
    event.preventDefault();
});

const handleDrop = (event) => {
    event.preventDefault();
    const { dataTransfer } = event;
    const id = dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(id);

    draggedElement.style.left = "0px";
    draggedElement.style.top = "0px";
    draggedElement.style.position = "initial";

    var nearestLeftBlock = null;
    var nearestRightBlock = null;
    var minDistanceToLeftBlock = Infinity;
    var minDistanceToRightBlock = Infinity;
    for(let i = 0; i < taskContainer.children.length; i++){
        var block = taskContainer.children[i];
        var rect = block.getBoundingClientRect();
        var distanceToLeftBlock = Math.abs(event.clientX - rect.right);
        var distanceToRightBlock = Math.abs(event.clientX - rect.left);
        if (distanceToLeftBlock >= 0 && distanceToLeftBlock < minDistanceToLeftBlock) {
            minDistanceToLeftBlock = distanceToLeftBlock;
            nearestLeftBlock = block;
        }
        if (distanceToRightBlock >= 0 && distanceToRightBlock < minDistanceToRightBlock) {
            minDistanceToRightBlock = distanceToRightBlock;
            nearestRightBlock = block;
        }
    }
    if(minDistanceToRightBlock < minDistanceToLeftBlock && nearestLeftBlock === nearestRightBlock){
        taskContainer.insertBefore(draggedElement, event.target.firstChild);
    } else if (minDistanceToRightBlock > minDistanceToLeftBlock && nearestLeftBlock === nearestRightBlock){
        taskContainer.append(draggedElement);
    } else if (nearestRightBlock == null){
        taskContainer.append(draggedElement);
    } else {
        taskContainer.insertBefore(draggedElement, nearestRightBlock);
    }
    draggedElement.style.animationPlayState = 'paused';
};

taskContainer.addEventListener("drop", handleDrop);

document.getElementById("checkBtn").addEventListener("click", () => {
    clearInterval(timer);

    for(let i = 0; i < blockContainer.children.length; i++) {
    blockContainer.children[i].style.animationPlayState = 'paused';
    }
    const score = document.getElementById("scoreContainer");

    var numbers = Array.from(taskContainer.children).map(block => parseInt(block.innerText));

    var isAscending = numbers.every((num, index) => index === 0 || num < numbers[index - 1]);
    for(let i = 0; i<numbers.length; i++){
        console.log(numbers[i]);
    }

    if (isAscending && numbers.length === 10 && timeLeft !== 0) {
        document.getElementById('nextBtn').style.opacity = 1;
        score.innerHTML = 'Очки: 10';
        const user = localStorage.getItem("inputValue");
        const userScore = Number(localStorage.getItem(user));
        const allUserScore = userScore + 10;
        localStorage.setItem(user, allUserScore);
    } else if (timeLeft <= 0){
        score.innerHTML = 'Вы не успели! Очки: 0';
    } else {
        score.innerHTML = 'Цифры не идут в порядке убывания! Очки: 0';
    }
    score.style.opacity = 1;
    timeLeft = 0;
});

document.addEventListener("DOMContentLoaded", function (event) {
    placeBlocks();
});

document.getElementById("restartBtn").addEventListener("click", function () {
    location.reload();
});

var timeLeft = 25;
function startTimer() {

    timer = setInterval(function () {
        timeLeft--;
        if (timeLeft < 10) {
            document.getElementById("timer").innerHTML = "Время: " + "0:0" + timeLeft;
        } else {
            document.getElementById("timer").innerHTML = "Время: " + "0:" + timeLeft;
        }
        if (timeLeft <= 0) {
            clearInterval(timer);
            for(let i = 0; i < blockContainer.children.length; i++) {
                blockContainer.children[i].style.animationPlayState = 'paused';
            }
            const score = document.getElementById("scoreContainer");
            var numbers = Array.from(taskContainer.children).map(block => parseInt(block.innerText));
            var isAscending = numbers.every((num, index) => index === 0 || num < numbers[index - 1]);
            if (isAscending && numbers.length === 10) {
                document.getElementById('nextBtn').style.opacity = 1;
                score.innerHTML = 'Очки: 10';
                const user = localStorage.getItem("inputValue");
                const userScore = Number(localStorage.getItem(user));
                const allUserScore = userScore + 10;
                localStorage.setItem(user, allUserScore);
            } else {
                score.innerHTML = 'Вы не успели! Очки: 0';
            }
            score.style.opacity = 1;
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