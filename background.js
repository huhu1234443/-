chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'todoTimer') {
        chrome.storage.sync.get(['tasks'], (result) => {
            const tasks = result.tasks || [];
            if (tasks.length > 0) {
                const currentTask = tasks.shift(); // 移除当前任务
                const nextTaskEvent = tasks.length > 0 ? tasks[0].event : '今天的任务都完成了'; // 获取下一个任务的事件

                // 创建通知
                chrome.notifications.create({
                    type: 'image',
                    iconUrl: 'speed.png', 
                    title: '简易任务表',
                    message: `是时候去做: ${nextTaskEvent}`,
                    imageUrl: 'speed.png' 
                });


                // 更新任务列表并保存
                chrome.storage.sync.set({ tasks }, () => {
                    if (tasks.length > 0) {
                        setNextAlarm(tasks[0]); // 设置下一个任务的闹钟
                    }
                });
            }
        });
    }
});

function setNextAlarm(task) {
    const delayInMinutes = Math.max(task.totalSeconds / 60, 0.5); // 确保至少为 30 秒
    chrome.alarms.create('todoTimer', { delayInMinutes });
}
