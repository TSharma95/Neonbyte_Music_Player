let urlInput = document.getElementById('onMenuClick');
const regex = /([a-zA-z]{5}:\/\/)(www\.youtube\.com\/)(watch\?v=)([a-zA-Z0-9]*)/;
var progress = document.getElementById('progress');
const menu = document.getElementById('Menu');
const container = document.getElementById('container');
const front = document.getElementById('front');
const back = document.getElementById('back');
const volumeIcon = document.getElementById('volume-icon');
const muteIcon = document.getElementById('mute-icon');
const volumeControl = document.getElementById('volume-control');
const play = document.getElementById('play');
const pause = document.getElementById('pause');

let controls = document.querySelector("#player-controls");
let displayInner = document.querySelector("#display-inner");
controls.addEventListener("click", function (e) {
    e.stopPropagation();
});
displayInner.addEventListener("click", function (e) {
    e.stopPropagation();
});

var url;
var videoId;
urlInput.addEventListener("keyup", function (e) {

    url = urlInput.value.match(regex);
    alert(url[4]);
    videoId = url[4];
    onInputActive(videoId);
    e.stopPropagation();
});
// alert(videoId);

// Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Replace the 'ytplayer' element with an <iframe> and
// YouTube player after the API code downloads.

function onYouTubePlayerAPIReady() {
    console.log("player active");
}

menu.addEventListener("click", function (e) {
    if (menu.innerHTML == "MENU") {
        progress.style.display = "block";
        urlInput.style.display = "none";
        menu.innerHTML = "URL";
    } else if (menu.innerHTML == "URL") {
        progress.style.display = "none";
        urlInput.style.display = "block";
        menu.innerHTML = "MENU"
    }
});

container.addEventListener("click", function (e) {
    if (front.style.transform == "rotateY(0deg)") {
        front.style.transform = "rotateY(-180deg)";
        back.style.transform = "rotateY(0deg)";
    } else {
        front.style.transform = "rotateY(0deg)";
        back.style.transform = "rotateY(180deg)";
    }
});

//functions
var player;
function onInputActive(videoId) {
    player = new YT.Player('ytplayer', {
        height: '360',
        width: '640',
        videoId: videoId,
        playerVars: {
            'rel': 0,
            'allowfullscreen': 1,
            'autohide': 1
        },
        events: {
            // 'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

play.addEventListener("click", function () {
    player.playVideo();
});

pause.addEventListener("click", function () {
    player.pauseVideo();
});

const volSettings = document.querySelector("#volume-settings");
volSettings.addEventListener("dblclick", function () {
    if (volumeIcon.style.display == "block") {
        volumeIcon.style.display = "none";
        muteIcon.style.display = "block";
        player.mute();
    } else if (muteIcon.style.display == "block") {
        volumeIcon.style.display = "block";
        muteIcon.style.display = "none";
        player.unMute();
    }
});

volumeIcon.addEventListener("click", function () {
    volumeControl.classList.toggle("volume-display");
});

// progress bar 
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {

        var totalDuration = player.getDuration();
        var getVolume = player.getVolume();

        let maxDuration = document.querySelector('.max-duration');
        let minDuration = Math.floor(totalDuration / 60);
        let secDuration = Math.ceil(totalDuration % 60);
        maxDuration.innerHTML = `${minDuration}:${secDuration}`;

        //music slider
        var currentTime;
        var clickWidht;
        setInterval(() => {
            if (clickWidht != null) {
                currentTime = clickWidht;
                player.seekTo(currentTime, true);

                var cTime = document.querySelector('.current-time');
                let cMin = Math.floor(currentTime / 60);
                let cSec = Math.ceil(currentTime % 60);
                cTime.innerHTML = `${cMin}:${cSec}`;

            } else if (currentTime != "") {
                currentTime = player.getCurrentTime();

                var cTime = document.querySelector('.current-time');
                let cMin = Math.floor(currentTime / 60);
                let cSec = Math.ceil(currentTime % 60);
                cTime.innerHTML = `${cMin}:${cSec}`;
            }

            var progressBar = document.getElementById('progress-bar');
            let progress_time = (currentTime / totalDuration) * 100;
            progressBar.style.width = `${progress_time}%`;

            progress.addEventListener("click", (eventWidth) => {
                clickWidht = (eventWidth.offsetX / 200) * totalDuration;
                currentTime = clickWidht;
            });
            clickWidht = null;

            // volume slider
            var progressBarVolume = document.getElementById('progress-bar-volume');
            progressBarVolume.style.height = `${getVolume}%`;
            var progressAreaVolume = document.getElementById('progress-area-volume');

            var clickHeight;
            progressAreaVolume.addEventListener("click", (eventHeight) => {
                clickHeight = eventHeight.offsetY;
                progressBarVolume.style.height = `${clickHeight}%`;

                getVolume = clickHeight;
                player.setVolume(getVolume);
            });

        }, 1000);



    }
}

// var progressBar = document.getElementById('progress-bar');

// function stopVideo() {
//     player.stopVideo();
// }
// const maxDuration = document.querySelector('.max-duration');
// console.log(videoPos);

// console.log(player.getDuration());