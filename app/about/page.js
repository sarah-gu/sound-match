export default function Home() {
  return (
    <div className="w-screen h-screen bg-white flex flex-col overflow-auto">
      <div className="text-5xl font-bold p-8 flex justify-center border-b-2 text-black">
        about sound match
      </div>

      <div className="text-xl flex flex-col p-12 gap-8 m-4">
        <div className="text-2xl bg-blue border rounded-lg p-8">
          Our project — SoundMatch — aims to help players strengthen their
          musical ear! As the levels progress, matching gets more difficult and
          players learn to master new skills.
        </div>
        <div className="flex flex-row gap-2">
          <div className="w-1/3">
            <div className="text-xl font-bold">Level 1</div>
            In the first level, players can get to know the game by matching
            melodies on a simple 2x2 grid. Once a correct match is made, the
            tiles will turn a dark shade of blue and a music note will appear on
            each.
          </div>
          <div className="w-1/3">
            <div className="text-xl font-bold">Level 2</div>
            The second level expands on the first level. Now, players have to
            match 16 tiles on a 4x4 grid. Although there are many more matches
            to be made, the melodies are not significantly more difficult to
            match.
          </div>
          <div className="w-1/3">
            <div className="text-xl font-bold">Level 3</div>
            In the final level, players are no longer simply matching two of the
            same melodies. Now, a synthesis method is being randomly applied to
            each melody. The player must match the melody to a word card listing
            the synthesis that is being used. Tricky, right? This will help
            players learn to identify what different types of synthesis may
            sound like!
          </div>
        </div>
        <div>
          We’ve added a one minute timer to all of these rounds to add an
          element of competitiveness - see if you can complete each level before
          the clock hits zero! (But if you can’t, no worries. We won’t end the
          game early.)
        </div>
        <div className="font-bold text-3xl">FAQs</div>
        <div className="font-bold text-xl">
          Why does the game take a while to initially load?
        </div>
        <div>See next question.</div>
        <div className="font-bold text-xl">How are the melodies generated?</div>
        <div>
          For all levels, the melodies are generated using the evolutionary
          method of genetic algorithm. The initial “parents” are randomly
          selected series of 5 frequencies which correspond to notes on the
          western scale. Over the course of 10 “generations,” these melodies are
          crossed over to create new melodies. Once the 10th generation is
          reached, the 8 “most fit” melodies are chosen to be used in the game
          board. Fitness is a randomly generated value added to the melody once
          it is first created during the evolutionary process.
        </div>
        <div className="font-bold text-xl">How are the syntheses chosen?</div>
        <div className="flex flex-col gap-2">
          <div>
            Once all the melodies have been generated and selected, each will
            undergo a random selection process to determine which synthesis will
            be applied. The three synthesis options are (1) frequency
            modulation, (2) additive synthesis, and (3) wavetable synthesis.
          </div>
          <div>
            In the case of frequency modulation, both the modulation frequency
            and the modulation index are randomly selected values between 1 and
            100.
          </div>
          <div>
            For additive synthesis, the number of partials is a randomly
            selected number between 1 and 10. LFO application to additive
            synthesis is randomly determined; in the case that they are, the LFO
            frequency and gain values are randomly selected values between 1 and
            10.
          </div>
          <div>
            Wavetable synthesis was chosen to be one of the synthesis methods to
            give us the opportunity to explore something new! It involves
            generating a random wavetable for each note during playback in order
            to create unique sonic textures. When this synthesis is used, a
            wavetable is randomly generated for each note and applied to the
            note as it is being played.
          </div>
          <div>This is exclusively done for the third level.</div>
        </div>
        <div className="font-bold text-xl">How did we build Sound Match?</div>
        <div>
          Sound Match is built using Next.js, javascript, Tailwind CSS and
          WebAudio. The site is deployed via Vercel and all code can be found at
          https://github.com/sarah-gu/sound-match. A challenge we faced was
          getting WebAudio to integrate with the larger Next.js framework - i.e,
          figuring out where to place files, how to pass props into different
          methods, and how to import the correct modules to where we needed to
          use them. The website uses state logic to track the initial mapping of
          matched cards, as well as to keep score and run a timer.
        </div>

        <div className="font-bold text-xl">Who built what?</div>
        <div className="flex flex-col">
          <div>
            Maria was in charge of creating the audio for all of the different
            levels and cards. She implemented the evolutionary method of genetic
            algorithm in order to randomly generate melodies and handled the
            logic of randomly applying synthesis to these melodies while also
            randomizing the synthesis input values.
          </div>
          <div>
            Sarah was in charge of building the UI portion of the web app, and
            integrating Maria’s code into the framework. She handled the logic
            of generating random matches, flipping cards, keeping score, running
            down the timer, changing levels, etc.
          </div>
        </div>
      </div>
    </div>
  );
}
