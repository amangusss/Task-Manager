const userId = localStorage.getItem('userId');
const url = `https://657e1bc63e3f5b1894638681.mockapi.io/user/${userId}/task`;

const taskInput = document.getElementById('todo');
const taskBtn = document.querySelector(".bx-plus");
const taskList = document.getElementById('taskContainer');
const uncompleted = document.getElementById('currTask');
const completed = document.getElementById('compTask');
const allTask = document.getElementById('allTask');


document.addEventListener('DOMContentLoaded', async () => {
    main();
});

allTask.addEventListener("click", async () => {
    main();
});

completed.addEventListener("click", completedTasks);

uncompleted.addEventListener("click", uncompletedTasks);

taskBtn.addEventListener("click", showTask);

// Add keypress event listener to the text input and date input
taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        showTask();
    }
});

taskList.addEventListener("click", buttonCheck);

function saveData({id, text}) {

    // Check if both text and date are entered before saving
    if (text.trim() === "") {
        swal({
            title: "Error",
            text: "Please enter both task and due date!",
            icon: "error", 
        });
    } else {
        // // Create a new object representing the to-do task
        const task = {
            text: text,
            id: id,
            completed: false
        };

        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task)
        })
        .then(res => res.json())
        .catch(error => console.error("Error fetching data: ", error));
    }
};


let taskCount = 0;

function showTask() {
    const taskDesc = taskInput.value;

    taskCount ++;

    let div = document.createElement('div');
    div.className = "card";
    div.setAttribute('task-id',taskCount)
    
    let li = document.createElement('li');
    li.className = "taskContain";

    if(taskDesc === '') {
        Swal.fire("You must write something!");
    } else {
        li.innerText = taskDesc;
        div.append(li);

        saveData({id: taskCount, text: taskDesc});

        let check = document.createElement('button');
        check.innerHTML = '<i class="fas fa-check"></i>';
        check.className = 'btn check-btn';
        div.append(check);

        let del = document.createElement('button');
        del.innerHTML = '<i class="fas fa-trash"></i>';
        del.className = 'btn del-btn';
        div.append(del);

        taskList.append(div);

        // Clear the text and date inputs after saving
        taskInput.value = "";
    }
};

function buttonCheck(event) {
    const item = event.target;

    if(item.classList[1] === 'del-btn'){
        const taskId = item.parentElement.getAttribute('task-id');

        deleteTask(userId, taskId);

        item.parentElement.classList.add("fall");
    
        item.parentElement.addEventListener('transitionend', function () {
            item.parentElement.remove();
        });
    }

    if(item.classList[1] === 'check-btn'){
        item.parentElement.classList.toggle("completed");

        const taskId = item.parentElement.getAttribute('task-id');

        updateStatus(taskId, true);
    }
};

function updateStatus(taskId, completed) {
    if(!userId){
        console.error("User ID not found!");
        return;
    }

    const data = {
        completed: completed
    };

    fetch(`https://657e1bc63e3f5b1894638681.mockapi.io/user/${userId}/task/${taskId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data) 
    }).then(res => {
        if(!res.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log('Task status updated successfully');
        return res.json();
    }).then(data => {
        console.log(data);
    }).catch(error => {
        console.error('Error updating task status:', error);
    });
}

function deleteTask(userId, taskId) {
    if(!userId){
        console.error("User ID not found");
        return;
    }

    fetch(`https://657e1bc63e3f5b1894638681.mockapi.io/user/${userId}/task/${taskId}`,{
        method: 'DELETE'
    }).then(res => res.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error deleting task:', error)
    })
}

async function main(){
    const userId = localStorage.getItem('userId');

    if(!userId){
        console.error('User ID not found');
        return;
    }

    try {
        const task = await fetchUserTasks(userId);

        taskList.innerHTML = '';

        task.forEach(function(task) {
            let div = document.createElement('div');
            div.className = 'card';
            div.setAttribute('task-id', task.id);

            let li = document.createElement('li');
            li.innerText = task.text;
            li.className = 'taskContainer';
            div.append(li);

            let check = document.createElement('button');
            check.innerHTML = '<i class="fas fa-check"></i>';
            check.className = 'btn check-btn';
            div.append(check);

            let del = document.createElement('button');
            del.innerHTML = '<i class="fas fa-trash"></i>';
            del.className = 'btn del-btn';
            div.append(del);

            taskList.append(div);
        });
    } catch(error) {
        console.error('Error gettin tasks: ', error);
    }
}

async function fetchUserTasks(userId){
    if(!userId){
        console.error('User ID not found');
        return Promise.reject("User ID not found");
    }

    const endpoint = `https://657e1bc63e3f5b1894638681.mockapi.io/user/${userId}/task`;

    try {
        const response = await fetch(endpoint);
        if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);              
        }
        const data_1 = await response.json();
        console.log('Tasks retrieved successfully:', data_1);
        return data_1;
    } catch(error) {
        console.error('Error fetching tasks: ', error);
        throw error;
    }
}

function uncompletedTasks() {
    const link = new URL(`https://657e1bc63e3f5b1894638681.mockapi.io/user/${userId}/task?completed=false`);

    fetch(link, {
    method: 'GET',
    headers: {'content-type':'application/json'},
    }).then(res => {
    if (res.ok) {
        return res.json();
    }
    }).then(task => {
        taskList.innerHTML = '';

        task.forEach(function(task) {
            let div = document.createElement('div');
            div.className = 'card';
            div.setAttribute('task-id', task.id);

            let li = document.createElement('li');
            li.innerText = task.text;
            li.className = 'taskContainer';
            div.append(li);

            let check = document.createElement('button');
            check.innerHTML = '<i class="fas fa-check"></i>';
            check.className = 'btn check-btn';
            div.append(check);

            let del = document.createElement('button');
            del.innerHTML = '<i class="fas fa-trash"></i>';
            del.className = 'btn del-btn';
            div.append(del);

            taskList.append(div);
        });
    }).catch(error => {
        console.error('Error gettin tasks: ', error);
    })
};

function completedTasks() {
    const link = new URL(`https://657e1bc63e3f5b1894638681.mockapi.io/user/${userId}/task?completed=true`);
    
    fetch(link, {
    method: 'GET',
    headers: {'content-type':'application/json'},
    }).then(res => {
    if (res.ok) {
        return res.json();
    }
    }).then(task => {
        taskList.innerHTML = '';

        task.forEach(function(task) {
            let div = document.createElement('div');
            div.className = 'card';
            div.setAttribute('task-id', task.id);

            let li = document.createElement('li');
            li.innerText = task.text;
            li.className = 'taskContainer';
            div.append(li);

            let check = document.createElement('button');
            check.innerHTML = '<i class="fas fa-check"></i>';
            check.className = 'btn check-btn';
            div.append(check);

            let del = document.createElement('button');
            del.innerHTML = '<i class="fas fa-trash"></i>';
            del.className = 'btn del-btn';
            div.append(del);

            taskList.append(div);
        });
    }).catch(error => {
        console.error('Error gettin tasks: ', error);
    })
};
