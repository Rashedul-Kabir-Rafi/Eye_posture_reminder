chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startReminder") {
        chrome.alarms.create("reminderAlarm", { delayInMinutes: message.minutes, periodInMinutes: message.minutes });
        chrome.storage.local.set({ isRunning: true });
    }
    if (message.action === "stopReminder") {
        chrome.alarms.clear("reminderAlarm");
        chrome.storage.local.set({ isRunning: false });
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "reminderAlarm") {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "clock.png",
            title: "Eye & Posture Reminder ⏳",
            message: "Time for a break! Blink, stretch, and adjust your posture.",
            priority: 2
        });

        chrome.storage.local.get("reminderTime", (data) => {
            if (data.reminderTime) {
                let endTime = Date.now() + data.reminderTime * 60000;
                chrome.storage.local.set({ endTime });
            }
        });
    }
});

