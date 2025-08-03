const socket = io();

const username = localStorage.getItem('username');
const token = localStorage.getItem('token');

if (!token || !username) {
    console.log("Token & username not received yet");
}

socket.emit('register', token);

// Clear no-messages placeholder when first message arrives
let hasMessages = false;

async function send() {
    const recipientUserName = document.getElementById('username').value;
    const message = document.getElementById('description').value;
    const sender = username;

    if (!recipientUserName.trim() || !message.trim()) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    console.log('Sending message:', recipientUserName, message, sender);

    const data = { message, recipientUserName, sender };
    socket.emit('chat-message', data);

    // Clear inputs after sending
    document.getElementById('description').value = '';
    showNotification('Message sent successfully!', 'success');
}

socket.on('private-message', (data) => {
    const { sender, message } = data;
    
    // Remove no-messages placeholder if it exists
    if (!hasMessages) {
        const noMessages = document.querySelector('.no-messages');
        if (noMessages) {
            noMessages.remove();
        }
        hasMessages = true;
    }
    
    const messagesArea = document.querySelector('.messages-area');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-item new';
    
    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    messageDiv.innerHTML = `
        <div class="message-sender">
            <i class="fas fa-user"></i>
            ${sender}
        </div>
        <div class="message-content">${escapeHtml(message)}</div>
        <div class="message-time">${currentTime}</div>
    `;
    
    messagesArea.appendChild(messageDiv);
    messagesArea.scrollTop = messagesArea.scrollHeight;
});

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Simple notification system
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#667eea'};
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Enter key support for textarea
document.getElementById('description').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        send();
    }
});
