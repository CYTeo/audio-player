const jsmediatags = window.jsmediatags;

// function to receive upload of the audio mp3 file
const video = () => {
  const video = '';
};

// function to control the play/pause of the audio
const handlingVideoPlay = (audioFile) => {
  let sourceNode;

  // play button
  document
    .querySelector('[data-audio="play"]')
    .addEventListener('click', () => {
      console.log('play audio');
      const audioContext = new AudioContext();
      const reader = new FileReader();
      reader.onload = function (event) {
        audioContext.decodeAudioData(event.target.result, function (buffer) {
          sourceNode = audioContext.createBufferSource();
          sourceNode.buffer = buffer;
          sourceNode.connect(audioContext.destination);
          sourceNode.start();
        });
      };
      reader.readAsArrayBuffer(audioFile);
    });
  // pause button
  document
    .querySelector('[data-audio="pause"]')
    .addEventListener('click', () => {
      console.log('pause audio');
      sourceNode.stop();
    });
  // if (!audioFile) {
  //   return;
  // }
};

// function to control the volume
const handlingSoundVolume = (audioFile) => {
  const audioContext = new AudioContext();
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.5; // 0 = minimum volume, 1 = maximum volume
  // const audioSource = ... // Your audio source (e.g., AudioBufferSourceNode)
  audioFile.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // DOM to get the volume via input range
  let newVolume;
  document
    .querySelector('[data-audio="volume"]')
    .addEventListener('change', (e) => {
      console.log('e value', e.value);
      newVolume = e.value;
    });
  // gainNode.gain.value = newVolume;
};

// function to control the progress bar
const handlingProgressTimebar = () => {};

// function to control the time display
const handlingTime = () => {};

// function to mute the sound
const mute = () => {};

// function to handle error - when file not found or loading errors
const errorHandling = () => {
  if (!audioFile) {
    alert('No file uploaded.');
  }
};

const main = () => {
  document.addEventListener('DOMContentLoaded', () => {
    let audioFile;
    // errorHandling(audioFile);
    document
      .getElementById('audiofile')
      .addEventListener('change', function (event) {
        console.log('file changed');

        audioFile = event.target.files[0];
        // console.log('audio ', audioFile);
        handlingVideoPlay(audioFile);
      });
    handlingSoundVolume(audiofile);

    // handlingVideoPlay(audioFile);
    // testingChooseFile(audioFile);
  });
};
main();
