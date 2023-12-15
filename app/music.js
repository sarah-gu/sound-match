import { bestMusicPieces } from "./evolution.js";

export function getRandomSynthMethod() {
  var synths = [];
  for (let i = 0; i < 8; i++) {
    const synthMethods = ["useAdditive", "useFrequency", "useWave"];
    const randomIndex =
      Math.floor(Math.random() * (synthMethods.length - 1 - 0 + 1)) + 0;

    // Create an object to store boolean variables
    const synthFlags = {
      useAdditive: false,
      useFrequency: false,
      useWave: false,
    };

    // Set the randomly chosen variable to true
    synthFlags[synthMethods[randomIndex]] = true;

    synths.push(synthFlags);
  }
  return synths;
}

// Function to generate a random value within a range
function getRandomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function additive(
  gainNode,
  audioCtx,
  numPart,
  note,
  lfo_switch,
  lfo_freq_val,
  lfo_gain_val,
  globalGain
) {
  const selectedWaveform = "sine";
  const currentTime = audioCtx.currentTime;

  // Create an additive synthesis oscillator
  // Define the number of partials you want
  const numPartials = numPart;
  const oscillators = [];
  const lfos = [];

  const frequency = note; // Assuming note is the frequency of the current melody note

  for (let i = 1; i <= numPartials; i++) {
    // Create each oscillator with harmonic frequencies
    const osc = audioCtx.createOscillator();
    osc.frequency.value = i * frequency; // Harmonic frequencies
    osc.connect(gainNode);
    osc.type = selectedWaveform;
    oscillators.push(osc); // Add the oscillator to the array

    if (lfo_switch && i % 2 === 0) {
      const lfo = audioCtx.createOscillator();
      lfo.frequency.value = lfo_freq_val;
      const lfo_gain = audioCtx.createGain();
      lfo_gain.gain.value = lfo_gain_val;
      lfo.connect(lfo_gain).connect(osc.frequency);
      lfos.push(lfo);
    }
  }

  for (const osc of oscillators) {
    console.log("start osc");
    osc.start(currentTime);
  }

  for (const lfo of lfos) {
    console.log("start lfo");
    lfo.start(currentTime);
  }

  gainNode.connect(globalGain);
}

function fmSynthesis(
  gainNode,
  audioCtx,
  note,
  modIndexValue,
  modFreqValue,
  globalGain
) {
  const selectedWaveform = "sine";
  const currentTime = audioCtx.currentTime;

  const carrier = audioCtx.createOscillator();
  const modulatorFreq = audioCtx.createOscillator();

  carrier.frequency.setValueAtTime(note, currentTime);
  modulatorFreq.type = selectedWaveform;
  carrier.type = selectedWaveform;

  const modulationIndex = audioCtx.createGain();
  modulationIndex.gain.value = modIndexValue;
  modulatorFreq.frequency.value = modFreqValue;

  modulatorFreq.connect(modulationIndex);
  modulationIndex.connect(carrier.frequency);

  carrier.connect(gainNode);

  carrier.start();
  modulatorFreq.start();

  // // Apply the envelope
  // gainNode.gain.setValueAtTime(0.001, currentTime);
  // gainNode.gain.linearRampToValueAtTime(0.8 / (5 * 10), currentTime + attackTime);
  // gainNode.gain.linearRampToValueAtTime(sustainLevel / 5, currentTime + attackTime + decayTime);

  // Connect the gain node to the global gain
  gainNode.connect(globalGain);
}

function generateRandomWaveform(length) {
  const waveform = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    // Generate random values between -1 and 1
    waveform[i] = Math.random() * 2 - 1;
  }
  return waveform;
}

function wavetableSynthesis(gainNode, audioCtx, note, globalGain) {
  console.log("wave");

  const real = generateRandomWaveform(256);
  console.log(real);
  const imag = new Float32Array(real.length).fill(0);

  const wavetable = audioCtx.createPeriodicWave(real, imag);

  const oscillator = audioCtx.createOscillator();

  oscillator.setPeriodicWave(wavetable);

  oscillator.detune.value = note * 100; // Adjust pitch in cents

  oscillator.connect(gainNode);
  //gainNode.connect(audioCtx.destination);

  oscillator.start();

  // Connect the gain node to the global gain
  gainNode.connect(globalGain);
}

function play_note(
  note,
  useAdditive,
  useFrequency,
  useWave,
  globalGain,
  audioCtx,
  index,
  setIsPlaying
) {
  console.log("play");

  const selectedWaveform = "sine";

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  // Set up the ADSR envelope
  const attackTime = 0.05;
  const decayTime = 0.3;
  const sustainLevel = 0.25;
  const rampVal = 0.8;
  const divide = useFrequency || useAdditive ? 3 : 1;

  const currentTime = audioCtx.currentTime;

  // Start the oscillator
  osc.frequency.setValueAtTime(note, currentTime);
  osc.type = selectedWaveform;
  osc.connect(gainNode);
  osc.start(currentTime);

  // Apply the envelope
  gainNode.gain.setValueAtTime(0.001, currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.8 / divide,
    currentTime + attackTime
  );
  gainNode.gain.exponentialRampToValueAtTime(
    sustainLevel,
    currentTime + attackTime + decayTime
  );

  // Connect the gain node to the global gain or additive synthesis
  if (useAdditive) {
    const numPart = Math.floor(getRandomInRange(1, 10)); // Random value between 1 and 10
    const lfoSwitch = Math.random() < 0.5; // Random boolean
    const lfoFreq = Math.floor(getRandomInRange(1, 10)); // Random value between 1 and 10
    const lfoGain = Math.floor(getRandomInRange(1, 10)); // Random value between 1 and 10
    console.log("Additive Synthesis:");
    console.log("numPart:", numPart);
    console.log("lfoSwitch:", lfoSwitch);
    console.log("lfoFreq:", lfoFreq);
    console.log("lfoGain:", lfoGain);
    additive(
      gainNode,
      audioCtx,
      numPart,
      note,
      lfoSwitch,
      lfoFreq,
      lfoGain,
      globalGain
    ); // Assuming you have an additive function
  } else if (useFrequency) {
    const modIndexValue = Math.floor(getRandomInRange(1, 100)); // Random value between 1 and 100
    const modFreqValue = Math.floor(getRandomInRange(1, 100)); // Random value between 1 and 100
    console.log("Frequency Modulation Synthesis:");
    console.log("modIndexValue:", modIndexValue);
    console.log("modFreqValue:", modFreqValue);
    fmSynthesis(
      gainNode,
      audioCtx,
      note,
      modIndexValue,
      modFreqValue,
      globalGain
    );
  } else if (useWave) {
    wavetableSynthesis(gainNode, audioCtx, note, globalGain);
  } else {
    gainNode.connect(globalGain);
  }

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
    if (index == 4) {
      setIsPlaying(false);
    }
  }, 300);
}

// function play_note(note, globalGain, audioCtx, index, setIsPlaying) {
//   console.log("play");

//   const selectedWaveform = "sine";

//   const osc = audioCtx.createOscillator();
//   const gainNode = audioCtx.createGain();

//   // Set up the ADSR envelope
//   const attackTime = 0.05;
//   const decayTime = 0.3;
//   const sustainLevel = 0.25;

//   const currentTime = audioCtx.currentTime;

//   // Start the oscillator
//   osc.frequency.setValueAtTime(note, currentTime);
//   osc.type = selectedWaveform;
//   osc.connect(gainNode);
//   osc.start(currentTime);

//   // Apply the envelope
//   gainNode.gain.setValueAtTime(0.001, currentTime);
//   gainNode.gain.exponentialRampToValueAtTime(0.8, currentTime + attackTime);
//   gainNode.gain.exponentialRampToValueAtTime(
//     sustainLevel,
//     currentTime + attackTime + decayTime
//   );

//   // Connect the gain node to the global gain
//   gainNode.connect(globalGain);

//   setTimeout(() => {
//     // Release note
//     const releaseTime = 0.5;

//     // Apply the release envelope
//     gainNode.gain.cancelScheduledValues(currentTime); // Clear any scheduled changes
//     gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
//     gainNode.gain.linearRampToValueAtTime(0.0001, currentTime + releaseTime);

//     // Stop the oscillator and disconnect the gain node
//     osc.stop(currentTime + releaseTime);
//     osc.onended = () => {
//       gainNode.disconnect();
//     };
//     if (index == 4) {
//       setIsPlaying(false);
//     }
//   }, 300);
// }

function play_melody(
  frequencies,
  useAdditive,
  useFrequency,
  useWave,
  globalGain,
  audioCtx,
  setIsPlaying
) {
  console.log("melody");
  const restDuration = 700; // 0.5 seconds

  frequencies.forEach((frequency, index) => {
    setTimeout(() => {
      play_note(
        frequency,
        useAdditive,
        useFrequency,
        useWave,
        globalGain,
        audioCtx,
        index,
        setIsPlaying
      );
      console.log("Rest");
    }, index * restDuration);
  });
}

function choose_sound(
  number,
  globalGain,
  audioCtx,
  setIsPlaying,
  synths,
  level
) {
  // number = parseInt(number, 10);
  console.log(number);
  let frequencies = [];
  let synthFlags = [];

  switch (number) {
    case 1:
      frequencies = bestMusicPieces[0];
      synthFlags = synths[0];

      break;

    case 2:
      frequencies = bestMusicPieces[1];
      synthFlags = synths[1];

      break;

    case 3:
      frequencies = bestMusicPieces[2];
      synthFlags = synths[2];

      break;

    case 4:
      frequencies = bestMusicPieces[3];
      synthFlags = synths[3];

      break;

    case 5:
      frequencies = bestMusicPieces[4];
      synthFlags = synths[4];

      break;

    case 6:
      frequencies = bestMusicPieces[5];
      synthFlags = synths[5];

      break;

    case 7:
      frequencies = bestMusicPieces[6];
      synthFlags = synths[6];
      break;

    case 8:
      frequencies = bestMusicPieces[7];
      synthFlags = synths[7];
      break;

    default:
    // code block
  }
  if (level == 3) {
    play_melody(
      frequencies,
      synthFlags.useAdditive,
      synthFlags.useFrequency,
      synthFlags.useWave,
      globalGain,
      audioCtx,
      setIsPlaying
    );
  } else {
    play_melody(
      frequencies,
      false,
      false,
      false,
      globalGain,
      audioCtx,
      setIsPlaying
    );
  }
}

export const noteHandler = (num_value, setIsPlaying, synthMethods, level) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  //Global gain variable
  const globalGain = audioCtx.createGain();
  globalGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
  globalGain.connect(audioCtx.destination);

  choose_sound(
    num_value,
    globalGain,
    audioCtx,
    setIsPlaying,
    synthMethods,
    level
  );
};
