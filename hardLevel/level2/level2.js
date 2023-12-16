var draggedObj;
var blockContainer = document.getElementById("blockContainer");
var taskContainer = document.getElementById("taskContainer");

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
var idCounter = 0;
const arithmeticExpressions = [
    "((2+5)*3)-1",
    "8-(4+9)*2",
    "(6*(7-1))+5",
    "(9+3-5)*4",
    "((2*(4+5))-3)*2",
    "7-(3*(1+2))",
    "((6+2)*4)+9",
    "((9-7)+1)*3",
    "(4*(6-3))+8",
    "((8+2)-1)*5",
    "((3+2)*6)-4",
    "7-(4+8)*3",
    "(5*(9-8))+2",
    "((6+3)-2)*7",
    "((4+6)*2)-1"
];
const currentExpression = arithmeticExpressions[Math.floor(Math.random() * arithmeticExpressions.length)];
document.getElementById("task").innerHTML = 'Собери такое выражение ' + currentExpression;
function placeBlocks() {
    var blockContainer = document.getElementById("blockContainer");
    var containerRect = blockContainer.getBoundingClientRect();
    var positions = [];
    const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '(', ')'];
    for (var i = 0; i < array.length; i++) {
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
        block.innerHTML = array[i];
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

blockContainer.addEventListener("dragover", function (event) {
    event.preventDefault();
});

blockContainer.addEventListener("drop", function (event) {
    event.preventDefault();
    const { dataTransfer } = event;
    const id = dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(id);
    taskContainer.removeChild(draggedElement);
});
taskContainer.addEventListener("dragover", function (event) {
    event.preventDefault();
});

const handleDrop = (event) => {
    event.preventDefault();
    const { dataTransfer } = event;
    const id = dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(id);
    if (!taskContainer.contains(draggedElement)){
        const clone = draggedElement.cloneNode(true);
        blockContainer.appendChild(clone);
        clone.style.left = draggedElement.style.left;
        clone.style.top = draggedElement.style.top;
        clone.draggable = true;
        clone.id = "block" + idCounter;
        idCounter++;
        clone.addEventListener("dragstart", function (event) {
            draggedObj = event.target;
            event.dataTransfer.setData("text/plain", draggedObj.id);
        });
    }

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
    blockContainer.removeChild(draggedElement);
};

taskContainer.addEventListener("drop", handleDrop);

document.getElementById("checkBtn").addEventListener("click", () => {
    clearInterval(timer);
    const score = document.getElementById("scoreContainer");

    let combinedInnerHTML = '';

    for (let i = 0; i < taskContainer.children.length; i++) {
        const element = taskContainer.children[i];
        combinedInnerHTML += element.innerHTML;
    }

    if (combinedInnerHTML === currentExpression && timeLeft !== 0 && timeLeft !== 0) {
        document.getElementById('nextBtn').style.opacity = 1;
        score.innerHTML = 'Очки: 20';
        const user = localStorage.getItem("inputValue");
        const userScore = Number(localStorage.getItem(user));
        const allUserScore = userScore + 20;
        localStorage.setItem(user, allUserScore);
    } else {
        score.innerHTML = 'Вы не справились! Очки: 0';
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

var timeLeft = 40;
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
            const score = document.getElementById("scoreContainer");
            let combinedInnerHTML = '';

            for (let i = 0; i < taskContainer.children.length; i++) {
                const element = taskContainer.children[i];
                combinedInnerHTML += element.innerHTML;
            }
            if (combinedInnerHTML === currentExpression) {
                document.getElementById('nextBtn').style.opacity = 1;
                score.innerHTML = 'Очки: 20';
                const user = localStorage.getItem("inputValue");
                const userScore = Number(localStorage.getItem(user));
                const allUserScore = userScore + 20;
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