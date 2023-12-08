document.addEventListener("DOMContentLoaded", () => {
  var file = null;
  const audioFileInput = document.getElementById("audioFile");
  const togglePlayButton = document.getElementById("toggleplaybtn");
  const progressBar = document.getElementById("progressBar");
  const volumeSlider = document.querySelector("#volumeSlider");
  const muteButton = document.querySelector("#mutebtn");

  const currentTimeElement = document.getElementById("currentTime");
  const totalDurationElement = document.getElementById("totalDuration");

  let audioContext,
    source,
    gainNode,
    totalDuration,
    progressBarValue,
    currentTimeOnchangedProgress;

  let convertedCurrentTime, convertedTotalDuration;

  let isPlaying = false;
  let continuePlay = false;
  let progressBarHadler = false;

  let currentTime = 0;
  let volumeValue = 0.5;

  // handle file input change
  function handleFileChange(event) {
    console.log("file changed");
    resetAll();

    clearBufferSource();
    currentTime = 0;
    // once the file changed, load the audio file
    if (event.target.files.length > 0) {
      file = event.target.files[0];
      loadAudioFile(file, false);
    }
  }

  // initialize audio context and assign to global variable
  function initializeAudioContext() {
    audioContext = new AudioContext();
  }

  // read audio file, initialize audio context, decode audio data
  function loadAudioFile(file, replay) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      initializeAudioContext();

      // decode the audio context
      audioContext.decodeAudioData(reader.result, (buffer) => {
        setupAudioBuffer(buffer, replay);
      });
    };
  }

  // create buffer source from context
  function setupAudioBuffer(buffer, replay) {
    // console.log('buffer', buffer);
    source = audioContext.createBufferSource();
    gainNode = audioContext.createGain();

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // source.connect(audioContext.destination);
    source.buffer = buffer;
    totalDuration = buffer.duration;
    totalDurationElement.innerHTML = convertTime(totalDuration); //.toFixed(2);

    if (replay) {
      source.start(0, currentTime);
      updateProgressBar();
    }
  }

  function convertTime(currentTime) {
    const mins = Math.floor(currentTime / 60);
    let seconds = Math.round(currentTime - mins * 60);
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    return `${mins}:${seconds}`;
  }

  function handleOnChangeProgressBar(event) {
    console.log("event ", event);
    // console.log("value changed to  ", event.target.value);
    // console.log("total duration ", totalDuration);

    // the current time based on the progress bar
    currentTimeOnchangedProgress = event.target.value * totalDuration;
    console.log("current time in progress bar", currentTimeOnchangedProgress);
    currentTime = currentTimeOnchangedProgress;

    // clear source and create source again and call start(0,currenttime)
    clearBufferSource();
    loadAudioFile(file, true);
    isPlaying = true;
    progressBarHadler = true;

    handleTogglePlayBtn();
  }

  function clearBufferSource() {
    if (source) {
      // Disconnect the source node from the audio context
      source.disconnect();

      // Set the source to null
      source = null;
    }
  }

  function resetAll() {
    currentTime = 0;
    progressBarValue = 0;
    currentTimeOnchangedProgress = 0;

    togglePlayButton.setAttribute("data-audio", "pause");
    progressBar.value = 0;
    currentTimeElement.innerHTML = "00:00";

    isPlaying = false;
    continuePlay = false;
    progressBarHadler = false;

    console.log("Reset all done");
  }

  function playAudio() {
    if (!isPlaying) {
      if (continuePlay) {
        if (progressBarHadler) {
          currentTime = currentTimeOnchangedProgress;
        }
        audioContext.resume();
        isPlaying = true;
        updateProgressBar();
      } else {
        source.start();
        isPlaying = true;
        updateProgressBar();
      }
    }
  }

  function pauseAudio() {
    if (isPlaying) {
      if (progressBarHadler) {
        console.log("progressbar clicked!!!!");
        currentTime = currentTimeOnchangedProgress;
      } else {
        currentTime = audioContext.currentTime;
      }
      console.log("audio context", audioContext);
      console.log("current time ", currentTime);
      audioContext.suspend();

      isPlaying = false;
      stopUpdatingProgressBar();
      continuePlay = true;
    }
  }

  function handleTogglePlayBtn() {
    const audioData = togglePlayButton.getAttribute("data-audio");
    console.log(audioData);

    if (audioData == "pause") {
      if (!source && !progressBarHadler) {
        alert("MP3 source loading...");
      } else {
        playAudio();
        togglePlayButton.setAttribute("data-audio", "play");
      }
    } else if (audioData == "play") {
      pauseAudio();
      togglePlayButton.setAttribute("data-audio", "pause");
    }
  }

  function updateProgressBar() {
    progressBarValue =
      (currentTime + audioContext.currentTime) / source.buffer.duration;
    progressBar.value = progressBarValue;
    console.log("time now ", timeNow);
    if (progressBarHadler) {
      // currentTimeElement.innerHTML = (
      //   currentTimeOnchangedProgress + audioContext.currentTime
      // ).toFixed(2);
      const timeNow = convertTime(currentTime + audioContext.currentTime);
      currentTimeElement.innerHTML = timeNow;
    } else {
      // currentTimeElement.innerHTML = audioContext.currentTime.toFixed(2);
      const timeNow = convertTime(audioContext.currentTime);
      currentTimeElement.innerHTML = timeNow;
    }
    animationFrameId = requestAnimationFrame(updateProgressBar);
    if (audioContext.currentTime >= totalDuration) {
      pauseAudio();
    }
  }

  function stopUpdatingProgressBar() {
    cancelAnimationFrame(animationFrameId);
  }

  function handleVolume() {
    volumeValue = volumeSlider.value / 100;
    gainNode.gain.value = volumeValue;
    muteButton.setAttribute("data-audio", "unmute");
  }

  function handleMute() {
    const audioData = muteButton.getAttribute("data-audio");
    console.log("audioData ", audioData);

    // currently mute. after click, need to set to unmute and handle volume
    if (audioData == "mute") {
      muteButton.setAttribute("data-audio", "unmute");
      handleVolume();
    } else {
      // currently unmute. after click, need to set to mute and volume = 0
      muteButton.setAttribute("data-audio", "mute");
      gainNode.gain.value = 0;
    }
  }

  audioFileInput.addEventListener("change", handleFileChange);
  togglePlayButton.addEventListener("click", handleTogglePlayBtn);
  // when onchange progressBar, call the function to calculate the current time
  progressBar.addEventListener("change", handleOnChangeProgressBar);
  volumeSlider.addEventListener("input", handleVolume);
  muteButton.addEventListener("click", handleMute);
});
