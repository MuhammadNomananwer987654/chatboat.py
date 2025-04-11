document.addEventListener('DOMContentLoaded', function() {
    const chatArea = document.getElementById('chatArea');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const cameraBtn = document.getElementById('cameraBtn');
    const micBtn = document.getElementById('micBtn');
    const keypadBtn = document.getElementById('keypadBtn');
    const cameraPreview = document.getElementById('cameraPreview');
    const micPreview = document.getElementById('micPreview');
    const virtualKeypad = document.getElementById('virtualKeypad');
    const video = document.getElementById('video');
    const captureBtn = document.getElementById('captureBtn');
    const stopRecordingBtn = document.getElementById('stopRecordingBtn');
    
    let stream = null;
    let mediaRecorder = null;
    let audioChunks = [];
    
    // Send message function
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            // Add user message to chat
            addMessage(message, 'user');
            userInput.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                const responses = [
                    "I understand your question about " + message,
                    "Thanks for sharing that information.",
                    "Let me check that for you...",
                    "Interesting point about " + message,
                    "I'll assist you with that."
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse, 'bot');
            }, 1000);
        }
    }
    
    // Add message to chat area
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender + '-message');
        messageDiv.textContent = text;
        chatArea.appendChild(messageDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
    }
    
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Camera functionality
    cameraBtn.addEventListener('click', async function() {
        if (cameraPreview.classList.contains('hidden')) {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                cameraPreview.classList.remove('hidden');
                micPreview.classList.add('hidden');
                virtualKeypad.classList.add('hidden');
            } catch (err) {
                addMessage("Could not access camera: " + err.message, 'bot');
            }
        } else {
            stopCamera();
        }
    });
    
    captureBtn.addEventListener('click', function() {
        // Create canvas to capture image
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        
        // Convert to image and add to chat
        const imageUrl = canvas.toDataURL('image/png');
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.maxWidth = '200px';
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add('user-message');
        messageDiv.appendChild(img);
        chatArea.appendChild(messageDiv);
        
        stopCamera();
        addMessage("I've received your image. How can I help with it?", 'bot');
    });
    
    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            video.srcObject = null;
        }
        cameraPreview.classList.add('hidden');
    }
    
    // Microphone functionality
    micBtn.addEventListener('click', async function() {
        if (micPreview.classList.contains('hidden')) {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];
                
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };
                
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks);
                    const audioUrl = URL.createObjectURL(audioBlob);
                    
                    // Create audio element and add to chat
                    const audio = document.createElement('audio');
                    audio.src = audioUrl;
                    audio.controls = true;
                    
                    const messageDiv = document.createElement('div');
                    messageDiv.classList.add('message');
                    messageDiv.classList.add('user-message');
                    messageDiv.appendChild(audio);
                    chatArea.appendChild(messageDiv);
                    
                    addMessage("I've received your audio message. How can I assist?", 'bot');
                };
                
                mediaRecorder.start();
                micPreview.classList.remove('hidden');
                cameraPreview.classList.add('hidden');
                virtualKeypad.classList.add('hidden');
            } catch (err) {
                addMessage("Could not access microphone: " + err.message, 'bot');
            }
        } else {
            stopRecording();
        }
    });
    
    stopRecordingBtn.addEventListener('click', stopRecording);
    
    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        micPreview.classList.add('hidden');
    }
    
    // Keypad functionality
    keypadBtn.addEventListener('click', function() {
        if (virtualKeypad.classList.contains('hidden')) {
            virtualKeypad.classList.remove('hidden');
            cameraPreview.classList.add('hidden');
            micPreview.classList.add('hidden');
        } else {
            virtualKeypad.classList.add('hidden');
        }
    });
    
    // Add keypad button functionality
    document.querySelectorAll('.key').forEach(button => {
        button.addEventListener('click', function() {
            userInput.value += this.textContent;
        });
    });
});