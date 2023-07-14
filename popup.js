document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['snailStatus', 'startTime'], function(data) {

        let status0Div = document.getElementById('status0');
        let statusDiv = document.getElementById('status');
        let statusDiv05 = document.getElementById('status05');
        let status1Div = document.getElementById('status1');
        let status2Div = document.getElementById('status2');
        let startTimestampDiv = document.getElementById('startTimestamp');
        let endTimestampDiv = document.getElementById('endTimestamp');

        function updateUI() {
            if (data.snailStatus && data.snailStatus.moving) {
                document.getElementById('startButton').style.display = 'none';
                document.getElementById('toggleVisibility').style.display = 'none';
                document.getElementById('status0').style.display = 'none';
                document.getElementById('status05').style.display = 'none';
                document.getElementById('status1').style.display = 'none';
                document.getElementById('bsodLink').style.display = 'none';


                startTimestampDiv.style.display = 'block';
                endTimestampDiv.style.display = 'none';
                statusDiv.textContent = 'The snail is coming. Good luck.';
                status2Div.textContent = 'Distance traveled: ' + data.snailStatus.totalDistance.toFixed(2) + ' pixels';
                startTimestampDiv.textContent = 'Started at: ' + data.snailStatus.startTime;

            } else if (data.snailStatus && data.snailStatus.caught) {
                document.getElementById('startButton').style.display = 'none';
                document.getElementById('toggleVisibility').style.display = 'block';
                document.getElementById('startButton').style.display = 'none';
                document.getElementById('status').style.display = 'none';
                document.getElementById('status05').style.display = 'none';
                document.getElementById('status1').style.display = 'none';
                document.getElementById('bsodLink').style.display = 'block';


                startTimestampDiv.style.display = 'block';
                endTimestampDiv.style.display = 'block';

                status0Div.textContent = 'Ah...company.';
                status2Div.textContent = 'Distance traveled: ' + data.snailStatus.totalDistance.toFixed(2) + ' pixels';
                startTimestampDiv.textContent = 'Started at: ' + data.snailStatus.startTime;
                endTimestampDiv.textContent = 'Caught at: ' + data.snailStatus.endTime;
                document.getElementById('bsodLink').style.display = 'block';

                
            } else {
                document.getElementById('startButton').style.display = 'block';
                document.getElementById('toggleVisibility').style.display = 'none';
                startTimestampDiv.style.display = 'none';
                endTimestampDiv.style.display = 'none';
                document.getElementById('bsodLink').style.display = 'none';


                status0Div.textContent = 'There is currently a hidden snail somewhere on your screen.';
                statusDiv.textContent = 'It moves 1 pixel every 30 minutes.';
                statusDiv05.textContent = 'If the snail touches your cursor, then you die in real life, or something.';
                status1Div.textContent = 'The snail will temporarily become visible when it is 1 pixel away from your cursor.';
                status2Div.textContent = 'WARNING: Once you click start, the snail will begin its relentless hunt for your cursor. You may rest, but the snail will not.';
                
            }
        }
    
        updateUI();
    
        setInterval(function() {
            chrome.storage.local.get(['snailStatus', 'startTime'], function(newData) {
                data = newData;
                updateUI();
            });
        }, 500); 

    });

    document.getElementById('startButton').addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var url = tabs[0].url;
            
            if (url.startsWith("http://") || url.startsWith("https://")) {
                chrome.runtime.sendMessage({message: 'startMovement'});
                document.getElementById("warning").innerText = ""; 
            } else {
                document.getElementById("warning").innerText = "Cannot start on this page!";
            }
        });
    });

    document.getElementById('toggleVisibility').addEventListener('click', function() {
        chrome.runtime.sendMessage({message: 'toggleVisibility'}, function() {
        });
    });
});

document.getElementById('about').addEventListener('click', function(e) {
    e.preventDefault();
    chrome.tabs.create({url: "https://unoptimal.com"});
});

document.getElementById('img').addEventListener('click', function(e) {
    e.preventDefault();
    chrome.tabs.create({url: "https://slay-the-spire.fandom.com/wiki/Time_Eater"});
});

document.getElementById('bsodLink').addEventListener('click', function(e) {
    e.preventDefault();
    chrome.tabs.create({ url: "bsod/bsod.html" });
  });
  


// let toggleButton = document.getElementById('toggleButton');
// let visibilityButton = document.getElementById('visibilityButton');

// function formatFrequency(milliseconds) {
//     let seconds = milliseconds / 1000;
//     let minutes = seconds / 60;

//     if (minutes < 1) {
//         return seconds + ' seconds';
//     } else {
//         return minutes + ' minutes';
//     }
// }

// function updateStatus(data) {
//     let statusText = 'stopped';
//     if (data.snailStatus.moving) {
//         let visibleText = 'hidden';
//         let pixelText = 'pixel';
        
//         if (data.snailStatus.visible) {
//             visibleText = 'visible';
//         }
//         if (data.snailStatus.stepSize !== 1) {
//             pixelText = 'pixels';
//         }

//         let frequencyText = formatFrequency(data.snailStatus.frequency);

//         statusText = `moving ${data.snailStatus.stepSize} ${pixelText} every ${frequencyText}, currently ${visibleText}`;
//     }

//     toggleButton.innerText = data.snailStatus.moving ? 'Stop' : 'Start';
//     visibilityButton.innerText = data.snailStatus.visible ? 'Hide' : 'Show';
//     status.innerText = `Snail is: ${statusText}.`;
// }



// chrome.storage.local.get('snailStatus', function(data) {
//     updateStatus(data);
//     document.getElementById('snailSpeed').value = data.snailStatus.frequency / 60000; 
//     document.getElementById('snailStep').value = data.snailStatus.stepSize;
// });

// chrome.storage.onChanged.addListener(function(changes, areaName) {
//     if (areaName === 'local' && changes.snailStatus) {
//         updateStatus({ snailStatus: changes.snailStatus.newValue });
//         document.getElementById('snailSpeed').value = changes.snailStatus.newValue.frequency / 60000; // convert milliseconds to minutes
//         document.getElementById('snailStep').value = changes.snailStatus.newValue.stepSize;
//     }
// });

// toggleButton.addEventListener('click', function() {
//     chrome.runtime.sendMessage({message: 'toggleMovement'});
// });

// visibilityButton.addEventListener('click', function() {
//     chrome.runtime.sendMessage({message: 'toggleVisibility'});
// });

// document.getElementById('resetButton').addEventListener('click', function() {
//     chrome.runtime.sendMessage({message: 'resetSettings'});
// });


// let applyChanges = document.getElementById('applyChanges');
// applyChanges.addEventListener('click', function() {
//     chrome.runtime.sendMessage({message: 'applyChangesClicked'});
// });


// document.getElementById('applyChanges').addEventListener('click', function() {
//     let snailSpeed = document.getElementById('snailSpeed').value;
//     let snailStep = document.getElementById('snailStep').value;
//     chrome.runtime.sendMessage({
//         message: 'updateSettings',
//         newSettings: { speed: snailSpeed, step: snailStep }
//     });
// })
