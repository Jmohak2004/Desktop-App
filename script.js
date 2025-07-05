document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Load tasks from local storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTaskToDOM(task.text, task.completed));
    }

    // Save tasks to local storage
    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            const taskTextElement = li.querySelector('.task-text');
            const text = taskTextElement ? taskTextElement.textContent : li.querySelector('input[type="text"]').value; // Handle edit mode
            tasks.push({
                text: text,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Add task to DOM
    function addTaskToDOM(taskText, isCompleted = false) {
        const li = document.createElement('li');
        
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;
        taskSpan.classList.add('task-text');
        li.appendChild(taskSpan);

        if (isCompleted) {
            li.classList.add('completed');
        }

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('task-actions');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        actionsDiv.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        actionsDiv.appendChild(deleteBtn);

        li.appendChild(actionsDiv);

        taskList.appendChild(li);

        // Event listeners for new task item
        taskSpan.addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTasks();
        });

        editBtn.addEventListener('click', () => {
            if (li.classList.contains('editing')) {
                // If already editing, save changes
                const editInput = li.querySelector('input[type="text"]');
                if (editInput) {
                    const newText = editInput.value.trim();
                    if (newText !== '') {
                        taskSpan.textContent = newText;
                    } else {
                        // Revert to old text if empty
                        taskSpan.textContent = taskText;
                    }
                    li.classList.remove('editing');
                    li.replaceChild(taskSpan, editInput);
                    editBtn.textContent = 'Edit';
                    saveTasks();
                }
            } else {
                // Enter edit mode
                li.classList.add('editing');
                const currentText = taskSpan.textContent;
                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.value = currentText;
                editInput.classList.add('edit-input');
                
                li.replaceChild(editInput, taskSpan);
                editInput.focus();
                editBtn.textContent = 'Save';

                editInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        editBtn.click(); // Trigger save
                    }
                });

                editInput.addEventListener('blur', () => {
                    // Auto-save or revert if focus lost (optional)
                    // editBtn.click(); // This would auto-save on blur
                });
            }
        });

        deleteBtn.addEventListener('click', () => {
            taskList.removeChild(li);
            saveTasks();
        });
    }

    // Add a new task
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTaskToDOM(taskText);
            saveTasks();
            taskInput.value = ''; // Clear input
        }
    });

    // Allow adding tasks with Enter key
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    // Initial load
    loadTasks();
});
