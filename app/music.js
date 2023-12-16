// Import bestMusicPieces array from evolution file
import { bestMusicPieces } from "./evolution.js";

/**
 * Function to generate an array of random synthesizer configurations.
 * @returns {Array} Array of synthesizer configurations.
 */
export function getRandomSynthMethod() {
  var synths = [];
  for (let i = 0; i < 8; i++) {
    const synthMethods = ["useAdditive", "useFrequency", "useWave"];
    const randomIndex =
      Math.floor(Math.random() * (synthMethods.length - 1 - 0 + 1)) + 0;
    var synthVals = [];

    // Create an object to store boolean variables
    const synthFlags = {
      useAdditive: false,
      useFrequency: false,
      useWave: false,
    };

    // Set the randomly chosen variable to true
    synthFlags[synthMethods[randomIndex]] = true;

    if(synthFlags.useAdditive) {
      const numPart = Math.floor(getRandomInRange(1, 10)); // Random value between 1 and 10
      const lfoSwitch = Math.random() < 0.5; // Random boolean
      const lfoFreq = Math.floor(getRandomInRange(1, 10)); // Random value between 1 and 10
      const lfoGain = Math.floor(getRandomInRange(1, 10)); // Random value between 1 and 10
      synthVals = [numPart, lfoSwitch ? 1 : 0, lfoFreq, lfoGain]

    } else if(synthFlags.useFrequency){
      const modIndexValue = Math.floor(getRandomInRange(1, 100)); // Random value between 1 and 100
      const modFreqValue = Math.floor(getRandomInRange(1, 100)); // Random value between 1 and 100
      synthVals = [modIndexValue, modFreqValue]

    }
    synths.push([synthFlags, synthVals]);
  }
  console.log("synths og");
  console.log(synths);
  return synths;
}

// Function to generate a random value within a range
function getRandomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Additive synthesis function.
 * @param {AudioNode} gainNode - Gain node for controlling volume.
 * @param {AudioContext} audioCtx - AudioContext for managing audio processing.
 * @param {number} numPart - Number of partials for additive synthesis.
 * @param {number} note - Frequency of the note being played.
 * @param {number} lfoSwitch - Boolean indicating whether LFO is applied.
 * @param {number} lfoFreqVal - LFO frequency value.
 * @param {number} lfoGainVal - LFO gain value.
 * @param {AudioNode} globalGain - Global gain node.
 */
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

    if (lfo_switch == 1 && i % 2 === 0) {
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

/**
 * Frequency Modulation (FM) Synthesis function.
 * @param {AudioNode} gainNode - Gain node for controlling volume.
 * @param {AudioContext} audioCtx - AudioContext for managing audio processing.
 * @param {number} note - Frequency of the note being played.
 * @param {number} modIndexValue - Modulation index value for FM synthesis.
 * @param {number} modFreqValue - Modulator frequency value for FM synthesis.
 * @param {AudioNode} globalGain - Global gain node.
 */
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


/**
 * Function to generate a random waveform for wavetable synthesis.
 * @param {number} length - Length of the waveform array.
 * @returns {Float32Array} Random waveform represented as a Float32Array.
 */
function generateRandomWaveform(length) {
  const waveform = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    // Generate random values between -1 and 1
    waveform[i] = Math.random() * 2 - 1;
  }
  return waveform;
}

/**
 * Wavetable Synthesis function.
 * @param {AudioNode} gainNode - Gain node for controlling volume.
 * @param {AudioContext} audioCtx - AudioContext for managing audio processing.
 * @param {number} note - Frequency of the note being played.
 * @param {AudioNode} globalGain - Global gain node.
 */
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

/**
 * Function to play a musical note.
 * @param {number} note - Frequency of the note.
 * @param {boolean} useAdditive - Whether additive synthesis is applied.
 * @param {boolean} useFrequency - Whether frequency modulation synthesis is applied.
 * @param {boolean} useWave - Whether wavetable synthesis is applied.
 * @param {Array} synthVals - Array of synthesizer values.
 * @param {AudioNode} globalGain - Global gain node.
 * @param {AudioContext} audioCtx - AudioContext for managing audio processing.
 * @param {number} index - Index of the note in the melody.
 * @param {function} setIsPlaying - Callback function to set playing state.
 */
function play_note(
  note,
  useAdditive,
  useFrequency,
  useWave,
  synthVals,
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
  var divide = useFrequency ? 3 : 1;
  divide = useAdditive ? synthVals[0] : divide;

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
    additive(
      gainNode,
      audioCtx,
      synthVals[0],
      note,
      synthVals[1],
      synthVals[2],
      synthVals[3],
      globalGain
    ); // Assuming you have an additive function
  } else if (useFrequency) {
    fmSynthesis(
      gainNode,
      audioCtx,
      note,
      synthVals[0],
      synthVals[1],
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

/**
 * Function to play a melody of musical notes.
 * @param {Array} frequencies - Array of frequencies representing the melody.
 * @param {boolean} useAdditive - Whether additive synthesis is applied.
 * @param {boolean} useFrequency - Whether frequency modulation synthesis is applied.
 * @param {boolean} useWave - Whether wavetable synthesis is applied.
 * @param {Array} synthVals - Array of synthesizer values.
 * @param {AudioNode} globalGain - Global gain node.
 * @param {AudioContext} audioCtx - AudioContext for managing audio processing.
 * @param {function} setIsPlaying - Callback function to set playing state.
 */
function play_melody(
  frequencies,
  useAdditive,
  useFrequency,
  useWave,
  synthVals, 
  globalGain,
  audioCtx,
  setIsPlaying
) {
  console.log("melody");
  const restDuration = 700; // 0.7 seconds

  /**
   * Iterate over each frequency in the frequencies array, and schedule a timeout for playing each note.
   * The timeout duration is determined by the index of the note multiplied by the restDuration constant.
   */
  frequencies.forEach((frequency, index) => {
    // Schedule a timeout to play the note after a certain duration
    setTimeout(() => {
      // Call the play_note function with the specified parameters
      play_note(
        frequency,
        useAdditive,
        useFrequency,
        useWave,
        synthVals,
        globalGain,
        audioCtx,
        index,
        setIsPlaying
      );
      console.log("Rest");
    }, index * restDuration);
  });
}

/**
 * Function to choose a musical sound based on a given number.
 * @param {number} number - Number representing the selected sound.
 * @param {AudioNode} globalGain - Global gain node.
 * @param {AudioContext} audioCtx - AudioContext for managing audio processing.
 * @param {function} setIsPlaying - Callback function to set playing state.
 * @param {Array} synths - Array of synthesizer configurations.
 * @param {number} level - Level of the musical piece.
 */
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
  let synthVals = [];

  console.log("synths");
  console.log(synths);

  switch (number) {
    case 1:
      frequencies = bestMusicPieces[0];
      synthFlags = synths[0][0];
      synthVals = synths[0][1];

      break;

    case 2:
      frequencies = bestMusicPieces[1];
      synthFlags = synths[1][0];
      synthVals = synths[1][1];
      break;

    case 3:
      frequencies = bestMusicPieces[2];
      synthFlags = synths[2][0];
      synthVals = synths[2][1];
      break;

    case 4:
      frequencies = bestMusicPieces[3];
      synthFlags = synths[3][0];
      synthVals = synths[3][1];
      break;

    case 5:
      frequencies = bestMusicPieces[4];
      synthFlags = synths[4][0];
      synthVals = synths[4][1];
      break;

    case 6:
      frequencies = bestMusicPieces[5];
      synthFlags = synths[5][0];
      synthVals = synths[5][1];
      break;

    case 7:
      frequencies = bestMusicPieces[6];
      synthFlags = synths[6][0];
      synthVals = synths[6][1];
      break;

    case 8:
      frequencies = bestMusicPieces[7];
      synthFlags = synths[7][0];
      synthVals = synths[7][1];
      break;

    default:
    // code block
    console.log(synthFlags);
  }
  if (level == 3) {
    console.log("synth_flags");
    console.log(synthFlags);
    play_melody(
      frequencies,
      synthFlags.useAdditive,
      synthFlags.useFrequency,
      synthFlags.useWave,
      synthVals,
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
      [],
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
