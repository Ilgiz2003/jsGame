let draggedObj;
const blockContainer = document.getElementById("blockContainer");
const taskContainer = document.getElementById("taskContainer");

const getRandomPosition = (containerWidth, containerHeight) => {
    const containerRect = blockContainer.getBoundingClientRect();
    let posX = Math.floor(Math.random() * containerRect.right);
    let posY = Math.floor(Math.random() * containerRect.bottom);
    while (posX > containerWidth - 60 || posY > containerHeight - 60) {
        posX = Math.floor(Math.random() * containerWidth);
        posY = Math.floor(Math.random() * containerHeight);
    }
    return [posX, posY];
};

const checkOverlap = (posX, posY, blocks) => {
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
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
};

const placeBlocks = () => {
    let idCounter = 0;
    var randSize = Math.floor(Math.random() * 5) + 10;
    for (let i = 0; i < randSize; i++) {
        let block = document.createElement("div");
        block.className = "block";
        block.innerHTML = Math.floor(Math.random() * 15).toString();
        block.draggable = true;
        block.id = `block${idCounter}`;
        idCounter++;
        block.addEventListener("dragstart", (event) => {
            draggedObj = event.target;
            event.dataTransfer.setData("text/plain", draggedObj.id);
        });
        taskContainer.appendChild(block);
    }
};

const handleDrop = (event) => {
    event.preventDefault();
    const { dataTransfer } = event;
    const id = dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(id);

    const blockNumber = parseInt(draggedElement.innerHTML);
    const isEven = blockNumber % 2 === 0;

    if (event.currentTarget.id === "taskContainer") {
        const taskContainer = event.currentTarget;
        taskContainer.style.position = "absolute";
        draggedElement.style.position = "relative";
        draggedElement.style.left = "0px";
        draggedElement.style.top = "0px";
        taskContainer.appendChild(draggedElement);
    } else {
        const evenBlocksContainer = event.currentTarget;
        evenBlocksContainer.style.position = "relative";
        draggedElement.style.position = "absolute";
        draggedElement.style.left =
            event.clientX - evenBlocksContainer.getBoundingClientRect().left + "px";
        draggedElement.style.top =
            event.clientY - evenBlocksContainer.getBoundingClientRect().top + "px";
        evenBlocksContainer.appendChild(draggedElement);
    }
};

taskContainer.addEventListener("drop", handleDrop);
taskContainer.addEventListener("dragover", function (event) {
    event.preventDefault();
});


document.getElementById("checkBtn").addEventListener("click", () => {
    clearInterval(timer);
    const score = document.getElementById("scoreContainer");
    const firstContainer = document.getElementById('evenBlocksContainer');
    const secondContainer = document.getElementById('oddBlocksContainer');
    var evenCheck = 1;
    for(let i = 0; i < firstContainer.children.length; i++){
        if(firstContainer.children[i].innerHTML % 2 !== 0){
            evenCheck = 0;
        }
    }
    var oddCheck = 1;
    for(let i = 0; i < secondContainer.children.length; i++){
        if(secondContainer.children[i].innerHTML % 2 === 0){
            oddCheck = 0;
        }
    }
    if(evenCheck === 0 || oddCheck === 0 || taskContainer.children.length !== 0 || timeLeft === 0){
        score.style.opacity = 1;
        score.innerHTML = 'Вы не выполнили задание! Очки: 0';
    } else {
        document.getElementById('nextBtn').style.opacity = 1;
        score.style.opacity = 1;
        score.innerHTML = 'Очки: 15';
        const user = localStorage.getItem("inputValue");
        const userScore = Number(localStorage.getItem(user));
        const allUserScore = userScore + 15;
        localStorage.setItem(user, allUserScore);
    }
    timeLeft = 0;
});

document.addEventListener("DOMContentLoaded", () => {
    placeBlocks();
});

document.getElementById("restartBtn").addEventListener("click", () => {
    location.reload();
});

const evenBlocksContainer = document.getElementById("evenBlocksContainer");
const oddBlocksContainer = document.getElementById("oddBlocksContainer");

evenBlocksContainer.addEventListener("dragover", (event) => {
    event.preventDefault();
});

oddBlocksContainer.addEventListener("dragover", (event) => {
    event.preventDefault();
});

evenBlocksContainer.addEventListener("drop", handleDrop);
oddBlocksContainer.addEventListener("drop", handleDrop);

var  timeLeft = 20;
const startTimer = () => {

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerHTML = `Время: ${
            timeLeft < 10 ? "0:0" : "0:"
        }${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            const score = document.getElementById("scoreContainer");
            const firstContainer = document.getElementById('evenBlocksContainer');
            const secondContainer = document.getElementById('oddBlocksContainer');
            var evenCheck = 1;
            for(let i = 0; i < firstContainer.children.length; i++){
                if(firstContainer.children[i].innerHTML % 2 !== 0){
                    evenCheck = 0;
                }
            }
            var oddCheck = 1;
            for(let i = 0; i < secondContainer.children.length; i++){
                if(secondContainer.children[i].innerHTML % 2 === 0){
                    oddCheck = 0;
                }
            }
            if(evenCheck === 0 || oddCheck === 0 || taskContainer.children.length !== 0){
                score.style.opacity = 1;
                score.innerHTML = 'Вы не выполнили задание! Очки: 0';
            } else {
                document.getElementById('nextBtn').style.opacity = 1;
                score.style.opacity = 1;
                score.innerHTML = 'Очки: 15';
                const user = localStorage.getItem("inputValue");
                const userScore = Number(localStorage.getItem(user));
                const allUserScore = userScore + 15;
                localStorage.setItem(user, allUserScore);
            }
        }
    }, 1000);
};

startTimer();

document.getElementById('levelBtn').addEventListener('click', function() {
    window.location.href = '../../selectLevelPage/selectLevel.html';
});

document.getElementById('nextBtn').addEventListener('click', function() {
    const levels = ['level1', 'level2', 'level3'];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    window.location.href = '../' + randomLevel + '/' + randomLevel + '.html';
});
