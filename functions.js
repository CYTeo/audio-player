// const jsmediatags = window.jsmediatags;

// // function to receive upload of the audio mp3 file
// const video = () => {
//   const video = "";
// };

// // function to control the play/pause of the audio
// const handlingVideoPlay = (reader, sourceNode, audioFile) => {
//   // let sourceNode;

//   // play button
//   document
//     .querySelector('[data-audio="play"]')
//     .addEventListener("click", () => {
//       console.log("play audio");
//       sourceNode.start();
//       reader.readAsArrayBuffer(audioFile);
//     });
//   // pause button
//   document
//     .querySelector('[data-audio="pause"]')
//     .addEventListener("click", () => {
//       console.log("pause audio");
//       sourceNode.stop();
//     });
//   // if (!audioFile) {
//   //   return;
//   // }
// };

// // function to control the volume
// const handlingSoundVolume = (audioFile) => {
//   const audioContext = new AudioContext();
//   const gainNode = audioContext.createGain();
//   gainNode.gain.value = 0.5; // 0 = minimum volume, 1 = maximum volume
//   // const audioSource = ... // Your audio source (e.g., AudioBufferSourceNode)
//   audioFile.connect(gainNode);
//   gainNode.connect(audioContext.destination);

//   // DOM to get the volume via input range
//   let newVolume;
//   document
//     .querySelector('[data-audio="volume"]')
//     .addEventListener("change", (e) => {
//       console.log("e value", e.value);
//       newVolume = e.value;
//     });
//   // gainNode.gain.value = newVolume;
// };

// // function to control the progress bar
// const handlingProgressTimebar = () => {};

// // function to control the time display
// const handlingTime = () => {};

// // function to mute the sound
// const mute = () => {};

// // function to handle error - when file not found or loading errors
// const errorHandling = () => {
//   if (!audioFile) {
//     alert("No file uploaded.");
//   }
// };

// const playAudio = (source, audioContext, pausedTime) => {
//   document
//     .querySelector('[data-audio="play"]')
//     .addEventListener("click", () => {
//       if (pausedTime == 0) {
//         source.start();
//       } else {
//         source.seek(pausedTime);
//         source.start();

//         // source.playbackRate.setValueAtTime(0, audioContext.currentTime);
//         // source.start(audioContext.currentTime, pausedTime);
//         // source.playbackRate.setValueAtTime(1, audioContext.currentTime + 0.01);
//       }
//     });
// };
// const pauseAudio = (source, audioContext, pausedTime) => {
//   document
//     .querySelector('[data-audio="pause"]')
//     .addEventListener("click", () => {
//       pausedTime = audioContext.currentTime;
//       console.log(
//         "paused time when click pause",
//         audioContext.currentTime,
//         pausedTime
//       );
//       source.stop();
//       return audioContext.currentTime;
//     });
// };

// // function playAudio() {
// //   if (!isPlaying) {
// //     source.start();
// //     isPlaying = true;
// //     document.getElementById("playButton").textContent = "Pause";
// //     updateProgressBar();
// //   } else {
// //     source.stop();
// //     isPlaying = false;
// //     document.getElementById("playButton").textContent = "Play";
// //   }
// // }

// function updateProgressBar(source, audioContext) {
//   // currentTime =
//   //   audioContext.currentTime -
//   //   source.buffer.duration * (1 - document.getElementById("progressBar").value);
//   // document.getElementById("progressBar").value =
//   //   currentTime / source.buffer.duration;

//   document
//     .querySelector('[data-audio="progress"]')
//     .addEventListener("change", function (e) {
//       console.log("the current time line ", e.target.value);
//       // source.playbackRate.setValueAtTime(0, audioContext.currentTime);
//       // source.playbackRate.setValueAtTime(1, audioContext.currentTime + 0.01);
//       // source.start(audioContext.currentTime, currentTime);
//     });
// }

// const main = () => {
//   document.addEventListener("DOMContentLoaded", () => {
//     let audioFile;
//     // errorHandling(audioFile);
//     let source;
//     const audioContext = new AudioContext();
//     let isPlaying = false;
//     let pausedTime = 0;

//     document
//       .getElementById("audiofile")
//       .addEventListener("change", function (event) {
//         console.log("file changed");
//         audioFile = event.target.files[0];
//         console.log("the file data: ", audioFile);

//         let reader = new FileReader();
//         reader.readAsArrayBuffer(audioFile);

//         // onload of reader of audio
//         reader.onload = function (event) {
//           audioContext.decodeAudioData(event.target.result, function (buffer) {
//             source = audioContext.createBufferSource();
//             source.buffer = buffer;
//             source.connect(audioContext.destination);
//             // setInterval(updateProgressBar, 100);

//             // play the audio when click play button
//             playAudio(source, audioContext, pausedTime);

//             // pause the audio when click the pause button
//             pausedTime = pauseAudio(source, audioContext, pausedTime);

//             console.log("paused time : ", pausedTime);
//           });
//         };
//       });
//   });
// };

// main();

document.addEventListener("DOMContentLoaded", () => {
  var file = null;
  const fileInput = document.getElementById("audioFile");
  const playButton = document.getElementById("playbtn");
  const pauseButton = document.getElementById("pausebtn");
  const progressBar = document.getElementById("progressBar");
  const currentTimeElement = document.getElementById("currentTime");
  const totalDurationElement = document.getElementById("totalDuration");

  let audioContext, source, totalDuration, progressBarValue;
  let isPlaying = false;
  let continuePlay = false;
  let currentTime = 0;

  function handleFileChange(event) {
    if (event.target.files.length > 0) {
      file = event.target.files[0];
      loadAudioFile(file, false);
    }
  }

  function initializeAudioContext() {
    audioContext = new AudioContext();
  }

  function loadAudioFile(file, replay) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      initializeAudioContext();
      audioContext.decodeAudioData(reader.result, (buffer) => {
        setupAudioBuffer(buffer, replay);
      });
    };
  }

  function setupAudioBuffer(buffer, replay) {
    console.log("buffer", buffer);
    source = audioContext.createBufferSource();
    console.log("soure", source);
    source.connect(audioContext.destination);
    source.buffer = buffer;
    totalDuration = buffer.duration;
    totalDurationElement.innerHTML = totalDuration.toFixed(2);

    playButton.disabled = false;
    pauseButton.disabled = false;
    progressBar.disabled = false;

    if (replay) {
      console.log("replay current time :", audioContext.currentTime);
      source.start(0, currentTime);
      updateProgressBar();
    }
  }

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
    console.log("progressBarValue:", progressBarValue);
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

  document
    .getElementById("audiofile")
    .addEventListener("change", handleFileChange);
  playButton.addEventListener("click", playAudio);
  pauseButton.addEventListener("click", pauseAudio);
  progressBar.addEventListener("change", () => {
    // source.playbackRate.setValueAtTime(0, audioContext.currentTime);
    // source.playbackRate.setValueAtTime(1, audioContext.currentTime + 0.01);
    source.start(audioContext.currentTime, currentTime);
  });
});
