document.getElementById('easyBtn').addEventListener('click', function() {
    const levels = ['level1', 'level2', 'level3'];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    window.location.href = '../easyLevel/' + randomLevel + '/' + randomLevel + '.html';
});

document.getElementById('mediumBtn').addEventListener('click', function() {
    const levels = ['level1', 'level2', 'level3'];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    window.location.href = '../mediumLevel/' + randomLevel + '/' + randomLevel + '.html';
});

document.getElementById('hardBtn').addEventListener('click', function() {
    const levels = ['level1', 'level2', 'level3'];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    window.location.href = '../hardLevel/' + randomLevel + '/' + randomLevel + '.html';
});

document.getElementById('menuBtn').addEventListener('click', function() {
    window.location.href = '../index.html';
});