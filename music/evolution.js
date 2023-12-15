const pitchFrequencyMapping = {
  90: 261.625565300598634, // Z - C
  83: 277.182630976872096, // S - C#
  88: 293.66476791740756, // X - D
  68: 311.12698372208091, // D - D#
  67: 329.627556912869929, // C - E
  86: 349.228231433003884, // V - F
  71: 369.994422711634398, // G - F#
  66: 391.995435981749294, // B - G
  72: 415.304697579945138, // H - G#
  78: 440.0, // N - A
  74: 466.163761518089916, // J - A#
  77: 493.883301256124111, // M - B
  81: 523.251130601197269, // Q - C
  50: 554.365261953744192, // 2 - C#
  87: 587.32953583481512, // W - D
  51: 622.253967444161821, // 3 - D#
  69: 659.255113825739859, // E - E
  82: 698.456462866007768, // R - F
  53: 739.988845423268797, // 5 - F#
  84: 783.990871963498588, // T - G
  54: 830.609395159890277, // 6 - G#
  89: 880.0, // Y - A
  55: 932.327523036179832, // 7 - A#
  85: 987.766602512248223, // U - B
};

function getRandomPitch() {
  const pitches = Object.keys(pitchFrequencyMapping);
  const randomIndex = Math.floor(Math.random() * pitches.length);
  return pitches[randomIndex];
}

function generateRandomMusicPiece(length) {
  const musicPiece = [];
  for (let i = 0; i < length; i++) {
    const pitch = getRandomPitch();
    musicPiece.push(pitchFrequencyMapping[pitch]);
  }
  return musicPiece;
}

// Genetic Algorithm Functions
function generateRandomIndividual() {
  // Generate a random music piece
  const musicPiece = generateRandomMusicPiece(5);
  return musicPiece;
}

function evaluateFitness(individual) {
  // Ensure that there are exactly 5 notes in the array
  if (individual.length !== 5) {
    // Penalize individuals with a fitness score of 0 if the length is not 5
    return 0;
  }
  // Evaluate the fitness of the music piece
  // Implement your own fitness evaluation logic
  // Example: Calculate a score based on melody, harmony, and rhythm
  return Math.random(); // Placeholder, replace with your logic
}

function selectParents(population, fitnessValues) {
  // Select parents based on fitness values (higher fitness has a higher chance)
  const parents = [];
  for (let i = 0; i < population.length / 2; i++) {
    const parent1 = selectIndividual(population, fitnessValues);
    const parent2 = selectIndividual(population, fitnessValues);
    parents.push(parent1, parent2);
  }
  return parents;
}

function selectIndividual(population, fitnessValues) {
  // Select an individual based on roulette wheel selection
  const totalFitness = fitnessValues.reduce((acc, fitness) => acc + fitness, 0);
  let randomValue = Math.random() * totalFitness;
  for (let i = 0; i < population.length; i++) {
    randomValue -= fitnessValues[i];
    if (randomValue <= 0) {
      return population[i];
    }
  }
  // This should not happen, but return the last individual just in case
  return population[population.length - 1];
}

function crossover(parents) {
  // Apply crossover to produce offspring
  const offspring = [];
  for (let i = 0; i < parents.length; i += 2) {
    const parent1 = parents[i];
    const parent2 = parents[i + 1];
    // console.log("Parent 1:", parent1);
    // console.log("Parent 2:", parent2);
    // Ensure that parent1 and parent2 are arrays
    if (Array.isArray(parent1) && Array.isArray(parent2)) {
      const crossoverPoint = Math.floor(Math.random() * parent1.length);
      const child1 = parent1
        .slice(0, crossoverPoint)
        .concat(parent2.slice(crossoverPoint));
      const child2 = parent2
        .slice(0, crossoverPoint)
        .concat(parent1.slice(crossoverPoint));
      offspring.push(child1, child2);
    } else {
      console.error("Invalid parents:", parent1, parent2);
    }
  }
  return offspring;
}

function mutate(individual) {
  // Apply mutation to an individual
  const mutationRate = 0.1; // Adjust as needed
  for (let i = 0; i < individual.length; i++) {
    if (Math.random() < mutationRate) {
      // Apply a mutation (e.g., change a note or rhythm)
      individual[i] = Math.random(); // Placeholder, replace with your mutation logic
    }
  }
}

// Web Audio API Integration

function playMusicPiece(musicPiece) {
  // Convert the genetic representation to audio using Web Audio API
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Your logic to convert genetic representation to audio
  // For simplicity, let's assume each value in musicPiece represents a frequency
  musicPiece.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    oscillator.frequency.setValueAtTime(
      frequency * 440,
      audioContext.currentTime + index
    );
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5); // Adjust the duration as needed
  });
}

// Main genetic algorithm loop

const populationSize = 50;
const generations = 10;

let population = Array.from(
  { length: populationSize },
  generateRandomIndividual
);

for (let generation = 0; generation < generations; generation++) {
  const fitnessValues = population.map(evaluateFitness);
  const parents = selectParents(population, fitnessValues);
  const offspring = crossover(parents);
  mutate(offspring);
  population = parents.concat(offspring);
}

// Play the best music piece in the final population
export const bestMusicPieces = population
  .sort((a, b) => evaluateFitness(b) - evaluateFitness(a))
  .slice(0, 8);

// Log the best music piece to the console
console.log("Best Music Piece:", bestMusicPieces);
