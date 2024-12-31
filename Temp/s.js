// Enhanced Task Management Logic
const taskList = document.getElementById('taskList');
const reassignForm = document.getElementById('reassignForm');
const reassignTaskForm = document.getElementById('reassignTaskForm');

taskList.addEventListener('click', function (event) {
    const task = event.target.closest('.task');
    if (!task) return;

    const taskId = task.getAttribute('data-task-id');
    const button = event.target.closest('button');
    
    if (!button) return;

    if (button.classList.contains('in-progress')) {
        showNotification(`Task ${taskId} is now in progress.`, 'info');
    } else if (button.classList.contains('done')) {
        showNotification(`Task ${taskId} is marked as done.`, 'success');
    } else if (button.classList.contains('decline')) {
        showNotification(`Task ${taskId} is declined.`, 'warning');
    } else if (button.classList.contains('reassign')) {
        toggleReassignForm();
        reassignTaskForm.setAttribute('data-task-id', taskId);
    }
});

reassignTaskForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const taskId = reassignTaskForm.getAttribute('data-task-id');
    const assignedTo = document.getElementById('assignTo').value;
    
    showNotification(`Task ${taskId} has been reassigned to ${assignedTo}`, 'success');
    toggleReassignForm();
});

function toggleReassignForm() {
    reassignForm.classList.toggle('show');
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${
            type === 'success' ? '#28a745' : 
            type === 'warning' ? '#ffc107' : 
            type === 'info' ? '#17a2b8' : '#dc3545'
        };
        color: white;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.5s ease;
    `;
    notification.textContent = message;

    // Append to body
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(notification), 500);
    }, 3000);
}