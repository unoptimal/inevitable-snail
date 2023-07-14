let snail;

function createSnail() {
    snail = document.createElement('img');
    snail.src = chrome.runtime.getURL('timeeater.png');
    snail.style.position = 'fixed';
    snail.style.pointerEvents = 'none';
    snail.style.zIndex = '100000';
    document.body.appendChild(snail);
}

document.addEventListener('mousemove', function(e) {
    var cursorX = e.clientX + window.scrollX;
    var cursorY = e.clientY + window.scrollY;

});

function moveSnail() {
    chrome.storage.local.get('snailStatus', function(data) {
        if (data.snailStatus) {
            snail.style.display = data.snailStatus.visible ? 'block' : 'none';
            
            let viewportX = data.snailStatus.x - window.scrollX;
            let viewportY = data.snailStatus.y - window.scrollY;

            snail.style.left = viewportX + 'px';
            snail.style.top = viewportY + 'px';
        }
    });
    requestAnimationFrame(moveSnail);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.redirect) {
        window.location.href = chrome.runtime.getURL("bsod/bsod.html");
    }
});

if (typeof document !== 'undefined') {
    createSnail();
    moveSnail();
}


// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.message === 'snailCaught') {
//         let newDiv = document.createElement("div"); 
//         newDiv.style.position = 'fixed';
//         newDiv.style.zIndex = '2147483647';
//         newDiv.style.fontSize = '2em';
//         newDiv.style.background = 'red';
//         newDiv.style.color = 'white';
//         newDiv.style.left = '50%';
//         newDiv.style.top = '50%';
//         newDiv.style.transform = 'translate(-50%, -50%)';
//         newDiv.style.padding = '10px';
//         newDiv.style.borderRadius = '5px';
//         newDiv.style.animation = 'fadeout 4s forwards';
        
//         let newText = document.createTextNode("The snail has caught you."); 
//         newDiv.appendChild(newText); 

//         let style = document.createElement('style');
//         style.innerHTML = `
//           @keyframes fadeout {
//             from { opacity: 1; }
//             to   { opacity: 0; }
//           }
//         `;
//         document.head.appendChild(style);

//         document.body.appendChild(newDiv); 
        
//         setTimeout(() => {
//           document.body.removeChild(newDiv);
//         }, 4000);
//     }
//     if (request.message === 'catchEvents') {
//         let catchEventsDiv = document.getElementById('catchEvents');
//         request.catchEvents.forEach(event => {
//             let eventDiv = document.createElement('div');
//             eventDiv.textContent = 'Caught at: ' + event;
//             catchEventsDiv.appendChild(eventDiv);
//         });
//     }
// });
