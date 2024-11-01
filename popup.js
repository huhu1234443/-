document.addEventListener('DOMContentLoaded', function() {
    const todoList = document.getElementById('todo-list');
    const addRowButton = document.getElementById('add-row');
    const saveButton = document.getElementById('save');
    const startButton = document.getElementById('start');
    const alertSound = document.getElementById('alert-sound');
    const deletebutton = document.getElementById('delete');
    let qq=1;

    // Load saved tasks
    chrome.storage.sync.get(['tasks'], function(result) {
        const tasks = result.tasks || [];
        tasks.forEach(task => addRow(task.event, task.hours, task.minutes, task.seconds));
    });

    // Add a new row
    addRowButton.addEventListener('click', function() {
        addRow('', '', '', '');
        
    });
    deletebutton.addEventListener('click', function() {
        deleteRow();
    });

    // Save tasks
    saveButton.addEventListener('click', function() {
        const tasks = [];
        todoList.querySelectorAll('.task-row').forEach(row => {
            const event = row.querySelector('.event').value;
            const hours = parseInt(row.querySelector('.hours').value, 10) || 0;
            const minutes = parseInt(row.querySelector('.minutes').value, 10) || 0;
            const seconds = parseInt(row.querySelector('.seconds').value, 10) || 0;
            if (event) {
                tasks.push({ event, hours, minutes, seconds });
            }
        });
        chrome.storage.sync.set({ tasks }, function() {
            alert('Tasks saved!');
        });
    });

    // Start timer
    startButton.addEventListener('click', function() {
        const tasks = [];
        todoList.querySelectorAll('.task-row').forEach(row => {
            const event = row.querySelector('.event').value;
            const hours = parseInt(row.querySelector('.hours').value, 10) || 0;
            const minutes = parseInt(row.querySelector('.minutes').value, 10) || 0;
            const seconds = parseInt(row.querySelector('.seconds').value, 10) || 0;
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;
            if (event && totalSeconds > 0) {
                tasks.push({ event, totalSeconds });
            }
        });

        if (tasks.length > 0) {
            chrome.storage.sync.set({ tasks }, () => {
                setNextAlarm(tasks[0]);
            });
        }
    });

    function setNextAlarm(task) {
        const delayInMinutes = task.totalSeconds / 60;
        chrome.alarms.create('todoTimer', { delayInMinutes });
    }

    function addRow(event = '', hours = '', minutes = '', seconds = '') {
        qq++;
        const row = document.createElement('div');
        row.className = 'task-row';
        row.id=qq;
        row.innerHTML = `
            <input type="text" class="event" placeholder="Event" value="${event}">
            <input type="number" class="hours" placeholder="H" value="${hours}" min="0">
            <input type="number" class="minutes" placeholder="M" value="${minutes}" min="0" max="59">
            <input type="number" class="seconds" placeholder="S" value="${seconds}" min="0" max="59">
        `;
        todoList.appendChild(row);
        
    }
    function deleteRow(){
        const div = document.getElementById(`${qq}`);
    
    if (div) {
        div.parentNode.removeChild(div);
    } else {
        console.log('Element not found');
    }
    qq--;
    }
});