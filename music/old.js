

document.addEventListener("DOMContentLoaded", function(event) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // //Check for waveform type selected
    // const waveformSelect = document.getElementById('waveformSelect');
    // waveformSelect.addEventListener('change', function(event) {
    //     selectedWaveform = event.target.value;
    // });

    //Global gain variable
    const globalGain = audioCtx.createGain();
    globalGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
    globalGain.connect(audioCtx.destination);

    //A map from keys to frequencies
    const keyboardFrequencyMap = {
        '90': 261.625565300598634,  //Z - C
        '83': 277.182630976872096, //S - C#
        '88': 293.664767917407560,  //X - D
        '68': 311.126983722080910, //D - D#
        '67': 329.627556912869929,  //C - E
        '86': 349.228231433003884,  //V - F
        '71': 369.994422711634398, //G - F#
        '66': 391.995435981749294,  //B - G
        '72': 415.304697579945138, //H - G#
        '78': 440.000000000000000,  //N - A
        '74': 466.163761518089916, //J - A#
        '77': 493.883301256124111,  //M - B
        '81': 523.251130601197269,  //Q - C
        '50': 554.365261953744192, //2 - C#
        '87': 587.329535834815120,  //W - D
        '51': 622.253967444161821, //3 - D#
        '69': 659.255113825739859,  //E - E
        '82': 698.456462866007768,  //R - F
        '53': 739.988845423268797, //5 - F#
        '84': 783.990871963498588,  //T - G
        '54': 830.609395159890277, //6 - G#
        '89': 880.000000000000000,  //Y - A
        '55': 932.327523036179832, //7 - A#
        '85': 987.766602512248223,  //U - B
    }

    //Listeners to the keys, these will add and remove activeOscillators
    window.addEventListener('keydown', keyDown, false);
    window.addEventListener('keyup', keyUp, false);

    let activeOscillators = {}
    const maxVoices = 4;

    function keyDown(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
            playNote(key);
        }
    }

    function keyUp(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && activeOscillators[key]) {
            releaseNote(key);
        }
    }

    //Start the sound
    function playNote(key) {
        // Check if the selectedWaveform is "none" (or "Select")
        if (selectedWaveform === 'none') {
            return; // Do nothing if the waveform is "none"
        }

        //Allows multiple notes to play at once
        numVoices = Object.keys(activeOscillators).length;
        
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain(); 
        
        // Set up the ADSR envelope
        const attackTime = 0.05; 
        const decayTime = 0.3;  
        const sustainLevel = 0.5; 

        const currentTime = audioCtx.currentTime;

        // Start the oscillator
        osc.frequency.setValueAtTime(keyboardFrequencyMap[key], currentTime)
        osc.type = selectedWaveform;
        osc.connect(gainNode);
        osc.start(currentTime);
        activeOscillators[key] = {osc, gainNode};
        numVoices = Object.keys(activeOscillators).length;

        // Apply the envelope
        gainNode.gain.setValueAtTime(0.001, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.8/(numVoices*2), currentTime + attackTime);
        gainNode.gain.exponentialRampToValueAtTime(sustainLevel/numVoices, currentTime + attackTime + decayTime);

        // Connect the gain node to the global gain
        gainNode.connect(globalGain);

    }

    // Release the note with an ADSR release
    function releaseNote(key) {
        if(activeOscillators[key]) {
            const { osc, gainNode } = activeOscillators[key];
            const currentTime = audioCtx.currentTime;
            const releaseTime = 0.25; 

            // Apply the release envelope
            gainNode.gain.cancelScheduledValues(currentTime); // Clear any scheduled changes
            gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + releaseTime);

            // Stop the oscillator and disconnect the gain node
            osc.stop(currentTime + releaseTime);
            osc.onended = () => {
                gainNode.disconnect();
                delete activeOscillators[key];
            };
        }
    }

}); 