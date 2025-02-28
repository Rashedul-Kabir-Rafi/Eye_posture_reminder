document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("toggleButton");
    const timeInput = document.getElementById("timeInput");
    const countdownDisplay = document.getElementById("countdown");

    let interval;

    chrome.storage.local.get(["reminderTime", "isRunning", "endTime"], (data) => {
        if (data.isRunning) {
            button.textContent = "Stop";
            button.classList.add("stop");
            updateCountdown(data.endTime);
        }
    });

    button.addEventListener("click", () => {
        chrome.storage.local.get("isRunning", (data) => {
            if (data.isRunning) {
                stopReminder();
            } else {
                startReminder();
            }
        });
    });

    function startReminder() {
        let minutes = parseInt(timeInput.value);
        if (isNaN(minutes) || minutes <= 0) {
            alert("Please enter a valid number!");
            return;
        }

        let endTime = Date.now() + minutes * 60000;
        chrome.storage.local.set({ reminderTime: minutes, isRunning: true, endTime });

        chrome.runtime.sendMessage({ action: "startReminder", minutes });

        button.textContent = "Stop";
        button.classList.add("stop");

        updateCountdown(endTime);
    }

    function stopReminder() {
        chrome.storage.local.set({ isRunning: false });
        chrome.runtime.sendMessage({ action: "stopReminder" });

        button.textContent = "Start";
        button.classList.remove("stop");
        countdownDisplay.textContent = "⏳ Time left: Not started";

        clearInterval(interval);
    }

    function updateCountdown(endTime) {
        clearInterval(interval);
        interval = setInterval(() => {
            let timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            countdownDisplay.textContent = `⏳ Time left: ${minutes}m ${seconds}s`;

            if (timeLeft <= 0) {
                clearInterval(interval);
            }
        }, 1000);
    }
});
