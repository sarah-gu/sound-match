import { bestMusicPieces } from "./evolution.js";

function play_note(note, globalGain, audioCtx) {
  console.log("play");

  const selectedWaveform = "sine";

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  // Set up the ADSR envelope
  const attackTime = 0.05;
  const decayTime = 0.3;
  const sustainLevel = 0.25;

  const currentTime = audioCtx.currentTime;

  // Start the oscillator
  osc.frequency.setValueAtTime(note, currentTime);
  osc.type = selectedWaveform;
  osc.connect(gainNode);
  osc.start(currentTime);

  // Apply the envelope
  gainNode.gain.setValueAtTime(0.001, currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.8, currentTime + attackTime);
  gainNode.gain.exponentialRampToValueAtTime(
    sustainLevel,
    currentTime + attackTime + decayTime
  );

  // Connect the gain node to the global gain
  gainNode.connect(globalGain);

  setTimeout(() => {
    // Release note
    const releaseTime = 0.5;

    // Apply the release envelope
    gainNode.gain.cancelScheduledValues(currentTime); // Clear any scheduled changes
    gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
    gainNode.gain.linearRampToValueAtTime(0.0001, currentTime + releaseTime);

    // Stop the oscillator and disconnect the gain node
    osc.stop(currentTime + releaseTime);
    osc.onended = () => {
      gainNode.disconnect();
    };
  }, 300);
}

function play_melody(frequencies, globalGain, audioCtx) {
  console.log("melody");
  const restDuration = 700; // 0.5 seconds

  frequencies.forEach((frequency, index) => {
    setTimeout(() => {
      play_note(frequency, globalGain, audioCtx);
      console.log("Rest");
    }, index * restDuration);
  });
}

function choose_sound(number, globalGain, audioCtx) {
  // number = parseInt(number, 10);
  console.log(number);
  let frequencies = [];

  switch (number) {
    case 1:
      frequencies = bestMusicPieces[0];
      break;

    case 2:
      frequencies = bestMusicPieces[1];
      break;

    case 3:
      frequencies = bestMusicPieces[2];
      break;

    case 4:
      frequencies = bestMusicPieces[3];
      break;

    case 5:
      frequencies = bestMusicPieces[4];
      break;

    case 6:
      frequencies = bestMusicPieces[5];
      break;

    case 7:
      frequencies = bestMusicPieces[6];
      break;

    case 8:
      frequencies = bestMusicPieces[7];
      break;

    default:
    // code block
  }

  play_melody(frequencies, globalGain, audioCtx);
}

export const noteHandler = (num_value) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  //Global gain variable
  const globalGain = audioCtx.createGain();
  globalGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
  globalGain.connect(audioCtx.destination);

  choose_sound(num_value, globalGain, audioCtx);
};
