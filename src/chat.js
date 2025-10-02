// Get necessary DOM elements
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const sendButton = chatForm.querySelector('button');
const chatWindow = document.getElementById('chat-window');
const loadingIndicator = document.getElementById('loading-indicator');

// --- Helper Functions for UI State ---

function toggleLoading(show) {
    if (show) {
        // Show spinner and disable input/button
        loadingIndicator.classList.remove('hidden');
        userInput.disabled = true;
        sendButton.disabled = true;
        userInput.placeholder = "Waiting for bot response...";
    } else {
        // Hide spinner and enable input/button
        loadingIndicator.classList.add('hidden');
        userInput.disabled = false;
        sendButton.disabled = false;
        userInput.placeholder = "Ask about bookings, amenities, or directions...";
    }
    // Always scroll to the bottom when state changes
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function appendMessage(text, sender) {
    const msgElement = document.createElement('p');
    msgElement.classList.add(sender + '-message');
    msgElement.innerHTML = text.replace(/\n/g, '<br>'); // Handle new lines from bot response
    chatWindow.appendChild(msgElement);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll
}


// --- Main Form Submission Handler ---

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const message = userInput.value.trim();
    if (!message) return;

    // 1. Display user message and clear input
    appendMessage(message, 'user');
    userInput.value = '';

    // 2. Activate loading state
    toggleLoading(true);

    // 3. Fetch response from Netlify Function
    try {
        const response = await fetch('/.netlify/functions/hotel-bot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });
        
        const data = await response.json();
        
        // 4. Display bot response
        if (response.ok) {
            appendMessage(data.reply, 'bot');
        } else {
            // Handle HTTP errors or function errors
            appendMessage(`Error: ${data.reply || 'Could not reach the AI service.'}`, 'bot-error');
        }
        
    } catch (error) {
        console.error('Network or Fetch Error:', error);
        appendMessage("Sorry, I'm having trouble connecting to the server. Please check your connection.", 'bot-error');
    } finally {
        // 5. Deactivate loading state and re-enable controls
        toggleLoading(false);
        userInput.focus(); // Put cursor back in the input field
    }
});
