document.addEventListener('DOMContentLoaded', () => {
  var file = null;
  const audioFileInput = document.getElementById('audioFile');
  const playButton = document.getElementById('playbtn');
  const pauseButton = document.getElementById('pausebtn');
  const progressBar = document.getElementById('progressBar');
  const volumeSlider = document.querySelector('#volumeSlider');
  const muteButton = document.querySelector('#mutebtn');

  const currentTimeElement = document.getElementById('currentTime');
  const totalDurationElement = document.getElementById('totalDuration');

  let audioContext, source, gainNode, totalDuration, progressBarValue;
  let isPlaying = false;
  let continuePlay = false;
  let currentTime = 0;
  let volumeValue = 0.5;

  console.log('volume ', volumeSlider);
  // handle file input change
  function handleFileChange(event) {
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
    totalDurationElement.innerHTML = totalDuration.toFixed(2);

    // if (replay) {
    //   console.log('replay current time :', audioContext.currentTime);
    //   source.start(0, currentTime);
    //   updateProgressBar();
    // }
  }

  //
  function clearBufferSource() {
    if (source) {
      // Disconnect the source node from the audio context
      source.disconnect();

      // Set the source to null
      source = null;
    }
  }

  function playAudio() {
    if (!isPlaying) {
      if (continuePlay) {
        // clearBufferSource();
        // loadAudioFile(file, true);
        // source.start(0, currentTime);
        currentTime = 0;
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
      currentTime = audioContext.currentTime;
      // source.stop();
      audioContext.suspend();

      isPlaying = false;
      stopUpdatingProgressBar();
      continuePlay = true;
    }
  }

  function updateProgressBar() {
    // console.log("progressbar current time :", audioContext.currentTime);
    progressBarValue =
      (currentTime + audioContext.currentTime) / source.buffer.duration;
    // console.log('progressBarValue:', progressBarValue);
    progressBar.value = progressBarValue;
    currentTimeElement.innerHTML = audioContext.currentTime.toFixed(2);
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
  }

  function handleMute() {
    // console.log('click mute ');
    const audioData = muteButton.getAttribute('data-audio');
    console.log('audioData ', audioData);

    // currently mute. after click, need to set to unmute and handle volume
    if (audioData == 'mute') {
      muteButton.setAttribute('data-audio', 'unmute');
      handleVolume();
    } else {
      // currently unmute. after click, need to set to mute and volume = 0
      muteButton.setAttribute('data-audio', 'mute');
      gainNode.gain.value = 0;
    }
  }

  audioFileInput.addEventListener('change', handleFileChange);
  playButton.addEventListener('click', playAudio);
  pauseButton.addEventListener('click', pauseAudio);
  progressBar.addEventListener('change', () => {
    // source.playbackRate.setValueAtTime(0, audioContext.currentTime);
    // source.playbackRate.setValueAtTime(1, audioContext.currentTime + 0.01);
    // source.start(audioContext.currentTime, currentTime);
  });

  volumeSlider.addEventListener('input', handleVolume);
  muteButton.addEventListener('click', handleMute);
});
