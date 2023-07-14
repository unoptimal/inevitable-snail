let snailStatus = {
    x: Math.floor(Math.random() * 683),
    y: Math.floor(Math.random() * 384),
    visible: false,
    moving: false,
    stepSize: 1, //pixels
    frequency: 1800000, //this is in milliseconds, so 30 minutes
    caught: false,
    startTime: null,
    endTime:null,
    movingInterval: null,
    totalDistance: 0
};

let cursorPosition = null;

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({ 'snailStatus': snailStatus });
});

function startSnail() {
    if (!snailStatus.moving) {
        snailStatus.moving = true;
        if (!snailStatus.startTime && !snailStatus.caught) {
            snailStatus.startTime = new Date().toLocaleString();
        }
        snailStatus.endTime = null;
        snailStatus.movingInterval = setInterval(updateSnailPosition, snailStatus.frequency);
        chrome.storage.local.set({ 'snailStatus': snailStatus });
    }
    return true;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'cursorPosition') {
        cursorPosition = request.cursorPosition;
    }
    if (request.message === 'startMovement') {
        startSnail();
    }
    if (request.message === 'toggleVisibility') {
        toggleVisibility();
    }
    if (request.message === 'snailCaught') {
        snailStatus.x = Math.floor(Math.random() * 683);
        snailStatus.y = Math.floor(Math.random() * 384);
        if (!snailStatus.catchEvents) {
            snailStatus.catchEvents = [];
        }
        chrome.storage.local.set({ 'snailStatus': snailStatus });
    }
});


    function updateSnailPosition() {
        chrome.storage.local.get('snailStatus', function(data) {
            let newX, newY;
    
            if (cursorPosition) {
                let dx = cursorPosition.x - data.snailStatus.x;
                let dy = cursorPosition.y - data.snailStatus.y;
    
                let distance = Math.sqrt(dx*dx + dy*dy);

                if (distance <= 1) {  
                    snailStatus.visible = true;
                } else {
                    snailStatus.visible = false;
                }
    
                if (distance > snailStatus.stepSize) {
                    dx /= distance;
                    dy /= distance;
    
                    newX = data.snailStatus.x + dx * snailStatus.stepSize;
                    newY = data.snailStatus.y + dy * snailStatus.stepSize;
                    snailStatus.totalDistance += snailStatus.stepSize;

                } else {
                    snailStatus.totalDistance += distance;
                    newX = cursorPosition.x;
                    newY = cursorPosition.y;
                }
        }

            if (cursorPosition) {
                let hitBoxSize = 1; 
                let hitBoxX = newX - hitBoxSize/2;
                let hitBoxY = newY - hitBoxSize/2;

                if (cursorPosition.x >= hitBoxX && cursorPosition.x <= hitBoxX + hitBoxSize &&
                    cursorPosition.y >= hitBoxY && cursorPosition.y <= hitBoxY + hitBoxSize) {
                    
                        snailStatus.caught = true;
                        snailStatus.moving = false;
                        let endTime = new Date().toLocaleString();
                        snailStatus.endTime = endTime;

                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {redirect: true});
                        // chrome.tabs.sendMessage(tabs[0].id, {message: 'snailCaught'});
                    });

                    snailStatus.x = Math.floor(Math.random() * 683);
                    snailStatus.y = Math.floor(Math.random() * 384);

                    if(snailStatus.caught) {
                        clearInterval(snailStatus.movingInterval);
                        snailStatus.movingInterval = null;
                    }

                    if (!snailStatus.catchEvents) {
                        snailStatus.catchEvents = [];
                    }
                    snailStatus.catchEvents.push({start: snailStatus.startTime, end: endTime});

                }
            }

            snailStatus = {...snailStatus, x: newX, y: newY};

            chrome.storage.local.set({ 'snailStatus': snailStatus });
        });
        
    }

    function toggleVisibility() {
        snailStatus.visible = !snailStatus.visible;
        chrome.storage.local.set({ 'snailStatus': snailStatus });
    }


        // if (request.message === 'updateSettings') {
        //     snailStatus.stepSize = Number(request.newSettings.step);
        //     snailStatus.frequency = Number(request.newSettings.speed) * 60 * 1000; // convert minutes to milliseconds
        //     if (snailStatus.moving) { // if snail is currently moving, restart the interval with new speed
        //         clearInterval(snailTimer);
        //         updateSnailPosition(); // Move snail immediately
        //         snailTimer = setInterval(updateSnailPosition, snailStatus.frequency);
        //     }
        // }        
        // if (request.message === 'toggleMovement') {
        //     toggleSnail();
        // }
        // if (request.message === 'toggleVisibility') {
        //     toggleVisibility();
        // }

        // if (request.message === 'cursorPosition') {
        //     cursorPosition = request.cursorPosition;
        // }

        // if (request.message === 'resetSettings') {
        //     snailStatus.stepSize = 1;
        //     snailStatus.frequency = 1800000;
        //     chrome.storage.local.set({ 'snailStatus': snailStatus });
        // }

        // if (request.message === 'applyChangesClicked') {
        //     let newSettings = {
        //         stepSize: Number(document.getElementById('stepSizeInput').value),
        //         frequency: Number(document.getElementById('frequencyInput').value) * 60 * 1000
        //     };
        
        //     if (newSettings.stepSize !== currentSettings.stepSize || newSettings.frequency !== currentSettings.frequency) {
        //         currentSettings = newSettings;
        
        //         chrome.runtime.sendMessage({
        //             message: 'updateSettings',
        //             newSettings: currentSettings
        //         });
        //     } else {
        //         console.log('Settings are the same, no changes applied.');
        //     }
        // }

    // function toggleSnail() {
    //     snailStatus.moving = !snailStatus.moving;
    //     if (snailStatus.moving) {
    //         snailStatus.visible = true;
    //         snailTimer = setInterval(updateSnailPosition, snailStatus.frequency);
    //     } else {
    //         clearInterval(snailTimer);
    //         snailTimer = null;
    //         snailStatus.visible = false; 
    //     }
    //     chrome.storage.local.set({ 'snailStatus': snailStatus });
    // }

 // let currentSettings = {
    //     stepSize: snailStatus.stepSize,
    //     frequency: snailStatus.frequency
    // };

    