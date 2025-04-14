import { db } from "../server/db";
import { animes, animeGenres, seasons, episodes, videoSources } from "../shared/schema";

const animeNames = [
  "Attack on Titan", "Demon Slayer", "My Hero Academia", "Jujutsu Kaisen", "Naruto", 
  "Bleach", "One Piece", "Dragon Ball Z", "Death Note", "Fullmetal Alchemist: Brotherhood",
  "Hunter x Hunter", "Tokyo Ghoul", "Sword Art Online", "Black Clover", "Fairy Tail",
  "The Promised Neverland", "Re:Zero", "Vinland Saga", "Dr. STONE", "Mob Psycho 100",
  "The Rising of the Shield Hero", "That Time I Got Reincarnated as a Slime", "Fire Force", "Haikyuu!!",
  "The Seven Deadly Sins", "One Punch Man", "Cowboy Bebop", "Steins;Gate", "No Game No Life",
  "Overlord", "Goblin Slayer", "Parasyte", "Kill la Kill", "Your Lie in April", "Erased",
  "Code Geass", "Angel Beats!", "Soul Eater", "Noragami", "Gurren Lagann",
  "Blue Exorcist", "Akame ga Kill!", "Another", "Violet Evergarden", "Charlotte",
  "Prison School", "Is It Wrong to Try to Pick Up Girls in a Dungeon?", "Food Wars!",
  "Boku no Hero Academia", "Berserk", "Tokyo Revengers", "JoJo's Bizarre Adventure",
  "Made in Abyss", "Kakegurui", "Assassination Classroom", "Neon Genesis Evangelion",
  "Chainsaw Man", "Spy x Family", "Cyberpunk: Edgerunners", "Mushoku Tensei",
  "86", "To Your Eternity", "Wonder Egg Priority", "Vivy: Fluorite Eye's Song",
  "Horimiya", "Moriarty the Patriot", "SK8 the Infinity", "Odd Taxi",
  "Fruits Basket", "The Case Study of Vanitas", "Link Click", "Sonny Boy",
  "The Great Jahy Will Not Be Defeated!", "Komi Can't Communicate", "Blue Period",
  "The Faraway Paladin", "Ranking of Kings", "Platinum End", "Takt Op. Destiny",
  "Ousama Ranking", "My Dress-Up Darling", "Arifureta", "Demon Slayer: Entertainment District Arc",
  "The Rising of the Shield Hero Season 2", "Kaguya-sama: Love Is War", "Orient",
  "Tokyo 24th Ward", "In the Land of Leadale", "Life With an Ordinary Guy",
  "Sabikui Bisco", "Princess Connect! Re:Dive Season 2", "The Genius Prince's Guide to Raising a Nation",
  "The Strongest Sage with the Weakest Crest", "Miss Kuroitsu from the Monster Development Department",
  "Requiem of the Rose King", "Sasaki and Miyano", "Tribe Nine", "Futsal Boys!!!!",
  "Karakai Jouzu no Takagi-san 3", "Hakozume: Kouban Joshi no Gyakushuu", "Shuumatsu no Harem"
];

const animeDescriptions = [
  "In a world where humanity lives within cities surrounded by enormous walls due to the Titans, gigantic humanoid creatures who devour humans seemingly without reason.",
  "A young boy joins the Demon Slayer Corps to avenge his family and cure his sister.",
  "A superhero-loving boy without any powers is determined to enroll in a prestigious hero academy and learn what it really means to be a hero.",
  "A high schooler joins a secret organization to fight cursed spirits and ultimately becomes cursed himself.",
  "A hyperactive knucklehead ninja struggles to become the most powerful ninja in his village.",
  "A boy with the ability to see ghosts is given the power to fight against them as a Soul Reaper.",
  "Follow the adventures of Monkey D. Luffy and his pirate crew in their search for the greatest treasure ever left by the legendary Pirate, Gold Roger.",
  "The adventures of Earth's martial arts defender Son Goku continue with a new family and the revelation of his alien origin.",
  "A high school student discovers a supernatural notebook that grants him the power to kill anyone by writing their name in it.",
  "Two brothers search for a Philosopher's Stone after an attempt to revive their deceased mother goes awry and leaves them in damaged physical forms.",
  "A young boy takes on a dangerous test to find his missing father.",
  "A college student is attacked by a ghoul; when he recovers, he discovers that he underwent a surgery that transformed him into a half-ghoul.",
  "Players of a virtual reality MMORPG, Sword Art Online, are trapped and fighting for their very lives.",
  "A boy, born without magic in a world full of it, receives a mysterious grimoire with a five-leaf clover.",
  "A celestial mage joins a rowdy guild in search of her missing dragon foster-father.",
  "Orphans at Grace Field House discover the dark truth about their existence and plot their escape.",
  "A hikikomori is transported to a fantasy world, where he is granted the power to rewind time after death.",
  "A young Viking seeks revenge against his father's killer and finds himself in the middle of a war.",
  "The world's civilization is turned to stone, and a scientific genius works to revive humanity.",
  "An unimpressive-looking middle school boy tries to hide his powerful psychic abilities.",
  "A gamer is summoned to a fantasy world as a shield hero, only to be betrayed and falsely accused of a crime.",
  "A corporate worker is killed and reincarnated as a slime with unique powers.",
  "Special Fire Force Company 8 fights Infernals while uncovering the truth about a conspiracy.",
  "A high school student joins the volleyball team and aims to overcome his small stature to become a great volleyball player.",
  "A group of knights fights to free the kingdom from control of the Holy Knights.",
  "A hero who defeats opponents with a single punch must deal with the boredom of being unbeatable.",
  "A ragtag crew of bounty hunters chases criminals throughout the solar system.",
  "A scientist accidentally invents time travel and must use it to prevent global catastrophe.",
  "Two step-siblings who are master gamers are transported to a world where games determine everything.",
  "A salaryman logs into his favorite MMORPG one last time before the servers shut down, only to find himself stuck in the game as his character.",
  "A young priestess joins an adventurer who specializes in slaying goblins.",
  "A high school student battles aliens who secretly infiltrate Earth by taking over human hosts.",
  "A schoolgirl battles against the student council to avenge her father's death.",
  "A pianist who cannot hear the sound of his own playing meets a violinist who helps him return to the world of music.",
  "A man travels back in time to prevent the abduction and murder of elementary school children.",
  "An exiled prince gains the power of absolute obedience and uses it to overthrow the Holy Britannian Empire.",
  "Teenagers stuck in the afterlife battle against disappearing forever.",
  "Students of Death Weapon Meister Academy collect human souls to turn their weapon partners into Death Scythes.",
  "A minor god without a single shrine decides to build his reputation by helping humans in need.",
  "A team with the power of transformation fights against enemies to prevent the destruction of their world.",
  "A boy discovers that he is the son of Satan and joins an academy for exorcists.",
  "A girl joins a group of assassins to fight corruption in the Capital.",
  "A transfer student discovers that his new school is plagued by a mysterious curse.",
  "A girl who lost her arms and legs in the war becomes an Auto Memory Doll to help others.",
  "A boy with supernatural abilities must uncover the secret of his past.",
  "A high school student is sent to a prison-like school where female students brutally punish the males for breaking rules.",
  "A solo adventurer trying to survive meets a goddess who invites him to join her familia.",
  "A teenager enrolls in an elite culinary school where students engage in high-stakes cooking battles.",
  "In a world where most people have superpowers, a boy without powers struggles to become a hero.",
  "A lone mercenary with a huge sword fights demons in a medieval world.",
  "A middle school student with the ability to see ghosts travels back in time to prevent a tragedy.",
  "The bizarre adventures of the Joestar family across generations as they battle supernatural enemies.",
  "Orphaned children descend into a mysterious giant hole in search of their mother.",
  "A transfer student with a gambling addiction enrolls in a school where the hierarchy is determined by gambling.",
  "A classroom of misfits is tasked with assassinating their superhuman teacher who threatens to destroy Earth.",
  "Teenagers pilot giant robots to fight against mysterious beings called Angels.",
  "A man makes a pact with a Chainsaw Devil to hunt down other devils.",
  "A spy must create a fake family with an assassin wife and a telepathic daughter to complete his mission.",
  "A mercenary takes a job to protect a street kid in a dystopian future city.",
  "A reincarnated 34-year-old man starts life as a baby in a fantasy world, determined to live his new life to the fullest.",
  "The story of the 86, those forced to fight the Legion in mechs outside of the walls of the Republic of San Magnolia.",
  "An immortal being is sent to Earth and experiences what it means to be human through interactions with various people.",
  "Girls fight in a dream world to save people who have committed suicide from mysterious enemies.",
  "An AI songstress is created to make people happy through her singing, only to discover a plot to destroy humanity.",
  "A classic shoujo romance between a seemingly tough delinquent boy and a smart, popular girl.",
  "The illegitimate son of a genius criminal mastermind leads a double life as a detective and criminal.",
  "A group of high school students bond over their love of skateboarding.",
  "A taxi driver becomes involved in a mystery surrounding his missing friend.",
  "A girl cursed to turn into an animal when hugged by the opposite sex finds acceptance in a family with a similar curse.",
  "A vampire specialist travels to Paris to find the cause of a strange malady affecting vampires.",
  "A duo can enter photos to change the past, but they must adhere to strict rules.",
  "Teenagers find themselves transported to a surreal world where physical laws don't apply.",
  "A once-mighty demon lord is reduced to working part-time jobs in the human world.",
  "A high school girl with extreme social anxiety tries to make friends.",
  "A student gives up on his dreams of becoming a pianist and takes up painting instead.",
  "A young paladin who grew up among the undead embarks on a journey to find his place in the world.",
  "A physically weak prince forms an unlikely friendship with a powerful warrior.",
  "After attempting suicide, a boy is chosen to be a God candidate in a 999-day battle royale.",
  "Musicians fight against mysterious monsters called D2s by playing music.",
  "A young deaf girl is bullied in her new school, but finds an unlikely friend.",
  "An awkward boy who loves traditionally feminine hobbies meets a gyaru who wants him to make cosplay outfits for her.",
  "After being betrayed and left for dead, a high school student is reborn with powerful abilities.",
  "The Demon Slayer Corps continues their fight against demons in the entertainment district.",
  "The shield hero continues his journey in a parallel world.",
  "Two genius students at a prestigious academy try to get the other to confess their love first.",
  "A boy with the power to exorcise demons joins a team fighting against the demon tribe Kishin.",
  "An artificial food crisis leads to a scheme to manipulate food production.",
  "A corporate worker reincarnates in another world as an aristocrat with the power to create everything she's seen in her favorite MMORPG.",
  "A young man's mundane life is turned upside down when his best friend is transformed into a beautiful girl.",
  "In a Japan where a strange disease causes humans to rust away, a young man and his crab-riding doctor friend search for a mushroom that can cure the disease.",
  "A shut-in gamer is reincarnated into a fantasy world that resembles his favorite MMORPG.",
  "A genius prince plots to sell off his country and live in luxury, but ends up having to save it instead.",
  "A sage reincarnates into a physically weak body and must find a way to grow stronger.",
  "An employee at a company that develops monsters for villainous organizations must balance her job and her crush on a superhero.",
  "The Wars of the Roses is reimagined with supernatural elements as the noble houses of York and Lancaster battle for the throne.",
  "A shy student develops feelings for a classmate who is obsessed with boys' love manga.",
  "In a futuristic Japan, tribes battle each other through a ballgame called \"XB.\"",
  "Five boys with completely different personalities form a futsal team.",
  "A master teaser continues to torment her classmate with tricks and pranks that straddle the line between annoying and endearing.",
  "Female police officers work together to improve their police box and fight crime.",
  "In a world where 99.9% of men have died from a virus, the few remaining males are forced into a program to repopulate"
];

const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Adventure" },
  { id: 3, name: "Comedy" },
  { id: 4, name: "Drama" },
  { id: 5, name: "Fantasy" },
  { id: 6, name: "Horror" },
  { id: 7, name: "Mystery" },
  { id: 8, name: "Romance" },
  { id: 9, name: "Sci-Fi" },
  { id: 10, name: "Slice of Life" },
  { id: 11, name: "Sports" },
  { id: 12, name: "Supernatural" },
  { id: 13, name: "Thriller" },
  { id: 14, name: "Mecha" },
  { id: 15, name: "Music" }
];

// Helper functions
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomGenres(count: number): number[] {
  // Get 2-4 random genre IDs
  const genreIds = new Set<number>();
  while (genreIds.size < count) {
    genreIds.add(getRandomInt(1, 15));
  }
  return Array.from(genreIds);
}

function getRandomStatus(): "Ongoing" | "Completed" | "Upcoming" {
  const statuses: ("Ongoing" | "Completed" | "Upcoming")[] = ["Ongoing", "Completed", "Upcoming"];
  return getRandomElement(statuses);
}

function getRandomType(): "TV" | "Movie" | "OVA" | "Special" {
  const types: ("TV" | "Movie" | "OVA" | "Special")[] = ["TV", "Movie", "OVA", "Special"];
  return getRandomElement(types);
}

function getRandomRating(): number {
  // Generate a rating between 6.0 and 9.8
  return parseFloat((Math.random() * 3.8 + 6.0).toFixed(1));
}

function getRandomReleaseYear(): number {
  // Generate a year between 2000 and 2025
  return getRandomInt(2000, 2025);
}

function getSampleImages(index: number): { cover: string, banner: string } {
  // List of sample anime images from public anime image sites
  const images = [
    {
      cover: "https://cdn.myanimelist.net/images/anime/1000/110531.jpg",
      banner: "https://cdn.myanimelist.net/images/anime/1000/110531l.jpg"
    },
    {
      cover: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
      banner: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg"
    },
    {
      cover: "https://cdn.myanimelist.net/images/anime/1170/124312.jpg",
      banner: "https://cdn.myanimelist.net/images/anime/1170/124312l.jpg"
    },
    {
      cover: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
      banner: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg"
    },
    {
      cover: "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
      banner: "https://cdn.myanimelist.net/images/anime/13/17405l.jpg"
    },
    {
      cover: "https://cdn.myanimelist.net/images/anime/3/40451.jpg",
      banner: "https://cdn.myanimelist.net/images/anime/3/40451l.jpg"
    },
    {
      cover: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
      banner: "https://cdn.myanimelist.net/images/anime/6/73245l.jpg"
    },
    {
      cover: "https://cdn.myanimelist.net/images/anime/1337/111940.jpg",
      banner: "https://cdn.myanimelist.net/images/anime/1337/111940l.jpg"
    },
    {
      cover: "https://cdn.myanimelist.net/images/anime/9/9453.jpg",
      banner: "https://cdn.myanimelist.net/images/anime/9/9453l.jpg"
    },
    {
      cover: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg",
      banner: "https://cdn.myanimelist.net/images/anime/1223/96541l.jpg"
    }
  ];
  return images[index % images.length];
}

function generateEpisodeTitle(animeTitle: string, seasonNumber: number, episodeNumber: number): string {
  const episodeTitles = [
    `${animeTitle} Begins`,
    `The Journey Starts`,
    `New Powers Awakened`,
    `Enemy Appears`,
    `The First Battle`,
    `Unexpected Alliance`,
    `Hidden Secrets`,
    `The Truth Revealed`,
    `A Difficult Choice`,
    `Betrayal`,
    `Reunion`,
    `Final Countdown`,
    `The Last Stand`,
    `Victory and Loss`,
    `New Horizons`,
    `Training Day`,
    `The Challenge`,
    `Darkness Falls`,
    `Light in the Dark`,
    `A New Hope`,
    `Friends and Foes`,
    `The Tournament Begins`,
    `Quarterfinals`,
    `Semifinals`,
    `The Championship`,
    `Aftermath`
  ];
  
  // Mix up episode titles based on season and episode number
  const titleIndex = (seasonNumber * 10 + episodeNumber) % episodeTitles.length;
  return episodeTitles[titleIndex];
}

function generateEpisodeDescription(animeTitle: string, episodeTitle: string): string {
  const descriptions = [
    `In this episode of ${animeTitle}, our heroes face their greatest challenge yet as they confront a powerful enemy.`,
    `The team discovers a shocking secret that changes everything they thought they knew about their mission.`,
    `A mysterious new character appears who may be friend or foe in the ongoing battle.`,
    `An epic battle unfolds as the protagonists must use all their powers to overcome overwhelming odds.`,
    `Emotions run high as relationships are tested and loyalties are questioned.`,
    `Training intensifies as the characters prepare for an upcoming challenge that will test their limits.`,
    `A journey into the past reveals important information about the origin of the main character's powers.`,
    `The heroes must race against time to prevent a catastrophe that threatens to destroy everything they love.`,
    `A quiet moment allows for character development and reflection on how far they've come.`,
    `The villains reveal their master plan, and it's more terrifying than anyone could have imagined.`
  ];
  
  return getRandomElement(descriptions);
}

async function main() {
  console.log("Starting to add 20 animes...");
  
  const TOTAL_ANIMES = 20;
  let successCount = 0;
  
  for (let i = 0; i < TOTAL_ANIMES; i++) {
    try {
      // Create anime entry
      const title = animeNames[i % animeNames.length];
      const description = animeDescriptions[i % animeDescriptions.length];
      const type = getRandomType();
      const status = getRandomStatus();
      const releaseYear = getRandomReleaseYear();
      const rating = getRandomRating();
      const duration = `${getRandomInt(20, 24)} min`;
      const images = getSampleImages(i);
      const featured = i < 10; // First 10 animes are featured
      
      const [anime] = await db.insert(animes).values({
        title,
        description,
        type,
        status,
        releaseYear,
        rating,
        duration,
        coverImage: images.cover,
        bannerImage: images.banner,
        featured
      }).returning();
      
      console.log(`Created anime: ${anime.title} (${i + 1}/${TOTAL_ANIMES})`);
      
      // Add genres
      const genreCount = getRandomInt(2, 4);
      const animeGenreIds = getRandomGenres(genreCount);
      
      for (const genreId of animeGenreIds) {
        await db.insert(animeGenres).values({
          animeId: anime.id,
          genreId
        });
      }
      
      console.log(`Added ${animeGenreIds.length} genres to ${anime.title}`);
      
      // Create seasons (1-4 seasons)
      const seasonCount = type === "Movie" ? 1 : getRandomInt(1, 4);
      
      for (let s = 1; s <= seasonCount; s++) {
        const seasonTitle = seasonCount === 1 && type === "Movie" 
          ? "Movie" 
          : `Season ${s}`;
        
        const [season] = await db.insert(seasons).values({
          animeId: anime.id,
          number: s,
          title: seasonTitle
        }).returning();
        
        console.log(`Created ${seasonTitle} for ${anime.title}`);
        
        // Create episodes (Movies have 1 episode, TV shows have 3-8 episodes per season)
        const episodeCount = type === "Movie" 
          ? 1 
          : type === "OVA" || type === "Special" 
            ? getRandomInt(1, 3) 
            : getRandomInt(3, 8);
        
        for (let e = 1; e <= episodeCount; e++) {
          const episodeTitle = generateEpisodeTitle(anime.title, s, e);
          const episodeDescription = generateEpisodeDescription(anime.title, episodeTitle);
          
          const [episode] = await db.insert(episodes).values({
            seasonId: season.id,
            number: e,
            title: episodeTitle,
            description: episodeDescription,
            duration: `${getRandomInt(20, 24)}:00`,
            thumbnail: anime.coverImage
          }).returning();
          
          if (e % 5 === 0 || e === episodeCount) {
            console.log(`Created episode ${e}/${episodeCount} for ${seasonTitle}`);
          }
          
          // Add video sources
          await db.insert(videoSources).values({
            episodeId: episode.id,
            quality: "720p",
            url: `https://example.com/video/${anime.id}/${s}/${e}/720p.mp4`,
            isDownloadable: true
          });
          
          await db.insert(videoSources).values({
            episodeId: episode.id,
            quality: "1080p",
            url: `https://example.com/video/${anime.id}/${s}/${e}/1080p.mp4`,
            isDownloadable: Math.random() > 0.5
          });
        }
      }
      
      successCount++;
    } catch (error) {
      console.error(`Error adding anime #${i+1}:`, error);
    }
  }
  
  console.log(`Successfully added ${successCount} animes with full seasons and episodes!`);
}

main().catch(e => {
  console.error("Error during adding animes:", e);
  process.exit(1);
}).finally(() => {
  process.exit(0);
});