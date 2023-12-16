document.getElementById('startBtn').addEventListener('click', function() {
    var inputValue = document.getElementById('input').value.trim();

    if (inputValue === '') {
        alert('Please input name!');
    } else {
        if(localStorage.getItem(inputValue) == null){
            localStorage.setItem(inputValue, '0');
        }
        window.location.href = '../selectLevelPage/selectLevel.html';
        localStorage.setItem('inputValue', inputValue);
    }
});