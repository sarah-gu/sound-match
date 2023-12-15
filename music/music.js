import { bestMusicPieces } from "../app/evolution.js";

document.addEventListener("DOMContentLoaded", function (event) {
  const play = document.getElementById("play");
  var synths = [];

  play.addEventListener("click", () => {
    const num_value = document.getElementById("soundNumber").value;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    //Global gain variable
    const globalGain = audioCtx.createGain();
    globalGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
    globalGain.connect(audioCtx.destination);

    choose_sound(num_value);

        // '90': 261.625565300598634,  //Z - C
        // '83': 277.182630976872096, //S - C#
        // '88': 293.664767917407560,  //X - D
        // '68': 311.126983722080910, //D - D#
        // '67': 329.627556912869929,  //C - E
        // '86': 349.228231433003884,  //V - F
        // '71': 369.994422711634398, //G - F#
        // '66': 391.995435981749294,  //B - G
        // '72': 415.304697579945138, //H - G#
        // '78': 440.000000000000000,  //N - A
        // '74': 466.163761518089916, //J - A#
        // '77': 493.883301256124111,  //M - B
        // '81': 523.251130601197269,  //Q - C
        // '50': 554.365261953744192, //2 - C#
        // '87': 587.329535834815120,  //W - D
        // '51': 622.253967444161821, //3 - D#
        // '69': 659.255113825739859,  //E - E
        // '82': 698.456462866007768,  //R - F
        // '53': 739.988845423268797, //5 - F#
        // '84': 783.990871963498588,  //T - G
        // '54': 830.609395159890277, //6 - G#
        // '89': 880.000000000000000,  //Y - A
        // '55': 932.327523036179832, //7 - A#
        // '85': 987.766602512248223,  //U - B

        function getRandomSynthMethod() {
            for (let i = 0; i < 8; i++) {
                const synthMethods = ['useAdditive', 'useFrequency', 'useWave'];
                const randomIndex = Math.floor(Math.random() * ((synthMethods.length - 1) - 0 + 1)) + 0;
            
                // Create an object to store boolean variables
                const synthFlags = {
                    useAdditive: false,
                    useFrequency: false,
                    useWave: false
                };
            
                // Set the randomly chosen variable to true
                synthFlags[synthMethods[randomIndex]] = true;

                synths.append(synthFlags)
            }
        }  

        // Function to generate a random value within a range
        function getRandomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

    function choose_sound(number) {
      number = parseInt(number, 10);
      var frequencies = [];

            switch(number) {
                case 1:
                    frequencies = bestMusicPieces[0];
                    var synthFlags = synths[0];
                    console.log(synthFlags)
                    play_melody(frequencies, synthFlags.useAdditive, synthFlags.useFrequency, synthFlags.useWave);
                break;

                case 2:
                    frequencies = bestMusicPieces[1];
                    var synthFlags = synths[1];
                    console.log(synthFlags)
                    play_melody(frequencies, synthFlags.useAdditive, synthFlags.useFrequency, synthFlags.useWave);
                break;

                case 3:
                    frequencies = bestMusicPieces[2];
                    var synthFlags = synths[2];
                    console.log(synthFlags)
                    play_melody(frequencies, synthFlags.useAdditive, synthFlags.useFrequency, synthFlags.useWave);
                break;

                case 4:
                    frequencies = bestMusicPieces[3];
                    var synthFlags = synths[3];
                    console.log(synthFlags)
                    play_melody(frequencies, synthFlags.useAdditive, synthFlags.useFrequency, synthFlags.useWave);
                break;

                case 5:
                    frequencies = bestMusicPieces[4];
                    synthFlags = synths[4];
                    console.log(synthFlags)
                    play_melody(frequencies, synthFlags.useAdditive, synthFlags.useFrequency, synthFlags.useWave);
                break;

                case 6:
                    frequencies = bestMusicPieces[5];
                    var synthFlags = synths[5];
                    console.log(synthFlags)
                    play_melody(frequencies, synthFlags.useAdditive, synthFlags.useFrequency, synthFlags.useWave);
                break;

                case 7:
                    frequencies = bestMusicPieces[6];
                    var synthFlags = synths[6];
                    console.log(synthFlags)
                    play_melody(frequencies, synthFlags.useAdditive, synthFlags.useFrequency, synthFlags.useWave);
                break;

                case 8:
                    frequencies = bestMusicPieces[7];
                    var synthFlags = synths[7];
                    console.log(synthFlags)
                    play_melody(frequencies, synthFlags.useAdditive, synthFlags.useFrequency, synthFlags.useWave);
                break;

                default:
                // code block
            }
        }

        function play_melody(frequencies, useAdditive, useFrequency, useWave) {
            console.log("melody");
            const restDuration = 700; // 0.5 seconds
          
            frequencies.forEach((frequency, index) => {
              setTimeout(() => {
                play_note(frequency, useAdditive, useFrequency, useWave);
                console.log("Rest");
              }, index * restDuration);
            });
        }
                
        function play_note(note, useAdditive, useFrequency, useWave) {
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
            gainNode.gain.exponentialRampToValueAtTime(0.8/divide, currentTime + attackTime);
            gainNode.gain.exponentialRampToValueAtTime(
              sustainLevel,
              currentTime + attackTime + decayTime
            );
          
            // Connect the gain node to the global gain or additive synthesis
            if (useAdditive) {
                const numPart = Math.floor(getRandomInRange(1, 10));       // Random value between 1 and 10
                const lfoSwitch = Math.random() < 0.5;                   // Random boolean
                const lfoFreq = Math.floor(getRandomInRange(1, 10));      // Random value between 1 and 10
                const lfoGain = Math.floor(getRandomInRange(1, 10));      // Random value between 1 and 10
                console.log('Additive Synthesis:');
                console.log('numPart:', numPart);
                console.log('lfoSwitch:', lfoSwitch);
                console.log('lfoFreq:', lfoFreq);
                console.log('lfoGain:', lfoGain);
                additive(gainNode, audioCtx, numPart, note, lfoSwitch, lfoFreq, lfoGain); // Assuming you have an additive function
            } else if (useFrequency){
                const modIndexValue = Math.floor(getRandomInRange(1, 100)); // Random value between 1 and 100
                const modFreqValue = Math.floor(getRandomInRange(1, 100));  // Random value between 1 and 100
                console.log('Frequency Modulation Synthesis:');
                console.log('modIndexValue:', modIndexValue);
                console.log('modFreqValue:', modFreqValue);
                fmSynthesis(gainNode, audioCtx, note, modIndexValue, modFreqValue);
            } else if (useWave){
              wavetableSynthesis(gainNode, audioCtx, note)
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
            }, 300);
        }

        function additive(gainNode, audioCtx, numPart, note, lfo_switch, lfo_freq_val, lfo_gain_val) {
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
              console.log("start osc")
              osc.start(currentTime);
            }
          
            for (const lfo of lfos) {
              console.log("start lfo")
              lfo.start(currentTime);
            }

            gainNode.connect(globalGain);
        }

        function fmSynthesis(gainNode, audioCtx, note, modIndexValue, modFreqValue) {
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

        function wavetableSynthesis(gainNode, audioCtx, note) {

            console.log("wave")

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
        

    }); 
});
