import fs from 'fs';
import path from 'path';
import { PrismaClient, ContentType, ContentStatus, OttPlatform } from '@prisma/client';

import { movies } from '../prisma/data/movies.ts';
import { animes as staticAnimes } from '../prisma/data/animes.ts';
import { series } from '../prisma/data/series.ts';
import { kdramas } from '../prisma/data/kdramas.ts';
import { hollywood } from '../prisma/data/hollywood.ts';
import { cartoons } from '../prisma/data/cartoons.ts';
import { expandedContent as staticExpanded } from '../prisma/data/expanded_data.ts';

const prisma = new PrismaClient();

const TMDB_API_KEY = '4e44d9029b1270a757cddc766a1bcb63';

// 137 Telugu-confirmed anime titles
const titlesToImport = [
  "My Hero Academia", "TO BE HERO X", "Ninja Hattori-kun", "Doraemon", "Karna the Guardian",
  "The Warrior Princess and the Barbaric King", "Eren the Southpaw", "Marriage Toxin",
  "LIAR GAME", "An Observation Log of My Fiancée", "Agents of the Four Seasons",
  "Daemons of the Shadow Realm", "Release That Witch", "The Rising of the Shield Hero",
  "Easygoing Territory Defense", "My Hero Academia: Vigilantes", "You and I Are Polar Opposites",
  "Magic Maker", "Zenshu", "Tsukimichi: Moonlit Fantasy", "Gachiakuta", "A Gatherer's Adventure in Isekai",
  "Demon Slayer", "Vinland Saga", "Jujutsu Kaisen", "Radiant", "A Couple of Cuckoos",
  "My Dress-Up Darling", "Ranking of Kings", "Fire Force", "Akebi's Sailor Uniform",
  "Darling in the Franxx", "Trapped in a Dating Sim", "Metallic Rouge",
  "The Weakest Tamer Began a Journey to Pick Up Trash", "Sentenced to Be a Hero",
  "The Ancient Magus' Bride", "Assassination Classroom", "SPY x FAMILY",
  "That Time I Got Reincarnated as a Slime", "Gods' Games We Play", "Kaiju No. 8",
  "Chillin' in Another World with Level 2 Super Cheat Powers",
  "An Archdemon's Dilemma: How to Love Your Elf Bride", "Black Butler",
  "Mashle: Magic and Muscles", "Dr. STONE", "Dr. STONE: Ryusui", "Haikyu!!", "Kiteretsu",
  "Quality Assurance in Another World", "The Daily Life of the Immortal King",
  "The Strongest Magician in the Demon Lord's Army Was a Human",
  "Alya Sometimes Hides Her Feelings in Russian", "Wistoria: Wand and Sword",
  "No Longer Allowed in Another World", "Bye Bye, Earth", "Makeine: Too Many Losing Heroines!",
  "Shangri-La Frontier", "Frieren: Beyond Journey's End", "True Beauty",
  "Banished from the Hero's Party", "Nina the Starry Bride",
  "I'll Become a Villainess Who Goes Down in History", "Tying the Knot with an Amagami Sister",
  "365 Days to the Wedding", "Good Bye, Dragon Life", "Dan Da Dan", "You Are Ms. Servant",
  "Trillion Game", "Dragon Ball Daima", "Dead Mount Death Play", "Tower of God",
  "Berserk of Gluttony", "Possibly the Greatest Alchemist of All Time",
  "I'm Getting Married to a Girl I Hate in My Class", "The Apothecary Diaries",
  "The God of High School", "My Tiny Senpai", "I'm in Love with the Villainess",
  "Bucchigiri?!", "Naruto", "Attack on Titan",
  "As a Reincarnated Aristocrat, I'll Use My Appraisal Skill to Rise in the World",
  "The Magical Girl and the Evil Lieutenant Used to Be Archenemies", "Let This Grieving Soul Retire",
  "Paradox Live THE ANIMATION", "Ghost in the Shell: Stand Alone Complex", "Death Note",
  "Obocchama-kun", "The Share House's Secret Rule", "Taisho Era Contract Marriage",
  "Adam's Sweet Agony", "Yoasobi Gurashi!", "The Gorilla God's Go-To Girl",
  "Hokkaido Gals Are Super Adorable!", "The Great Cleric", "Wind Breaker", "Clevatess",
  "I Shall Survive Using Potions!", "Miss Kuroitsu from the Monster Development Department",
  "My Unique Skill Makes Me OP Even at Level 1", "Why Raeliana Ended Up at the Duke's Mansion",
  "Demon Lord, Retry!", "Robotics;Notes", "Shoot! Goal to the Future", "After School Dice Club",
  "My Status as an Assassin Obviously Exceeds the Hero's", "Girls' Frontline",
  "Heroines Run the Show", "A Wild Last Boss Appeared!", "Let's Play",
  "Tojima Wants to Be a Kamen Rider", "Mechanical Marie", "With You, Our Love Will Make It Through",
  "My Clueless First Friend", "If My Favorite Pop Idol Made It to the Budokan, I Would Die",
  "Hana-Kimi", "Dark Moon: The Blood Altar", "One Punch Man", "Dragon Ball Z Kai",
  "Zom 100: Bucket List of the Dead", "Hunter x Hunter",
  "Campfire Cooking in Another World with My Absurd Skill", "Shinchan", "Pokémon Horizons",
  "Mobile Suit Gundam: The Witch from Mercury", "Dragon Ball", "Kunon the Sorcerer Can See",
  "There Was a Cute Girl in the Hero's Party, So I Tried Confessing to Her",
  "An Adventurer's Daily Life", "Pokémon", "Trigun Stargaze",
  "A Misanthrope Teaches a Heroic Classroom", "Yuri on Ice", "Detective Conan", "Perman"
];

// Title mappings for external API search fallbacks
const titleMappings: Record<string, string> = {
  "A Misanthrope Teaches a Heroic Classroom": "A Misanthrope Teaches a Class for Demi-Humans",
  "Shinchan": "Crayon Shin-chan",
  "Let's Play": "Let's Play: Quest Darake no My Life",
  "Girls' Frontline": "Dolls' Frontline",
  "Obocchama-kun": "おぼっちゃまくん"
};

// Verified Whitelist of Telugu Dubbed Anime
const confirmedTeluguDubTitles = new Set<string>([
  "myheroacademia",
  "ninjahattorikun",
  "doraemon",
  "therisingoftheshieldhero",
  "tsukimichimoonlitfantasy",
  "agatherersadventureinisekai",
  "demonslayer",
  "vinlandsaga",
  "jujutsukaisen",
  "radiant",
  "acoupleofcuckoos",
  "mydressupdarling",
  "rankingofkings",
  "fireforce",
  "akebissailoruniform",
  "akebichan100manbu",
  "darlinginthefranxx",
  "trappedinadatingsim",
  "metallicrouge",
  "theweakesttamerbeganajourneytopickuptrash",
  "theancientmagusbride",
  "assassinationclassroom",
  "spyxfamily",
  "thattimeigotreincarnatedasaslime",
  "godsgamesweplay",
  "kaijuno8",
  "chillininanotherworldwithlevel2supercheatpowers",
  "anarchdemonsdilemmahowtoloveyourelfbride",
  "blackbutler",
  "mashlemagicandmuscles",
  "drstone",
  "drstonespecialepisoderyusui",
  "drstoneryusui",
  "haikyu",
  "haikyuu",
  "kiteretsu",
  "kiteretsuencyclopedia",
  "qualityassuranceinanotherworld",
  "thedailylifeoftheimmortalking",
  "thestrongestmagicianinthedemonlordsarmywasahuman",
  "alyasometimeshidesherfeelingsinrussian",
  "wistoriawandandsword",
  "nolongerallowedinanotherworld",
  "byebyeearth",
  "makeinetoomanylosingheroines",
  "shangrilafrontier",
  "truebeauty",
  "banishedfromtheherosparty",
  "ninathestarrybride",
  "illbecomeavillainesswhogoesdowninhistory",
  "tyingtheknotwithanamagamisister",
  "365daystothewedding",
  "goodbyedragonlife",
  "dandadan",
  "youaremsservant",
  "trilliongame",
  "dragonballdaima",
  "deadmountdeathplay",
  "towerofgod",
  "berserkofgluttony",
  "possiblythegreatestalchemistofalltime",
  "imgettingmarriedtoagirlihateinmyclass",
  "theapothecarydiaries",
  "thegodofhighschool",
  "mytinysenpai",
  "iminlovewiththevillainess",
  "bucchigiri",
  "naruto",
  "attackontitan",
  "asareincarnatedaristocratillusemyappraisalskilltoriseintheworld",
  "themagicalgirlandtheevillieutenantusedtobearchenemies",
  "letthisgrievingsoulretire",
  "paradoxlivetheanimation",
  "ghostintheshellstandalonecomplex",
  "deathnote",
  "obocchamakun",
  "thesharehousessecretrule",
  "taishoeracontractmarriage",
  "adamssweetagony",
  "yoasobigurashi",
  "thegorillagodsgotogirl",
  "hokkaidogalsaresuperadorable",
  "thegreatcleric",
  "windbreaker",
  "clevatess",
  "ishallsurviveusingpotions",
  "misskuroitsufromthemonsterdevelopmentdepartment",
  "myuniqueskillmakesmeopevenatlevel1",
  "whyraelianaendedupatthedukesmansion",
  "demonlordretry",
  "roboticsnotes",
  "shootgoaltothefuture",
  "afterschooldiceclub",
  "mystatusasanassassinovobviouslywoodexceedstheheros",
  "mystatusasanassassinovobviouslyexceedstheheros",
  "girlsfrontline",
  "heroinesruntheshow",
  "awildlastbossappeared",
  "letsplay",
  "tojimawantstobeakamenrider",
  "mycluelessfirstfriend",
  "ifmyfavoritepopidolmadeittothebudokaniwoulddie",
  "onepunchman",
  "dragonballzkai",
  "zom100bucketlistofthedead",
  "hunterxhunter",
  "campfirecookinginanotherworldwithmyabsurdskill",
  "shinchan",
  "crayonshinchan",
  "pokemonhorizons",
  "mobilesuitgundamthewitchfrommercury",
  "dragonball",
  "pokemon",
  "trigunstargaze",
  "yurionice",
  "detectiveconan",
  "perman"
]);

// Manual OTT platform overrides for classic TV-broadcast anime
const manualPlatforms: Record<string, { platform: OttPlatform; url: string | null }[]> = {
  "crayonshinchan": [{ platform: OttPlatform.HUNGAMA_TV, url: null }, { platform: OttPlatform.DISNEY_CHANNEL, url: null }],
  "shinchan": [{ platform: OttPlatform.HUNGAMA_TV, url: null }, { platform: OttPlatform.DISNEY_CHANNEL, url: null }],
  "doraemon": [{ platform: OttPlatform.DISNEY_CHANNEL, url: null }, { platform: OttPlatform.HUNGAMA_TV, url: null }, { platform: OttPlatform.JIO_HOTSTAR, url: null }],
  "perman": [{ platform: OttPlatform.NICK, url: null }, { platform: OttPlatform.HUNGAMA_TV, url: null }],
  "ninjahattorikun": [{ platform: OttPlatform.SONIC, url: null }, { platform: OttPlatform.NICK, url: null }, { platform: OttPlatform.NETFLIX, url: "https://www.netflix.com/title/81215419" }],
  "kiteretsu": [{ platform: OttPlatform.HUNGAMA_TV, url: null }, { platform: OttPlatform.POGO, url: null }],
  "kiteretsuencyclopedia": [{ platform: OttPlatform.HUNGAMA_TV, url: null }, { platform: OttPlatform.POGO, url: null }],
  "detectiveconan": [{ platform: OttPlatform.ETV_BAL_BHARAT, url: null }, { platform: OttPlatform.ETV_WIN, url: null }],
  "pokemon": [{ platform: OttPlatform.JIO_HOTSTAR, url: null }, { platform: OttPlatform.YOUTUBE, url: "https://www.youtube.com/@PokemonAsiaOfficial" }],
  "pokemonhorizons": [{ platform: OttPlatform.JIO_HOTSTAR, url: null }, { platform: OttPlatform.YOUTUBE, url: "https://www.youtube.com/@PokemonAsiaOfficial" }],
  "dragonball": [{ platform: OttPlatform.CARTOON_NETWORK, url: null }],
  "dragonballzkai": [{ platform: OttPlatform.CARTOON_NETWORK, url: null }],
  "hunterxhunter": [{ platform: OttPlatform.CARTOON_NETWORK, url: null }],
  "naruto": [{ platform: OttPlatform.SONY_YAY, url: null }]
};

// Helper to delay execution
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Normalize title for lookup (removes spaces and special chars)
function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Detect if string contains Telugu characters
function hasTelugu(text: string): boolean {
  return /[\u0c00-\u0c7f]/.test(text);
}

// Google Translate API helper
async function translateToTelugu(text: string): Promise<string> {
  if (!text) return '';
  // Clean description of HTML tags before translation
  const cleanText = text.replace(/<[^>]*>/g, '');
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=te&dt=t&q=${encodeURIComponent(cleanText)}`;
    const res = await fetch(url);
    if (res.status === 200) {
      const data = (await res.json()) as any;
      if (Array.isArray(data) && data[0]) {
        return data[0].map((x: any) => x[0]).join('');
      }
    }
  } catch (e: any) {
    console.error(`[Translate] Error: ${e.message}`);
  }
  return '';
}

// Map TMDB genre IDs to our internal genres list
function mapGenres(genreIds: number[]): string[] {
  const mapping: Record<number, string> = {
    28: 'Action',
    12: 'Adventure',
    35: 'Comedy',
    80: 'Crime',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'Historical',
    27: 'Horror',
    9648: 'Thriller',
    10749: 'Romance',
    878: 'Sci-Fi',
    10759: 'Action',
    10765: 'Sci-Fi'
  };
  const genres = new Set<string>();
  genreIds.forEach(id => {
    if (mapping[id]) genres.add(mapping[id]);
  });
  if (genres.size === 0) genres.add('Drama');
  return Array.from(genres);
}

// Map AniList genres to our internal genres
function mapAniListGenres(alGenres: string[]): string[] {
  const mapping: Record<string, string> = {
    'Action': 'Action',
    'Adventure': 'Adventure',
    'Comedy': 'Comedy',
    'Drama': 'Drama',
    'Fantasy': 'Fantasy',
    'Horror': 'Horror',
    'Romance': 'Romance',
    'Sci-Fi': 'Sci-Fi',
    'Sports': 'Sports',
    'Supernatural': 'Supernatural',
    'Thriller': 'Thriller',
    'Mystery': 'Thriller',
    'Psychological': 'Thriller'
  };
  const genres = new Set<string>();
  alGenres.forEach(g => {
    if (mapping[g]) genres.add(mapping[g]);
  });
  if (genres.size === 0) genres.add('Drama');
  return Array.from(genres);
}

// Map AniList status to ContentStatus
function mapStatus(alStatus: string): ContentStatus {
  switch (alStatus) {
    case 'FINISHED':
      return ContentStatus.COMPLETED;
    case 'RELEASING':
      return ContentStatus.ONGOING;
    case 'NOT_YET_RELEASED':
      return ContentStatus.UPCOMING;
    case 'CANCELLED':
      return ContentStatus.CANCELLED;
    case 'HIATUS':
      return ContentStatus.HIATUS;
    default:
      return ContentStatus.COMPLETED;
  }
}

// Map AniList external links to OttPlatform
function mapExternalLinks(links: any[]): { platform: OttPlatform; url: string }[] {
  if (!links || !Array.isArray(links)) return [];
  const mapped: { platform: OttPlatform; url: string }[] = [];
  const seenPlatforms = new Set<OttPlatform>();

  for (const link of links) {
    const site = link.site.toLowerCase();
    const url = link.url;
    let platform: OttPlatform | null = null;

    if (site.includes('crunchyroll')) {
      platform = OttPlatform.CRUNCHYROLL;
    } else if (site.includes('netflix')) {
      platform = OttPlatform.NETFLIX;
    } else if (site.includes('amazon') || site.includes('prime video')) {
      if (site.includes('anime times') || url.includes('anime_times')) {
        platform = OttPlatform.ANIME_TIMES;
      } else {
        platform = OttPlatform.AMAZON_PRIME;
      }
    } else if (site.includes('anime times')) {
      platform = OttPlatform.ANIME_TIMES;
    } else if (site.includes('youtube')) {
      if (url.includes('MuseAsia') || url.includes('MuseIndia') || url.includes('@MuseIndiaChannel')) {
        platform = OttPlatform.MUSE_INDIA_YT;
      } else {
        platform = OttPlatform.YOUTUBE;
      }
    } else if (site.includes('disney') || site.includes('hotstar')) {
      platform = OttPlatform.JIO_HOTSTAR;
    } else if (site.includes('jiocinema')) {
      platform = OttPlatform.JIO_HOTSTAR;
    } else if (site.includes('zee5')) {
      platform = OttPlatform.ZEE5;
    } else if (site.includes('sonyliv') || site.includes('sony liv')) {
      platform = OttPlatform.SONY_LIV;
    } else if (site.includes('aha')) {
      platform = OttPlatform.AHA;
    } else if (site.includes('etv win') || site.includes('etvwin')) {
      platform = OttPlatform.ETV_WIN;
    }

    if (platform && !seenPlatforms.has(platform)) {
      seenPlatforms.add(platform);
      mapped.push({ platform, url });
    }
  }
  return mapped;
}

// Map TMDB watch providers for India to OttPlatform
function mapTmdbProviders(tmdbData: any): { platform: OttPlatform; url: string }[] {
  const providers = tmdbData?.['watch/providers']?.results?.IN;
  if (!providers) return [];
  const mapped: { platform: OttPlatform; url: string }[] = [];
  const seenPlatforms = new Set<OttPlatform>();

  const list = [
    ...(providers.flatrate || []),
    ...(providers.free || []),
    ...(providers.ads || [])
  ];

  const link = providers.link || '';

  for (const item of list) {
    const id = item.provider_id;
    let platform: OttPlatform | null = null;

    if (id === 8) platform = OttPlatform.NETFLIX;
    else if (id === 119) platform = OttPlatform.AMAZON_PRIME;
    else if (id === 283) platform = OttPlatform.CRUNCHYROLL;
    else if (id === 122) platform = OttPlatform.JIO_HOTSTAR;
    else if (id === 220) platform = OttPlatform.JIO_HOTSTAR;
    else if (id === 232) platform = OttPlatform.ZEE5;
    else if (id === 237) platform = OttPlatform.SONY_LIV;
    else if (id === 425) platform = OttPlatform.ANIME_TIMES;
    else if (id === 121) platform = OttPlatform.YOUTUBE;

    if (platform && !seenPlatforms.has(platform)) {
      seenPlatforms.add(platform);
      mapped.push({ platform, url: link });
    }
  }
  return mapped;
}

// Fetch from AniList GraphQL API with retries
async function fetchAniList(title: string): Promise<any> {
  const query = `
    query ($search: String) {
      Page (page: 1, perPage: 1) {
        media (search: $search, type: ANIME) {
          id
          idMal
          title {
            romaji
            english
            native
          }
          description
          seasonYear
          episodes
          status
          genres
          averageScore
          countryOfOrigin
          externalLinks {
            site
            url
          }
          coverImage {
            extraLarge
            large
          }
          bannerImage
          studios(isMain: true) {
            nodes {
              name
            }
          }
        }
      }
    }
  `;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const res = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query, variables: { search: title } })
      });
      if (res.status === 200) {
        const data = (await res.json()) as any;
        return data?.data?.Page?.media?.[0] || null;
      }
      if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get('Retry-After') || '2', 10) * 1000;
        console.log(`  [AniList] Rate limited (429) for "${title}". Waiting ${retryAfter}ms (Attempt ${attempt}/5)...`);
        await sleep(retryAfter);
        continue;
      }
      console.warn(`  [AniList] Bad status ${res.status} for "${title}". Attempt ${attempt}/5.`);
    } catch (e: any) {
      console.error(`  [AniList] Network error for "${title}": ${e.message} (Attempt ${attempt}/5)`);
    }
    await sleep(1000 * attempt);
  }
  return null;
}

// Fetch from TMDB Search and details with retries
async function fetchTMDB(title: string, year?: number): Promise<any> {
  const searchUrl = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(title)}&api_key=${TMDB_API_KEY}`;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const res = await fetch(searchUrl);
      if (res.status === 200) {
        const data = (await res.json()) as any;
        const results = data.results || [];
        
        let best = null;
        if (year) {
          best = results.find((r: any) => {
            const dateStr = r.release_date || r.first_air_date;
            if (!dateStr) return false;
            const y = new Date(dateStr).getFullYear();
            return Math.abs(y - year) <= 1;
          });
        }
        
        if (!best) {
          best = results.find((r: any) => r.media_type === 'tv') || results.find((r: any) => r.media_type === 'movie') || results[0];
        }
        
        if (best) {
          const isTV = best.media_type === 'tv' || best.first_air_date !== undefined;
          const detailsUrl = `https://api.themoviedb.org/3/${isTV ? 'tv' : 'movie'}/${best.id}?api_key=${TMDB_API_KEY}&append_to_response=watch/providers`;
          for (let detAttempt = 1; detAttempt <= 3; detAttempt++) {
            try {
              const detailsRes = await fetch(detailsUrl);
              if (detailsRes.status === 200) {
                const detailsData = (await detailsRes.json()) as any;
                return { ...best, ...detailsData, isTV };
              }
              if (detailsRes.status === 429) {
                await sleep(2000);
                continue;
              }
            } catch (err: any) {
              console.error(`  [TMDB Details] Network error for ID ${best.id}: ${err.message}`);
            }
            await sleep(1000);
          }
        }
        return null;
      }
      if (res.status === 429) {
        console.log(`  [TMDB] Rate limited (429) for "${title}". Waiting 2000ms (Attempt ${attempt}/5)...`);
        await sleep(2000);
        continue;
      }
      console.warn(`  [TMDB] Bad status ${res.status} for "${title}". Attempt ${attempt}/5.`);
    } catch (e: any) {
      console.error(`  [TMDB] Network error for "${title}": ${e.message} (Attempt ${attempt}/5)`);
    }
    await sleep(1000 * attempt);
  }
  return null;
}

// Verify URL returns 200 OK
async function verifyImage(url: string): Promise<boolean> {
  if (!url) return false;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

// Main run function
async function run() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  
  console.log(`Starting Anime Database Update... Mode: ${isDryRun ? 'DRY-RUN' : 'LIVE'}`);
  
  // Task 1: Create Database Backup
  console.log('⏳ Creating database backup...');
  try {
    const backupData = await prisma.content.findMany({
      include: {
        genres: true,
        streamingLinks: true
      }
    });
    fs.writeFileSync('prisma/data/backup_before_import.json', JSON.stringify(backupData, null, 2));
    console.log(`✅ Database backup saved to prisma/data/backup_before_import.json (${backupData.length} records)`);
    
    // Backup static TS files
    fs.copyFileSync('prisma/data/animes.ts', 'prisma/data/animes.ts.bak');
    fs.copyFileSync('prisma/data/expanded_data.ts', 'prisma/data/expanded_data.ts.bak');
    console.log('✅ Static files backed up (.bak)');
  } catch (e: any) {
    console.error(`🚨 Backup failed: ${e.message}`);
    if (!isDryRun) {
      console.log('Stopping execution because backup failed.');
      process.exit(1);
    }
  }

  // Pre-Import Step: Cleanup stale/orphan records from database
  console.log('⏳ Purging orphaned/duplicate database records...');
  const staticSlugs = new Set<string>([
    ...movies.map(m => m.slug),
    ...staticAnimes.map(a => a.slug),
    ...series.map(s => s.slug),
    ...kdramas.map(k => k.slug),
    ...hollywood.map(h => h.slug),
    ...cartoons.map(c => c.slug),
    ...staticExpanded.map(e => e.slug),
  ]);
  const dbRecordsBefore = await prisma.content.findMany({
    select: { id: true, slug: true, titleEnglish: true, type: true }
  });
  const orphans = dbRecordsBefore.filter(r => !staticSlugs.has(r.slug));
  if (orphans.length > 0) {
    if (!isDryRun) {
      const deleteResult = await prisma.content.deleteMany({
        where: { id: { in: orphans.map(o => o.id) } }
      });
      console.log(`✅ Purged ${deleteResult.count} orphaned/stale duplicate records from database.`);
    } else {
      console.log(`[Dry Run] Would purge ${orphans.length} orphaned/stale duplicate records from database.`);
    }
  } else {
    console.log('✅ No stale/orphaned duplicate records found in database.');
  }

  // Load existing items from static files and database
  console.log('⏳ Loading existing anime records...');
  const dbAnimes = await prisma.content.findMany({
    where: { type: ContentType.ANIME }
  });
  console.log(`Loaded ${staticAnimes.length} static animes, ${staticExpanded.filter((c: any) => c.type === 'ANIME').length} static expanded animes, and ${dbAnimes.length} database animes.`);

  // Build a cache of existing records mapped by normalized titles and slugs for duplicate detection
  const existingMap = new Map<string, any>();
  const addtoCache = (item: any, fileOrigin: 'animes' | 'expanded' | 'db') => {
    const norm = normalizeTitle(item.titleEnglish || item.title?.en || '');
    const cacheObj = { ...item, fileOrigin };
    if (norm) {
      existingMap.set(norm, cacheObj);
    }
    const slug = item.slug;
    if (slug) {
      existingMap.set(slug, cacheObj);
    }
  };

  dbAnimes.forEach(item => addtoCache(item, 'db'));
  staticAnimes.forEach((item: any) => addtoCache(item, 'animes'));
  staticExpanded.forEach((item: any) => {
    if (item.type === 'ANIME') {
      addtoCache(item, 'expanded');
    }
  });

  // Fetch AniList/TMDB IDs of existing anime (to perform strict duplicate detection)
  console.log('⏳ Fetching IDs of existing anime records for strict matching...');
  const existingApiCachePath = 'prisma/data/existing_api_cache.json';
  let apiCache: Record<string, { aniListId?: number, tmdbId?: number, malId?: number }> = {};
  if (fs.existsSync(existingApiCachePath)) {
    apiCache = JSON.parse(fs.readFileSync(existingApiCachePath, 'utf8'));
    console.log(`Loaded ${Object.keys(apiCache).length} cached API IDs.`);
  }

  let existingItemsList = Array.from(new Set(existingMap.values()));
  const registerItemInCache = (item: any, fileOrigin: 'animes' | 'expanded' | 'db') => {
    addtoCache(item, fileOrigin);
    existingItemsList = Array.from(new Set(existingMap.values()));
  };
  for (const item of existingItemsList) {
    const title = item.titleEnglish || item.title?.en || '';
    const norm = normalizeTitle(title);
    const slug = item.slug;

    // Cache lookup using norm or slug
    const cacheKey = slug || norm;
    if (cacheKey && !apiCache[cacheKey]) {
      console.log(`  Fetching API IDs for existing anime: "${title}"...`);
      const al = await fetchAniList(title);
      const tm = await fetchTMDB(title, item.year || undefined);
      apiCache[cacheKey] = {
        aniListId: al?.id || undefined,
        tmdbId: tm?.id || undefined,
        malId: al?.idMal || undefined
      };
      await sleep(200);
    }
  }
  fs.writeFileSync(existingApiCachePath, JSON.stringify(apiCache, null, 2));
  console.log('✅ Existing API IDs cached.');

  // Initialize report metrics
  const report = {
    totalProcessed: 0,
    newAdded: [] as string[],
    updated: [] as string[],
    badgesAdded: [] as string[],
    duplicatesSkipped: [] as string[],
    warnings: [] as string[],
    failed: [] as string[],
    requiresManualReview: [] as string[]
  };

  const newStaticAnimes = [...staticAnimes];
  const newStaticExpanded = [...staticExpanded];
  const dbUpdatesQueue: any[] = [];

  // Set of titles we are importing (for badge checks)
  const importTitlesNormalized = new Set(titlesToImport.map(normalizeTitle));

  // Process the Telugu-confirmed titles list
  for (const rawTitle of titlesToImport) {
    report.totalProcessed++;
    const norm = normalizeTitle(rawTitle);
    console.log(`\n🔍 [${report.totalProcessed}/${titlesToImport.length}] Processing: "${rawTitle}"`);
    
    try {
      const searchTitle = titleMappings[rawTitle] || rawTitle;
      
      // 1. Query AniList & TMDB for this title
      const alData = await fetchAniList(searchTitle);
      const tmData = await fetchTMDB(searchTitle, alData?.seasonYear || undefined);
      
      if (!alData && !tmData) {
        console.warn(`  ❌ No metadata found on AniList or TMDB for: "${rawTitle}"`);
        report.failed.push(rawTitle);
        report.requiresManualReview.push(rawTitle);
        continue;
      }
      
      const titleEn = alData?.title?.english || alData?.title?.romaji || tmData?.name || tmData?.title || rawTitle;
      const titleOriginal = alData?.title?.native || tmData?.original_name || tmData?.original_title || null;
      const tmdbId = tmData?.id || null;
      const aniListId = alData?.id || null;
      const malId = alData?.idMal || null;
      const year = alData?.seasonYear || (tmData?.first_air_date ? new Date(tmData.first_air_date).getFullYear() : tmData?.release_date ? new Date(tmData.release_date).getFullYear() : null);
      
      // Determine if Telugu Dub is confirmed (on whitelist)
      const teluguDubAvail = confirmedTeluguDubTitles.has(norm);
      
      // Mapped Streaming Links / ottPlatforms
      const alLinks = mapExternalLinks(alData?.externalLinks || []);
      const tmdbLinks = mapTmdbProviders(tmData);
      
      const mergedLinksMap = new Map<OttPlatform, string | null>();
      tmdbLinks.forEach(l => mergedLinksMap.set(l.platform, l.url));
      alLinks.forEach(l => mergedLinksMap.set(l.platform, l.url));
      
      // Apply manual fallbacks
      const manual = manualPlatforms[norm] || manualPlatforms[normalizeTitle(titleEn)];
      if (manual) {
        manual.forEach(m => mergedLinksMap.set(m.platform, m.url));
      }
      
      const ottPlatforms = Array.from(mergedLinksMap.entries()).map(([platform, url]) => ({
        platform,
        url
      }));

      // 2. Strict duplicate check
      let matchedItem: any = null;
      for (const item of existingItemsList) {
        const itemNorm = normalizeTitle(item.titleEnglish || item.title?.en || '');
        const cachedIds = apiCache[item.slug] || apiCache[itemNorm] || {};
        
        const aniListMatch = aniListId && cachedIds.aniListId === aniListId;
        const tmdbMatch = tmdbId && cachedIds.tmdbId === tmdbId;
        const malMatch = malId && cachedIds.malId === malId;
        const titleMatch = itemNorm === norm || item.slug === `${norm}-${year}`;
        
        if (aniListMatch || tmdbMatch || malMatch || titleMatch) {
          matchedItem = item;
          break;
        }
      }

      if (matchedItem) {
        // Case: Existing Title
        const existingTitle = matchedItem.titleEnglish || matchedItem.title?.en || rawTitle;
        console.log(`  Match found: "${existingTitle}" (Slug: ${matchedItem.slug}, Origin: ${matchedItem.fileOrigin})`);
        
        let needsUpdate = false;
        const fieldsToUpdate: string[] = [];

        // Determine if we need to update the Telugu Badge
        const alreadyHasBadge = matchedItem.teluguDubAvail === true;
        if (alreadyHasBadge !== teluguDubAvail) {
          needsUpdate = true;
          fieldsToUpdate.push(`teluguDubAvail = ${teluguDubAvail}`);
          if (teluguDubAvail) {
            report.badgesAdded.push(existingTitle);
          }
        } else {
          report.duplicatesSkipped.push(existingTitle);
        }

        // Validate artwork
        let posterUrl = matchedItem.poster;
        let bannerUrl = matchedItem.banner;
        if (!posterUrl) {
          const testPoster = tmData?.poster_path ? `https://image.tmdb.org/t/p/w500${tmData.poster_path}` : alData?.coverImage?.extraLarge || alData?.coverImage?.large || null;
          if (testPoster && await verifyImage(testPoster)) {
            posterUrl = testPoster;
            needsUpdate = true;
            fieldsToUpdate.push('poster');
          }
        }
        if (!bannerUrl) {
          const testBanner = tmData?.backdrop_path ? `https://image.tmdb.org/t/p/original${tmData.backdrop_path}` : alData?.bannerImage || null;
          if (testBanner && await verifyImage(testBanner)) {
            bannerUrl = testBanner;
            needsUpdate = true;
            fieldsToUpdate.push('banner');
          }
        }

        // Preservation of manual translation fields
        let titleTe = matchedItem.titleTelugu || matchedItem.title?.te || null;
        let descTe = matchedItem.descriptionTelugu || matchedItem.description?.te || null;
        let descEn = matchedItem.descriptionEnglish || matchedItem.description?.en || alData?.description || tmData?.overview || null;

        // Auto-translate only if missing (contains no Telugu characters)
        if (!titleTe || !hasTelugu(titleTe)) {
          const translatedTitle = await translateToTelugu(titleEn);
          if (translatedTitle) {
            titleTe = translatedTitle;
            needsUpdate = true;
            fieldsToUpdate.push('titleTelugu');
          }
        }
        if (!descTe || !hasTelugu(descTe)) {
          const rawDesc = alData?.description || tmData?.overview || '';
          const cleanDesc = rawDesc.replace(/<[^>]*>/g, ''); // strip HTML
          if (cleanDesc) {
            const translatedDesc = await translateToTelugu(cleanDesc);
            if (translatedDesc) {
              descTe = translatedDesc;
              needsUpdate = true;
              fieldsToUpdate.push('descriptionTelugu');
            }
          }
        }

        // Anime metadata checks (episodes, seasons, studio, etc.)
        let totalEpisodes = matchedItem.totalEpisodes || alData?.episodes || null;
        let totalSeasons = matchedItem.totalSeasons || (tmData?.isTV ? tmData.number_of_seasons : null) || 1;
        let studio = matchedItem.studio || alData?.studios?.nodes?.[0]?.name || tmData?.production_companies?.[0]?.name || null;
        let malRating = matchedItem.malRating || (alData?.averageScore ? alData.averageScore / 10 : null) || null;
        let imdbRating = matchedItem.imdbRating || tmData?.vote_average || null;

        if (matchedItem.totalEpisodes !== totalEpisodes) { needsUpdate = true; fieldsToUpdate.push('totalEpisodes'); }
        if (matchedItem.totalSeasons !== totalSeasons) { needsUpdate = true; fieldsToUpdate.push('totalSeasons'); }
        if (matchedItem.studio !== studio) { needsUpdate = true; fieldsToUpdate.push('studio'); }
        if (matchedItem.malRating !== malRating) { needsUpdate = true; fieldsToUpdate.push('malRating'); }

        // Mapped streaming links check: update if the existing item has empty or missing ottPlatforms
        const existingOtts = matchedItem.ottPlatforms || [];
        const hasMissingStreamingLinks = existingOtts.length === 0 && ottPlatforms.length > 0;
        if (hasMissingStreamingLinks) {
          needsUpdate = true;
          fieldsToUpdate.push('ottPlatforms');
        }

        if (needsUpdate) {
          console.log(`  Updating fields: [${fieldsToUpdate.join(', ')}]`);
          report.updated.push(existingTitle);

          const updatedItem = {
            ...matchedItem,
            poster: posterUrl,
            banner: bannerUrl,
            title: { en: titleEn, te: titleTe || titleEn },
            description: { en: descEn?.replace(/<[^>]*>/g, '') || '', te: descTe || '' },
            totalEpisodes,
            totalSeasons,
            studio,
            malRating,
            imdbRating,
            teluguDubAvail,
            teluguSubAvail: true,
            ottPlatforms: ottPlatforms.length > 0 ? ottPlatforms : existingOtts
          };

          // Update static arrays in memory
          if (matchedItem.fileOrigin === 'animes') {
            const idx = newStaticAnimes.findIndex(x => x.slug === matchedItem.slug);
            if (idx !== -1) {
              newStaticAnimes[idx] = updatedItem;
            }
          } else if (matchedItem.fileOrigin === 'expanded') {
            const idx = newStaticExpanded.findIndex(x => x.slug === matchedItem.slug);
            if (idx !== -1) {
              newStaticExpanded[idx] = updatedItem;
            }
          }

          // Push to DB updates queue
          dbUpdatesQueue.push({
            slug: matchedItem.slug,
            data: {
              titleEnglish: titleEn,
              titleTelugu: titleTe,
              descriptionEnglish: descEn?.replace(/<[^>]*>/g, ''),
              descriptionTelugu: descTe,
              poster: posterUrl,
              banner: bannerUrl,
              totalEpisodes,
              totalSeasons,
              studio,
              malRating,
              imdbRating,
              teluguDubAvail,
              teluguSubAvail: true,
              ottPlatforms: ottPlatforms.length > 0 ? ottPlatforms : existingOtts
            }
          });

          // Dynamically register in-memory cache to prevent intra-batch duplicates
          registerItemInCache(updatedItem, matchedItem.fileOrigin);
        }
      } else {
        // Case: New Title
        console.log(`  No match found. Constructing new anime: "${titleEn}"`);
        
        // Artwork validation
        const tmdbPoster = tmData?.poster_path ? `https://image.tmdb.org/t/p/w500${tmData.poster_path}` : null;
        const alPoster = alData?.coverImage?.extraLarge || alData?.coverImage?.large || null;
        const posterUrl = tmdbPoster || alPoster;

        const tmdbBanner = tmData?.backdrop_path ? `https://image.tmdb.org/t/p/original${tmData.backdrop_path}` : null;
        const alBanner = alData?.bannerImage || null;
        const bannerUrl = tmdbBanner || alBanner;
        
        if (posterUrl && !(await verifyImage(posterUrl))) {
          report.warnings.push(`Broken poster URL for new title "${titleEn}"`);
        }
        
        // Translate synopsis/title
        const titleTe = await translateToTelugu(titleEn);
        const rawDesc = alData?.description || tmData?.overview || '';
        const descTe = await translateToTelugu(rawDesc);
        
        // Detect native country and language
        let language = 'Japanese';
        if (alData?.countryOfOrigin === 'CN') language = 'Chinese';
        else if (alData?.countryOfOrigin === 'KR') language = 'Korean';
        
        const country = alData?.countryOfOrigin === 'JP' ? 'Japan' : alData?.countryOfOrigin === 'CN' ? 'China' : alData?.countryOfOrigin === 'KR' ? 'South Korea' : 'Japan';

        // Genres mapping
        const genres = alData?.genres ? mapAniListGenres(alData.genres) : tmData?.genre_ids ? mapGenres(tmData.genre_ids) : ['Drama'];

        const slug = `${titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${year || 2025}`;

        const newItem = {
          slug,
          type: 'ANIME',
          status: mapStatus(alData?.status || 'FINISHED'),
          poster: posterUrl,
          banner: bannerUrl,
          title: {
            en: titleEn,
            te: titleTe || titleEn
          },
          titleOriginal: titleOriginal,
          description: {
            en: rawDesc.replace(/<[^>]*>/g, '') || `${titleEn} is an anime series.`,
            te: descTe || `${titleEn} అనేది ఒక యానిమే సిరీస్.`
          },
          genres,
          year: year || 2025,
          totalEpisodes: alData?.episodes || null,
          totalSeasons: tmData?.isTV ? tmData.number_of_seasons : 1,
          imdbRating: tmData?.vote_average || null,
          malRating: alData?.averageScore ? alData.averageScore / 10 : null,
          studio: alData?.studios?.nodes?.[0]?.name || tmData?.production_companies?.[0]?.name || null,
          language,
          country,
          teluguDubAvail,
          teluguSubAvail: true,
          hindiDubAvail: false,
          isFeatured: false,
          isTrending: false,
          isTopRated: (alData?.averageScore || 0) >= 80,
          trendingScore: tmData?.popularity ? Math.round(tmData.popularity / 10) : 0,
          popularityScore: tmData?.popularity ? Math.round(tmData.popularity / 5) : 0,
          ottPlatforms
        };

        newStaticAnimes.push(newItem);
        report.newAdded.push(titleEn);

        // Push to DB updates queue (new record)
        dbUpdatesQueue.push({
          slug,
          isNew: true,
          data: newItem
        });

        // Register new item dynamically in the in-memory cache to prevent duplicates
        registerItemInCache(newItem, 'animes');

        // Dynamically save the new IDs in cache
        const cacheKey = slug;
        apiCache[cacheKey] = {
          aniListId: aniListId || undefined,
          tmdbId: tmdbId || undefined,
          malId: malId || undefined
        };
        apiCache[norm] = {
          aniListId: aniListId || undefined,
          tmdbId: tmdbId || undefined,
          malId: malId || undefined
        };
      }
    } catch (e: any) {
      console.error(`  ❌ Error processing "${rawTitle}": ${e.message}`);
      report.failed.push(rawTitle);
    }
    
    // Polite API throttle
    await sleep(250);
  }

  // Save the updated API cache file
  fs.writeFileSync(existingApiCachePath, JSON.stringify(apiCache, null, 2));

  // Generate Dry Run Report
  const dryRunReport = {
    summary: {
      totalProcessed: report.totalProcessed,
      newAddedCount: report.newAdded.length,
      updatedCount: report.updated.length,
      badgesAddedCount: report.badgesAdded.length,
      duplicatesSkippedCount: report.duplicatesSkipped.length,
      warningsCount: report.warnings.length,
      failedCount: report.failed.length,
      requiresManualReviewCount: report.requiresManualReview.length
    },
    newAddedTitles: report.newAdded,
    updatedTitles: report.updated,
    badgesAddedTitles: report.badgesAdded,
    duplicatesSkippedTitles: report.duplicatesSkipped,
    warnings: report.warnings,
    failedTitles: report.failed,
    requiresManualReview: report.requiresManualReview
  };

  fs.writeFileSync('prisma/data/dry_run_report.json', JSON.stringify(dryRunReport, null, 2));
  console.log('\n==========================================');
  console.log('🏁 Anime Database Update Report generated!');
  console.log(`- Total Titles Processed: ${dryRunReport.summary.totalProcessed}`);
  console.log(`- New Titles to Add: ${dryRunReport.summary.newAddedCount}`);
  console.log(`- Existing Titles to Update: ${dryRunReport.summary.updatedCount}`);
  console.log(`- Telugu Badges to Add: ${dryRunReport.summary.badgesAddedCount}`);
  console.log(`- Duplicates Skipped: ${dryRunReport.summary.duplicatesSkippedCount}`);
  console.log(`- Warnings: ${dryRunReport.summary.warningsCount}`);
  console.log(`- Failed: ${dryRunReport.summary.failedCount}`);
  console.log(`- Requiring Manual Review: ${dryRunReport.summary.requiresManualReviewCount}`);
  console.log('==========================================\n');

  if (isDryRun) {
    console.log('DRY-RUN completed. No changes written to database or static files.');
    await prisma.$disconnect();
    process.exit(0);
  }

  // LIVE execution writes to files and DB
  console.log('⏳ LIVE Mode: Writing changes to static files...');
  
  // Write to prisma/data/animes.ts
  const animesOutputPath = path.resolve('prisma/data/animes.ts');
  const animesFileContent = `import { ContentType, ContentStatus } from '@prisma/client'

export const animes = ${JSON.stringify(newStaticAnimes, null, 2)}
`;
  fs.writeFileSync(animesOutputPath, animesFileContent, 'utf8');
  console.log('✅ Updated prisma/data/animes.ts');

  // Write to prisma/data/expanded_data.ts
  const expandedOutputPath = path.resolve('prisma/data/expanded_data.ts');
  const expandedFileContent = `export const expandedContent = ${JSON.stringify(newStaticExpanded, null, 2)}
`;
  fs.writeFileSync(expandedOutputPath, expandedFileContent, 'utf8');
  console.log('✅ Updated prisma/data/expanded_data.ts');

  // LIVE execution updates DB
  console.log('⏳ LIVE Mode: Updating Neon PostgreSQL database...');
  
  for (const item of dbUpdatesQueue) {
    try {
      if (item.isNew) {
        // Upsert new content
        const dbContent = await prisma.content.upsert({
          where: { slug: item.data.slug },
          update: {},
          create: {
            slug: item.data.slug,
            type: ContentType.ANIME,
            status: item.data.status,
            poster: item.data.poster,
            banner: item.data.banner,
            titleEnglish: item.data.title.en,
            titleTelugu: item.data.title.te,
            titleOriginal: item.data.titleOriginal,
            descriptionEnglish: item.data.description.en,
            descriptionTelugu: item.data.description.te,
            year: item.data.year,
            totalEpisodes: item.data.totalEpisodes,
            totalSeasons: item.data.totalSeasons,
            imdbRating: item.data.imdbRating,
            malRating: item.data.malRating,
            studio: item.data.studio,
            language: item.data.language,
            country: item.data.country,
            teluguDubAvail: item.data.teluguDubAvail,
            teluguSubAvail: true,
            hindiDubAvail: false,
            isFeatured: false,
            isTrending: false,
            isTopRated: item.data.isTopRated,
            trendingScore: item.data.trendingScore,
            popularityScore: item.data.popularityScore
          }
        });

        // Insert genres relations
        for (const gName of item.data.genres) {
          const gSlug = gName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const genre = await prisma.genre.findUnique({ where: { slug: gSlug } });
          if (genre) {
            await prisma.contentGenre.upsert({
              where: { contentId_genreId: { contentId: dbContent.id, genreId: genre.id } },
              update: {},
              create: { contentId: dbContent.id, genreId: genre.id }
            });
          }
        }

        // Insert streaming links
        if (item.data.ottPlatforms) {
          for (const p of item.data.ottPlatforms) {
            await prisma.streamingLink.upsert({
              where: {
                contentId_platform: {
                  contentId: dbContent.id,
                  platform: p.platform
                }
              },
              update: {
                url: p.url || null,
                isTeluguDub: item.data.teluguDubAvail || false,
                isAvailable: true
              },
              create: {
                contentId: dbContent.id,
                platform: p.platform,
                url: p.url || null,
                isTeluguDub: item.data.teluguDubAvail || false,
                isAvailable: true,
                isPremium: true
              }
            });
          }
        }
        console.log(`  Added new anime to DB: "${item.data.title.en}"`);
      } else {
        // Find existing record in database by slug
        const dbContent = await prisma.content.findUnique({
          where: { slug: item.slug }
        });
        if (dbContent) {
          // Update existing content
          await prisma.content.update({
            where: { id: dbContent.id },
            data: {
              titleEnglish: item.data.titleEnglish,
              titleTelugu: item.data.titleTelugu,
              descriptionEnglish: item.data.descriptionEnglish,
              descriptionTelugu: item.data.descriptionTelugu,
              poster: item.data.poster,
              banner: item.data.banner,
              totalEpisodes: item.data.totalEpisodes,
              totalSeasons: item.data.totalSeasons,
              studio: item.data.studio,
              malRating: item.data.malRating,
              imdbRating: item.data.imdbRating,
              teluguDubAvail: item.data.teluguDubAvail
            }
          });

          // Update/Insert streaming links
          if (item.data.ottPlatforms) {
            for (const p of item.data.ottPlatforms) {
              await prisma.streamingLink.upsert({
                where: {
                  contentId_platform: {
                    contentId: dbContent.id,
                    platform: p.platform
                  }
                },
                update: {
                  url: p.url || null,
                  isTeluguDub: item.data.teluguDubAvail || false,
                  isAvailable: true
                },
                create: {
                  contentId: dbContent.id,
                  platform: p.platform,
                  url: p.url || null,
                  isTeluguDub: item.data.teluguDubAvail || false,
                  isAvailable: true,
                  isPremium: true
                }
              });
            }
          }
          console.log(`  Updated existing anime in DB: "${item.data.titleEnglish}"`);
        }
      }
    } catch (e: any) {
      console.error(`  ❌ Database error for "${item.slug}": ${e.message}`);
      report.failed.push(item.slug);
    }
  }
  
  console.log('✅ Neon PostgreSQL database updates completed.');
  await prisma.$disconnect();
}

run().catch(async (e) => {
  console.error('Fatal crash running script:', e);
  await prisma.$disconnect();
  process.exit(1);
});
