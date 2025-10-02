document.getElementById('chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    if (!message) return;

    // 1. Display user message
    appendMessage(message, 'user');
    userInput.value = '';

    // 2. Fetch response from Netlify Function
    try {
        const response = await fetch('/.netlify/functions/hotel-bot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });
        
        const data = await response.json();
        
        // 3. Display bot response
        appendMessage(data.reply, 'bot');
        
    } catch (error) {
        console.error('Error fetching AI response:', error);
        appendMessage("Sorry, I'm having trouble connecting right now. Please try again.", 'bot error');
    }
});

function appendMessage(text, sender) {
    const chatWindow = document.getElementById('chat-window');
    const msgElement = document.createElement('p');
    msgElement.classList.add(sender + '-message');
    msgElement.textContent = text;
    chatWindow.appendChild(msgElement);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll
}
