
const play = document.getElementById("play");
const value = document.getElementById("soundNumber");

play.addEventListener("click", () => {

    choose_sound(value);

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    //Global gain variable
    const globalGain = audioCtx.createGain();
    globalGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
    globalGain.connect(audioCtx.destination);

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

    function choose_sound(number) {
        switch(number) {
            case 1:
              //frequencies = [987.766602512248223, 880.000000000000000, 783.990871963498588, 80.000000000000000, 987.766602512248223];
              //play_melody(frequencies);
              play_note(880.000000000000000);
              break;

            case 2:
              // code block
              break;

            case 3:
              // code block
              break;

            case 4:
            // code block
            break;

            case 5:
              // code block
            break;

            case 6:
              // code block
            break;

            case 7:
              // code block
            break;

            case 8:
              // code block
            break;

            default:
              // code block
          }
    }

    function play_melody(frequencies) {
        for (frequency in frequencies) {
            play_note(frequency);
        }
    }


    function play_note(note) {

        selectedWaveform = 'sine';

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain(); 
        
        // Set up the ADSR envelope
        const attackTime = 0.05; 
        const decayTime = 0.3;  
        const sustainLevel = 0.5; 

        const currentTime = audioCtx.currentTime;

        // Start the oscillator
        osc.frequency.setValueAtTime(note, currentTime)
        osc.type = selectedWaveform;
        osc.connect(gainNode);
        osc.start(currentTime);

        // Apply the envelope
        gainNode.gain.setValueAtTime(0.001, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.8, currentTime + attackTime);
        gainNode.gain.exponentialRampToValueAtTime(sustainLevel, currentTime + attackTime + decayTime);

        // Connect the gain node to the global gain
        gainNode.connect(globalGain);

        // Release note
        currentTime = audioCtx.currentTime;
        const releaseTime = 0.25; 

        // Apply the release envelope
        gainNode.gain.cancelScheduledValues(currentTime); // Clear any scheduled changes
        gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + releaseTime);

        // Stop the oscillator and disconnect the gain node
        osc.stop(currentTime + releaseTime);
        osc.onended = () => {
            gainNode.disconnect();
        };

    }


}); 