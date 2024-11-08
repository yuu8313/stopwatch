class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.isRunning = false;
        this.intervalId = null;
        this.laps = [];
        
        // DOM要素
        this.displayElements = {
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            milliseconds: document.getElementById('milliseconds')
        };
        
        // ボタン
        this.buttons = {
            start: document.getElementById('startBtn'),
            stop: document.getElementById('stopBtn'),
            reset: document.getElementById('resetBtn'),
            lap: document.getElementById('lapBtn'),
            popup: document.getElementById('popupBtn')
        };
        
        this.formatSelector = document.getElementById('formatSelector');
        this.lapsDisplay = document.getElementById('lapsDisplay');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.buttons.start.addEventListener('click', () => this.start());
        this.buttons.stop.addEventListener('click', () => this.stop());
        this.buttons.reset.addEventListener('click', () => this.reset());
        this.buttons.lap.addEventListener('click', () => this.recordLap());
        this.buttons.popup.addEventListener('click', () => this.openPopup());
        this.formatSelector.addEventListener('change', () => this.updateDisplay());
    }

    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.intervalId = setInterval(() => this.updateTime(), 10);
            this.isRunning = true;
            this.showNotification('ストップウォッチを開始しました ▶️');
        }
    }

    stop() {
        if (this.isRunning) {
            clearInterval(this.intervalId);
            this.isRunning = false;
            this.showNotification('ストップウォッチを停止しました ⏸');
        }
    }

    reset() {
        this.stop();
        this.elapsedTime = 0;
        this.laps = [];
        this.updateDisplay();
        this.updateLapsDisplay();
        this.showNotification('ストップウォッチをリセットしました 🔄');
    }

    updateTime() {
        this.elapsedTime = Date.now() - this.startTime;
        this.updateDisplay();
    }

    updateDisplay() {
        const time = this.formatTime(this.elapsedTime);
        Object.entries(time).forEach(([key, value]) => {
            if (this.displayElements[key]) {
                this.displayElements[key].textContent = value;
            }
        });
    }

    formatTime(ms) {
        const format = this.formatSelector.value;
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor((ms % 1000));

        return {
            hours: format === 'full' ? hours.toString().padStart(2, '0') : '',
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
            milliseconds: milliseconds.toString().padStart(3, '0')
        };
    }

    recordLap() {
        if (this.isRunning) {
            this.laps.push(this.elapsedTime);
            this.updateLapsDisplay();
            this.showNotification('ラップタイムを記録しました ⏱');
        }
    }

    updateLapsDisplay() {
        this.lapsDisplay.innerHTML = '';
        this.laps.forEach((lapTime, index) => {
            const lapElement = document.createElement('div');
            lapElement.className = 'lap-item';
            const formattedTime = this.formatTime(lapTime);
            lapElement.innerHTML = `
                <span>ラップ ${index + 1}</span>
                <span>${formattedTime.hours}:${formattedTime.minutes}:${formattedTime.seconds}.${formattedTime.milliseconds}</span>
            `;
            this.lapsDisplay.appendChild(lapElement);
        });
    }

    openPopup() {
        const popupWindow = window.open('', 'StopwatchPopup', 'width=400,height=300');
        popupWindow.document.write(`
            <html>
                <head>
                    <title>ストップウォッチ</title>
                    <style>
                        body {
                            background: #1a1a1a;
                            color: white;
                            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                        }
                        .time {
                            font-size: 2.5rem;
                            font-weight: bold;
                        }
                    </style>
                </head>
                <body>
                    <div class="time" id="popupTime"></div>
                    <script>
                        function updatePopupTime() {
                            const time = window.opener.document.querySelector('.time-display').textContent;
                            document.getElementById('popupTime').textContent = time;
                        }
                        setInterval(updatePopupTime, 10);
                    </script>
                </body>
            </html>
        `);
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }
}

// PWA対応
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
            console.log('ServiceWorker registration successful');
        })
        .catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
}

// ストップウォッチのインスタンスを作成
const stopwatch = new Stopwatch();