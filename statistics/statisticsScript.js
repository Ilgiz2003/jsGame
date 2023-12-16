let keys = Object.keys(localStorage);

let items = [];

for (let i = 0; i < keys.length; i++) {
    if (keys[i] !== 'inputValue') {
        items.push({ key: keys[i], value: localStorage.getItem(keys[i]) });
    }
}

// —ортируем массив по убыванию значени€
items.sort((a, b) => b.value - a.value);

// ѕолучаем tbody, куда будем добавл€ть строки таблицы
let tableBody = document.getElementById('data-table');

// ƒобавл€ем строки в таблицу
items.forEach(item => {
    let row = document.createElement('tr');
    let keyCell = document.createElement('td');
    let valueCell = document.createElement('td');

    keyCell.textContent = item.key;
    valueCell.textContent = item.value;

    row.appendChild(keyCell);
    row.appendChild(valueCell);

    tableBody.appendChild(row);
});