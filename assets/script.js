const THEME_STORAGE_KEY = 'rockit-vision-theme';

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }
}

// Run immediately to avoid flashing
initTheme();

function initApp() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    let ws;

    let isStreaming = false;
    const startBtn = document.getElementById('start-camera-btn');
    const container = document.getElementById('camera-container');
    const fpsBadge = document.getElementById('fps-counter');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (!isStreaming) startCamera();
            else stopCamera();
        });
    }

    function startCamera() {
        if (startBtn) {
            startBtn.innerHTML = 'Carregando...';
            startBtn.disabled = true;
        }
        navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        }).then(stream => {
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                canvas.width = tempCanvas.width = video.videoWidth;
                canvas.height = tempCanvas.height = video.videoHeight;
                canvas.style.display = 'block';
                if (fpsBadge) fpsBadge.style.display = 'block';
                
                isStreaming = true;
                if (startBtn) {
                    startBtn.innerHTML = '⏹ Desligar Câmera';
                    startBtn.classList.add('active');
                    startBtn.disabled = false;
                }
                if (container) container.classList.add('active');

                initWS();
            };
        }).catch(err => {
            console.error("Camera error:", err);
            alert("Não foi possível acessar a câmera. Verifique as permissões.");
            if (startBtn) {
                startBtn.innerHTML = '📷 Ligar Câmera';
                startBtn.disabled = false;
            }
        });
    }

    function stopCamera() {
        isStreaming = false;
        if (ws) {
            ws.close();
            ws = null;
        }
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
            video.srcObject = null;
        }
        
        canvas.style.display = 'none';
        if (fpsBadge) fpsBadge.style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (startBtn) {
            startBtn.innerHTML = '📷 Ligar Câmera';
            startBtn.classList.remove('active');
        }
        if (container) container.classList.remove('active');

        const labelContainer = document.getElementById('gesture-container');
        if (labelContainer) labelContainer.innerHTML = '';
        const gestureImg = document.getElementById('gesture-image');
        if (gestureImg) {
            gestureImg.style.display = 'none';
            gestureImg.classList.remove('active-gesture');
        }
    }

    function initWS() {
        const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
        ws = new WebSocket(`${protocol}//${location.host}/ws`);
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0);

                // Update FPS
                const fpsCounter = document.getElementById('fps-counter');
                if (fpsCounter && data.fps !== undefined) {
                    fpsCounter.textContent = `FPS: ${data.fps}`;
                }

                // Update labels
                const labelContainer = document.getElementById('gesture-container');
                if (labelContainer) {
                    if (data.labels.length === 0) {
                        labelContainer.innerHTML = '<div class="label-item"><span class="name">Sem gestos detectados</span></div>';
                    } else {
                        labelContainer.innerHTML = data.labels.map(l =>
                            `<div class="label-item">
                                <span class="name">${l.hand}: ${l.gesture}</span>
                                <span class="prob">${(l.probability * 100).toFixed(1)}%</span>
                             </div>`
                        ).join('');
                    }
                }

                const gestureImg = document.getElementById('gesture-image');
                if (gestureImg) {
                    if (data.gesture_image) {
                        gestureImg.src = `/assets/images/gestures/${data.gesture_image}`;
                        gestureImg.style.display = 'block';
                        gestureImg.classList.add('active-gesture');
                    } else {
                        gestureImg.style.display = 'none';
                        gestureImg.classList.remove('active-gesture');
                    }
                }

                sendFrame();
            };
            img.src = data.image;
        };
        ws.onopen = sendFrame;
        ws.onclose = () => setTimeout(initWS, 1000);
    }

    const qualitySlider = document.getElementById('quality-slider');
    const qualityValue = document.getElementById('quality-value');
    const drawLandmarksCb = document.getElementById('draw-landmarks-cb');
    let currentQuality = 0.6;

    if (qualitySlider && qualityValue) {
        qualitySlider.oninput = function () {
            currentQuality = parseFloat(this.value);
            qualityValue.textContent = Math.round(currentQuality * 100) + '%';
        };
    }

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem(THEME_STORAGE_KEY, newTheme);
            applyTheme(newTheme);
        });
        
        // Ensure icon matches current state dynamically upon elements loading
        const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
        themeToggle.textContent = initialTheme === 'dark' ? '☀️' : '🌙';
    }

    function sendFrame() {
        if (ws && ws.readyState === WebSocket.OPEN && isStreaming) {
            tempCtx.drawImage(video, 0, 0);
            const drawLandmarks = drawLandmarksCb ? drawLandmarksCb.checked : true;
            ws.send(JSON.stringify({
                image: tempCanvas.toDataURL('image/jpeg', currentQuality),
                draw_landmarks: drawLandmarks
            }));
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}