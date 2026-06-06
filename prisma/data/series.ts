import { ContentType, ContentStatus } from '@prisma/client'

export const series = [
  {
    slug: 'dark',
    type: ContentType.SERIES,
    status: ContentStatus.COMPLETED,
    poster: 'https://image.tmdb.org/t/p/w500/1DLjjvSWMYo17B7wuz6YikB96hH.jpg',
    banner: 'https://image.tmdb.org/t/p/original/3jDXL4Xvj3AzDOF6UH1xeyHW8MH.jpg',
    trailer: 'https://www.youtube.com/embed/ESR7ES24ZgE',
    title: {
      en: "Dark",
      te: "డార్క్"
    },
    description: {
      en: "A family saga with a supernatural twist, set in a German town where the disappearance of two young children exposes the relationships among four families.",
      te: "ఒక జర్మన్ చిన్న గ్రామంలో ఇద్దరు పిల్లలు అదృశ్యం కావడంతో కాలచక్రం (Time Travel) లో నాలుగు కుటుంబాల గత రహస్యాలు ఎలా ముడిపడి ఉన్నాయో తెలిసే సస్పెన్స్ కథ."
    },
    genres: ["Sci-Fi","Thriller","Supernatural"],
    year: 2017,
    totalEpisodes: 26,
    totalSeasons: 3,
    imdbRating: 8.7,
    studio: 'Wiedemann & Berg Television',
    language: 'German',
    country: 'Germany',
    ottPlatforms: ["NETFLIX"],
    teluguDubAvail: false,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: false,
    isTrending: false,
    isTopRated: true,
    trendingScore: 82,
    popularityScore: 93,
    similarSlugs: ["stranger-things","wednesday"]
  },
  {
    slug: 'farzi',
    type: ContentType.SERIES,
    status: ContentStatus.ONGOING,
    poster: 'https://image.tmdb.org/t/p/w500/cTS86RwEBIDgCgUmjWQTSoPsK6p.jpg',
    banner: 'https://image.tmdb.org/t/p/original/rGkjtv6UdL1ysDmZuBjbNl3PAA1.jpg',
    trailer: 'https://www.youtube.com/embed/yG129PdT8X4',
    title: {
      en: "Farzi",
      te: "ఫర్జీ"
    },
    description: {
      en: "An artist who designs a fake currency note is pulled into a high-stakes con game, pursued by a fiery task force officer determined to rid the country of counterfeits.",
      te: "తన తాతయ్య ప్రింటింగ్ ప్రెస్ ని కాపాడుకోవడానికి సన్నీ అనే చిత్రకారుడు నకిలీ నోట్లను ప్రింట్ చేయడం మొదలుపెట్టి మాఫియా కింగ్ మైఖేల్ కంటపడతాడు."
    },
    genres: ["Thriller","Crime","Drama"],
    year: 2023,
    totalEpisodes: 8,
    totalSeasons: 1,
    imdbRating: 8.4,
    studio: 'D2R Films',
    language: 'Hindi',
    country: 'India',
    ottPlatforms: [{platform:"AMAZON_PRIME",url:"https://www.primevideo.com/detail/Farzi/0PDOKU97WP28J99316J4H9E3BS"}],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: false,
    isTrending: true,
    isTopRated: false,
    trendingScore: 90,
    popularityScore: 93,
    similarSlugs: ["the-family-man","sacred-games"]
  },
  {
    slug: 'house-of-the-dragon',
    type: ContentType.SERIES,
    status: ContentStatus.ONGOING,
    poster: 'https://image.tmdb.org/t/p/w500/7V0Ebks0GgpKvQ7QbLAIdX5dos4.jpg',
    banner: 'https://image.tmdb.org/t/p/original/577eXC8wFQT0eUrJcgznSiFPRmk.jpg',
    trailer: 'https://www.youtube.com/embed/DotnJ7tTA34',
    title: {
      en: "House of the Dragon",
      te: "హౌస్ ఆఫ్ ది డ్రాగన్"
    },
    description: {
      en: "An internal succession war within House Targaryen at the height of their power, 172 years before the birth of Daenerys Targaryen.",
      te: "గేమ్ ఆఫ్ థ్రోన్స్ కంటే 200 సంవత్సరాల క్రితం డ్రాగన్లు బ్రతికి ఉన్న కాలంలో టార్గర్యెన్ రాజవంశంలో రాజు వారసత్వం కోసం జరిగిన భయంకరమైన అంతర్యుద్ధం."
    },
    genres: ["Fantasy","Drama"],
    year: 2022,
    totalEpisodes: 18,
    totalSeasons: 2,
    imdbRating: 8.4,
    studio: 'HBO Entertainment',
    language: 'English',
    country: 'United States',
    ottPlatforms: ["JIO_HOTSTAR"],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: false,
    isTrending: true,
    isTopRated: true,
    trendingScore: 92,
    popularityScore: 96,
    similarSlugs: ["stranger-things"]
  },
  {
    slug: 'mirzapur',
    type: ContentType.SERIES,
    status: ContentStatus.ONGOING,
    poster: 'https://image.tmdb.org/t/p/w500/1rxLUFVrtTo82OxhbDXJDiJVkwL.jpg',
    banner: 'https://image.tmdb.org/t/p/original/3dV7pWAdwIPKR2lMIACMfObXdgK.jpg',
    trailer: 'https://www.youtube.com/embed/ZNeGFyY14UY',
    title: {
      en: "Mirzapur",
      te: "మిర్జాపూర్"
    },
    description: {
      en: "A shocking incident at a wedding procession ignites a series of events, entangling the lives of two families in the lawless city of Mirzapur.",
      te: "ఒక పెళ్లి బారాత్ లో జరిగిన అనుకోని కాల్పుల సంఘటన, మిర్జాపూర్ అనే ఊరిలో ఒక పెద్ద గ్యాంగ్ వార్ కి దారితీసి రెండు కుటుంబాల మధ్య వైరాన్ని పెంచుతుంది."
    },
    genres: ["Action","Crime","Thriller","Drama"],
    year: 2018,
    totalEpisodes: 30,
    totalSeasons: 3,
    imdbRating: 8.5,
    studio: 'Excel Entertainment',
    language: 'Hindi',
    country: 'India',
    ottPlatforms: [{platform:"AMAZON_PRIME",url:"https://www.primevideo.com/detail/Mirzapur/0PDOKU97WP28J99316J4H9E3BS"}],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: false,
    isTrending: true,
    isTopRated: true,
    trendingScore: 92,
    popularityScore: 95,
    similarSlugs: ["sacred-games","farzi"]
  },
  {
    slug: 'panchayat',
    type: ContentType.SERIES,
    status: ContentStatus.ONGOING,
    poster: 'https://image.tmdb.org/t/p/w500/xrfvAhrMdT6Uwg5fyTyQAZBYyiu.jpg',
    banner: 'https://image.tmdb.org/t/p/original/iZ8EtGAqKWZdRJPzWfFseNfVxjh.jpg',
    trailer: 'https://www.youtube.com/embed/959bS10v2a8',
    title: {
      en: "Panchayat",
      te: "పంచాయతీ"
    },
    description: {
      en: "An engineering graduate takes up a low-paying job as a secretary of a panchayat office in a remote village due to lack of better job options.",
      te: "చదువు పూర్తి చేసుకున్న అభిషేక్ అనే కుర్రాడికి మంచి ఉద్యోగం దొరక్కపోవడంతో ఫులేరా అనే ఒక మారుమూల పల్లెటూర్లో పంచాయతీ ఆఫీసు కార్యదర్శిగా చేరి ఎలాంటి కష్టాలు పడ్డాడో చూపే హాస్యభరిత కథ."
    },
    genres: ["Comedy","Drama","Family"],
    year: 2020,
    totalEpisodes: 24,
    totalSeasons: 3,
    imdbRating: 8.9,
    studio: 'The Viral Fever',
    language: 'Hindi',
    country: 'India',
    ottPlatforms: [{platform:"AMAZON_PRIME",url:"https://www.primevideo.com/detail/Panchayat/0GDOKU97WP28J99316J4H9E3BS"}],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: false,
    isTrending: true,
    isTopRated: true,
    trendingScore: 95,
    popularityScore: 97,
    similarSlugs: ["the-family-man"]
  },
  {
    slug: 'sacred-games',
    type: ContentType.SERIES,
    status: ContentStatus.COMPLETED,
    poster: 'https://image.tmdb.org/t/p/w500/uEbNtFbK4At9WBDGap23lt1qO9n.jpg',
    banner: 'https://image.tmdb.org/t/p/original/qtac9X9lSLqZFbxS71347N8MiID.jpg',
    trailer: 'https://www.youtube.com/embed/c5o8q6S9v2c',
    title: {
      en: "Sacred Games",
      te: "సేక్రేడ్ గేమ్స్"
    },
    description: {
      en: "A link in their pasts leads an honest cop to a fugitive gang boss whose cryptic warning spurs the officer on a quest to save Mumbai from cataclysm.",
      te: "ఒక ముంబై పోలీస్ ఆఫీసర్ సర్తాజ్ సింగ్ కి ఒక మోస్ట్ వాంటెడ్ గ్యాంగ్ స్టర్ గణేష్ గైతోండే నుండి ముంబై నగరాన్ని 25 రోజుల్లో కాపాడాలంటూ బెదిరింపు ఫోన్ కాల్ వస్తుంది."
    },
    genres: ["Crime","Thriller","Drama"],
    year: 2018,
    totalEpisodes: 16,
    totalSeasons: 2,
    imdbRating: 8.5,
    studio: 'Phantom Films',
    language: 'Hindi',
    country: 'India',
    ottPlatforms: [{platform:"NETFLIX",url:"https://www.netflix.com/title/80115328"}],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: false,
    isTrending: false,
    isTopRated: true,
    trendingScore: 78,
    popularityScore: 91,
    similarSlugs: ["mirzapur","farzi"]
  },
  {
    slug: 'stranger-things',
    type: ContentType.SERIES,
    status: ContentStatus.ONGOING,
    poster: 'https://image.tmdb.org/t/p/w500/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg',
    banner: 'https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
    trailer: 'https://www.youtube.com/embed/b9EkMc79ZSU',
    title: {
      en: "Stranger Things",
      te: "స్ట్రేంజర్ థింగ్స్"
    },
    description: {
      en: "When a young boy vanishes, a town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
      te: "ఆక్రిన్స్ అనే ఊరిలో ఒక పిల్లాడు అదృశ్యమయిన తర్వాత, అతని స్నేహితులు మరియు ఒక వింత శక్తులు గల అమ్మాయి ఎలెవెన్ ఆ రహస్యాలను ఎలా కనిపెట్టారనేది వింతల కథ."
    },
    genres: ["Sci-Fi","Supernatural","Horror","Drama"],
    year: 2016,
    totalEpisodes: 34,
    totalSeasons: 4,
    imdbRating: 8.7,
    studio: '21 Laps Entertainment',
    language: 'English',
    country: 'United States',
    ottPlatforms: [{platform:"NETFLIX",url:"https://www.netflix.com/title/80057281"}],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: false,
    isTrending: true,
    isTopRated: true,
    trendingScore: 94,
    popularityScore: 97,
    similarSlugs: ["wednesday","dark"]
  },
  {
    slug: 'the-boys',
    type: ContentType.SERIES,
    status: ContentStatus.ONGOING,
    poster: 'https://image.tmdb.org/t/p/w500/in1R2dDc421JxsoRWaIIAqVI2KE.jpg',
    banner: 'https://image.tmdb.org/t/p/original/bq28ajZaoMyzEIm6REelqyqtEDZ.jpg',
    trailer: 'https://www.youtube.com/embed/M1bhOaLv4FU',
    title: {
      en: "The Boys",
      te: "ది బాయ్స్"
    },
    description: {
      en: "A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers.",
      te: "దుష్ట స్వభావం కల సూపర్ హీరోలను మరియు వారి వెనుక గల వోట్ కార్పొరేషన్ అవినీతిని అంతం చేయడానికి ఒక సాధారణ మనుషుల ముఠా చేసే సాహస పోరాటం."
    },
    genres: ["Action","Sci-Fi","Drama"],
    year: 2019,
    totalEpisodes: 32,
    totalSeasons: 4,
    imdbRating: 8.7,
    studio: 'Sony Pictures Television',
    language: 'English',
    country: 'United States',
    ottPlatforms: [{platform:"AMAZON_PRIME",url:"https://www.primevideo.com/detail/The-Boys/0PDOKU97WP28J99316J4H9E3BS"}],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: false,
    isTrending: true,
    isTopRated: true,
    trendingScore: 93,
    popularityScore: 96,
    similarSlugs: ["stranger-things"]
  },
  {
    slug: 'the-family-man',
    type: ContentType.SERIES,
    status: ContentStatus.ONGOING,
    poster: 'https://image.tmdb.org/t/p/w500/tE1NUJqw9gV6AVjQ1GTK78LbWJ9.jpg',
    banner: 'https://image.tmdb.org/t/p/original/eEzKigDI64OomZV6VTJvoPGmVu1.jpg',
    trailer: 'https://www.youtube.com/embed/XatRGut65VI',
    title: {
      en: "The Family Man",
      te: "ది ఫ్యామిలీ మ్యాన్"
    },
    description: {
      en: "A middle-class man secretly works for a special cell of the National Investigation Agency, trying to protect the country from terrorists while balancing his family life.",
      te: "శ్రీకాంత్ తివారీ అనే ఒక సాధారణ మధ్యతరగతి ఉద్యోగి రహస్యంగా దేశ రక్షణ కోసం జాతీయ దర్యాప్తు సంస్థ (NIA) లో పని చేస్తూ తన భార్యాపిల్లలను చూసుకునే ప్రయత్నం."
    },
    genres: ["Action","Comedy","Thriller","Drama"],
    year: 2019,
    totalEpisodes: 19,
    totalSeasons: 2,
    imdbRating: 8.7,
    studio: 'D2R Films',
    language: 'Hindi',
    country: 'India',
    ottPlatforms: [{platform:"AMAZON_PRIME",url:"https://www.primevideo.com/detail/The-Family-Man/0H3D55M5B1DGE5Q21K0C9E0Y5G"}],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: true,
    isTrending: true,
    isTopRated: true,
    trendingScore: 94,
    popularityScore: 96.5,
    similarSlugs: ["farzi","mirzapur"]
  },
  {
    slug: 'wednesday',
    type: ContentType.SERIES,
    status: ContentStatus.ONGOING,
    poster: 'https://image.tmdb.org/t/p/w500/36xXlhEpQqVVPuiZhfoQuaY4OlA.jpg',
    banner: 'https://image.tmdb.org/t/p/original/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg',
    trailer: 'https://www.youtube.com/embed/Di31gT1386M',
    title: {
      en: "Wednesday",
      te: "వెడ్నెస్డే"
    },
    description: {
      en: "Wednesday Addams investigates a murder spree while navigating new relationships at Nevermore Academy.",
      te: "నెవర్‌మోర్ అకాడమీలో చదువుతున్న వెడ్నెస్డే ఆడమ్స్ అనే ఒక అసాధారణ అమ్మాయి అక్కడ జరుగుతున్న వరుస హత్యల వెనుక గల వింత రహస్యాలను శోధిస్తుంది."
    },
    genres: ["Fantasy","Comedy","Thriller","Supernatural"],
    year: 2022,
    totalEpisodes: 8,
    totalSeasons: 1,
    imdbRating: 8.1,
    studio: 'MGM Television',
    language: 'English',
    country: 'United States',
    ottPlatforms: [{platform:"NETFLIX",url:"https://www.netflix.com/title/81231974"}],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: false,
    isTrending: true,
    isTopRated: false,
    trendingScore: 91,
    popularityScore: 95,
    similarSlugs: ["stranger-things","dark"]
  },
  {
    slug: 'daredevil-born-again',
    type: ContentType.SERIES,
    status: ContentStatus.COMPLETED,
    poster: 'https://image.tmdb.org/t/p/w500/xDUoAsU8lQHOOoRkFiBuarmACDN.jpg',
    banner: 'https://image.tmdb.org/t/p/original/qrTAc0ZtQ859Qu5O8cixJzNJpQs.jpg',
    trailer: 'https://www.youtube.com/embed/sOLeq3U5QYk',
    title: {
      en: "Daredevil: Born Again",
      te: "డేర్‌డెవిల్: బోర్న్ అగైన్"
    },
    description: {
      en: "Matt Murdock, a blind lawyer by day and vigilant crimefighter by night, clashes with the Kingpin in New York.",
      te: "లాయర్ మాట్ మర్దోక్ డేర్‌డెవిల్ గా న్యూయార్క్ వీధుల్లో సాగిస్తున్న క్రైమ్ పోరాటం మరియు కింగ్ పిన్ తో తలపడే కథ."
    },
    genres: ["Action","Crime","Drama","Super Hero"],
    year: 2025,
    totalEpisodes: 9,
    totalSeasons: 1,
    imdbRating: 8.2,
    studio: 'Marvel Studios',
    language: 'English',
    country: 'United States',
    ottPlatforms: [{platform:"JIO_HOTSTAR",url:"https://www.hotstar.com"}],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: false,
    isTrending: false,
    isTopRated: false,
    popularityScore: 90,
    similarSlugs: [],
    universeInfo: {
      universeId: 'mcu',
      order: 50,
      phase: 'Phase 5'
    }
  },
  {
    slug: 'echo',
    type: ContentType.SERIES,
    status: ContentStatus.COMPLETED,
    poster: 'https://image.tmdb.org/t/p/w500/vFyJH630cF68LohVYjQW49074Sy.jpg',
    banner: 'https://image.tmdb.org/t/p/original/u3ySnWqSjM3jedYgJZTR7RWRDDm.jpg',
    trailer: 'https://www.youtube.com/embed/74L-hD2n0K0',
    title: {
      en: "Echo",
      te: "ఎకో"
    },
    description: {
      en: "Maya Lopez must face her past, reconnect with her Native American roots and embrace the meaning of family and community if she ever hopes to move forward.",
      te: "కింగ్ పిన్ ముఠా నుండి పారిపోయి తన సొంత ఊరు చేరిన మాయా లోపెజ్, అక్కడ తన పూర్వీకుల గొప్పతనాన్ని తెలుసుకొని పోరాడే కథ."
    },
    genres: ["Action","Crime","Drama","Super Hero"],
    year: 2024,
    totalEpisodes: 5,
    totalSeasons: 1,
    imdbRating: 6,
    studio: 'Marvel Studios',
    language: 'English',
    country: 'United States',
    ottPlatforms: [{platform:"JIO_HOTSTAR",url:"https://www.hotstar.com/series/echo/1260161415"}],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: false,
    isTrending: false,
    isTopRated: false,
    trendingScore: 72,
    popularityScore: 88,
    similarSlugs: ["secret-invasion","daredevil-born-again"],
    universeInfo: {
      universeId: 'mcu',
      order: 48,
      phase: 'Phase 5'
    }
  },
  {
    slug: 'hawkeye',
    type: ContentType.SERIES,
    status: ContentStatus.COMPLETED,
    poster: 'https://image.tmdb.org/t/p/w500/ct5pNE5dDHryHLDnxyZPYcqO1sz.jpg',
    banner: 'https://image.tmdb.org/t/p/original/1R68vl3d5s86JsS2NPjl8UoMqIS.jpg',
    trailer: 'https://www.youtube.com/embed/5VYb3B1ETlk',
    title: {
      en: "Hawkeye",
      te: "హాకై"
    },
    description: {
      en: "Former Avenger Clint Barton has a seemingly simple mission: get back to his family for Christmas. Possible? Maybe with the help of Kate Bishop, a 22-year-old archer with dreams of becoming a superhero.",
      te: "హాకై క్లింట్ బార్టన్, తనను ఆరాధించే కేట్ బిషప్ అనే యువ విలుకాడుతో జతకట్టి క్రిస్మస్ పండుగ లోపు తన శత్రువులను ఎదుర్కొనే నగర ప్రయాణం."
    },
    genres: ["Action","Comedy","Crime","Super Hero"],
    year: 2021,
    totalEpisodes: 6,
    totalSeasons: 1,
    imdbRating: 7.5,
    studio: 'Marvel Studios',
    language: 'English',
    country: 'United States',
    ottPlatforms: [{platform:"JIO_HOTSTAR",url:"https://www.hotstar.com/series/hawkeye/1260073683"}],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: false,
    isTrending: false,
    isTopRated: false,
    trendingScore: 78,
    popularityScore: 91,
    similarSlugs: ["wandavision","moon-knight"],
    universeInfo: {
      universeId: 'mcu',
      order: 43,
      phase: 'Phase 4'
    }
  },
  {
    slug: 'ironheart',
    type: ContentType.SERIES,
    status: ContentStatus.COMPLETED,
    poster: 'https://image.tmdb.org/t/p/w500/dOh6MJpdlQhYpLBhzhNQeYGKTZ5.jpg',
    banner: 'https://image.tmdb.org/t/p/original/kiOEVg5BkzLE0pWoPKecXd7wZ2Q.jpg',
    trailer: 'https://www.youtube.com/embed/sOLeq3U5QYk',
    title: {
      en: "Ironheart",
      te: "ఐరన్‌హార్ట్"
    },
    description: {
      en: "Riri Williams, a genius inventor who designs the most advanced suit of armor since Iron Man, faces magic and tech.",
      te: "ఐరన్ మ్యాన్ తర్వాత మోస్ట్ అడ్వాన్స్‌డ్ ఆర్మర్ సూట్ తయారుచేసిన జీనియస్ రిరి విలియమ్స్ సాహసాలు."
    },
    genres: ["Action","Sci-Fi","Super Hero"],
    year: 2025,
    totalEpisodes: 6,
    totalSeasons: 1,
    imdbRating: 7,
    studio: 'Marvel Studios',
    language: 'English',
    country: 'United States',
    ottPlatforms: [{platform:"JIO_HOTSTAR",url:"https://www.hotstar.com"}],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: false,
    isTrending: false,
    isTopRated: false,
    popularityScore: 90,
    similarSlugs: [],
    universeInfo: {
      universeId: 'mcu',
      order: 51,
      phase: 'Phase 5'
    }
  },
  {
    slug: 'loki',
    type: ContentType.SERIES,
    status: ContentStatus.COMPLETED,
    poster: 'https://image.tmdb.org/t/p/w500/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg',
    banner: 'https://image.tmdb.org/t/p/original/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg',
    trailer: 'https://www.youtube.com/embed/nW9483t0zV0',
    title: {
      en: "Loki",
      te: "లోకి"
    },
    description: {
      en: "The mercurial villain Loki resumes his role as the God of Mischief in a new series that takes place after the events of Avengers: Endgame.",
      te: "టెస్సరాక్ తో తప్పించుకున్న లోకి, టైమ్ వేరియన్స్ అథారిటీ (TVA) కి పట్టుబడి కాలచక్రాన్ని మరియు మల్టీవర్స్ ని కాపాడటానికి చేసే సాహస యాత్ర."
    },
    genres: ["Action","Sci-Fi","Fantasy","Super Hero"],
    year: 2021,
    totalEpisodes: 12,
    totalSeasons: 2,
    imdbRating: 8.2,
    studio: 'Marvel Studios',
    language: 'English',
    country: 'United States',
    ottPlatforms: [{platform:"JIO_HOTSTAR",url:"https://www.hotstar.com/series/loki/1260063251"}],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: true,
    isTrending: true,
    isTopRated: true,
    trendingScore: 92,
    popularityScore: 95,
    similarSlugs: ["wandavision","hawkeye"],
    universeInfo: {
      universeId: 'mcu',
      order: 41,
      phase: 'Phase 4'
    }
  },
  {
    slug: 'moon-knight',
    type: ContentType.SERIES,
    status: ContentStatus.COMPLETED,
    poster: 'https://image.tmdb.org/t/p/w500/YksR65as1ppF2N48TJAh2PLamX.jpg',
    banner: 'https://image.tmdb.org/t/p/original/iux1vKPT7Vw1AzetZb4Jz6wfYsm.jpg',
    trailer: 'https://www.youtube.com/embed/x7Krla_UxHg',
    title: {
      en: "Moon Knight",
      te: "మూన్ నైట్"
    },
    description: {
      en: "Steven Grant discovers he's been gifted with the powers of an Egyptian moon god. But he soon finds out that these newfound powers can be both a blessing and a curse for a troubled mind.",
      te: "ఒకే శరీరంలో మల్టిపుల్ పర్సనాలిటీ డిజార్డర్ తో బాధపడుతున్న స్టీవెన్, ఈజిప్షియన్ చంద్ర దేవుని శక్తులను పొంది మూన్ నైట్ గా మారే వింత కథాంశం."
    },
    genres: ["Action","Fantasy","Adventure","Super Hero"],
    year: 2022,
    totalEpisodes: 6,
    totalSeasons: 1,
    imdbRating: 7.3,
    studio: 'Marvel Studios',
    language: 'English',
    country: 'United States',
    ottPlatforms: [{platform:"JIO_HOTSTAR",url:"https://www.hotstar.com/series/moon-knight/1260089651"}],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: false,
    isTrending: true,
    isTopRated: true,
    trendingScore: 85,
    popularityScore: 93,
    similarSlugs: ["hawkeye","ms-marvel"],
    universeInfo: {
      universeId: 'mcu',
      order: 44,
      phase: 'Phase 4'
    }
  },
  {
    slug: 'ms-marvel',
    type: ContentType.SERIES,
    status: ContentStatus.COMPLETED,
    poster: 'https://image.tmdb.org/t/p/w500/3HWWh92kZbD7odwJX7nKmXNZsYo.jpg',
    banner: 'https://image.tmdb.org/t/p/original/mfcLUWASJghU8MTNK38eYktfE83.jpg',
    trailer: 'https://www.youtube.com/embed/m9EX0f6V11Y',
    title: {
      en: "Ms. Marvel",
      te: "మిస్ మార్వెల్"
    },
    description: {
      en: "Kamala Khan, a superhero fan-fiction writer, discovers she has super powers of her own.",
      te: "పాకిస్థానీ సంతతికి చెందిన కమలా ఖాన్ అనే అమ్మాయి, తన అమ్మమ్మ వింత కడియం వల్ల విశ్వశక్తులను పొంది మిస్ మార్వెల్ గా ఎలా ఎదిగింది."
    },
    genres: ["Action","Comedy","Fantasy","Super Hero"],
    year: 2022,
    totalEpisodes: 6,
    totalSeasons: 1,
    imdbRating: 6.3,
    studio: 'Marvel Studios',
    language: 'English',
    country: 'United States',
    ottPlatforms: [{platform:"JIO_HOTSTAR",url:"https://www.hotstar.com/series/ms-marvel/1260098522"}],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: false,
    isTrending: false,
    isTopRated: false,
    trendingScore: 70,
    popularityScore: 89,
    similarSlugs: ["moon-knight","she-hulk"],
    universeInfo: {
      universeId: 'mcu',
      order: 45,
      phase: 'Phase 4'
    }
  },
  {
    slug: 'secret-invasion',
    type: ContentType.SERIES,
    status: ContentStatus.COMPLETED,
    poster: 'https://image.tmdb.org/t/p/w500/f5ZMzzCvt2IzVDxr54gHPv9jlC9.jpg',
    banner: 'https://image.tmdb.org/t/p/original/6mOK9j99OFlxGc3ird2jWUeUha9.jpg',
    trailer: 'https://www.youtube.com/embed/qZXC9eL32Q0',
    title: {
      en: "Secret Invasion",
      te: "సీక్రెట్ ఇన్వేషన్"
    },
    description: {
      en: "Fury and Talos try to stop the Skrulls who have infiltrated the highest spheres of the Marvel Universe.",
      te: "భూమిపై నివసిస్తున్న రూపాంతర గ్రహాంతరవాసులు స్క్రల్స్ నిక్‌ ఫ్యూరీ కళ్ళు గప్పి సాగిస్తున్న రహస్య ఆక్రమణను అడ్డుకునే పోరాటం."
    },
    genres: ["Action","Thriller","Sci-Fi","Super Hero"],
    year: 2023,
    totalEpisodes: 6,
    totalSeasons: 1,
    imdbRating: 5.5,
    studio: 'Marvel Studios',
    language: 'English',
    country: 'United States',
    ottPlatforms: [{platform:"JIO_HOTSTAR",url:"https://www.hotstar.com/series/secret-invasion/1260143822"}],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: false,
    isTrending: false,
    isTopRated: false,
    trendingScore: 65,
    popularityScore: 87,
    similarSlugs: ["she-hulk","echo"],
    universeInfo: {
      universeId: 'mcu',
      order: 47,
      phase: 'Phase 5'
    }
  },
  {
    slug: 'she-hulk',
    type: ContentType.SERIES,
    status: ContentStatus.COMPLETED,
    poster: 'https://image.tmdb.org/t/p/w500/5xz2orV8f0usyrfGNshcoXHmiaV.jpg',
    banner: 'https://image.tmdb.org/t/p/original/eljErfkQUcFUgQkI4I1soZcH8MW.jpg',
    trailer: 'https://www.youtube.com/embed/u7JsU8GIV08',
    title: {
      en: "She-Hulk: Attorney at Law",
      te: "షీ-హల్క్"
    },
    description: {
      en: "Jennifer Walters navigates the complicated life of a single, 30-something attorney who also happens to be a green, 6-foot-7-inch superpowered hulk.",
      te: "బ్రూస్ బ్యానర్ సోదరి లాయర్ జెన్నిఫర్, అనుకోకుండా హల్క్ రక్తం సోకి షీ-హల్క్ గా మారి కోర్టు కేసులు మరియు సూపర్ పవర్స్ ని ఎలా బ్యాలెన్స్ చేసింది."
    },
    genres: ["Action","Comedy","Sci-Fi","Super Hero"],
    year: 2022,
    totalEpisodes: 9,
    totalSeasons: 1,
    imdbRating: 5.3,
    studio: 'Marvel Studios',
    language: 'English',
    country: 'United States',
    ottPlatforms: [{platform:"JIO_HOTSTAR",url:"https://www.hotstar.com/series/shehulk-attorney-at-law/1260107920"}],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: false,
    isTrending: false,
    isTopRated: false,
    trendingScore: 68,
    popularityScore: 86,
    similarSlugs: ["ms-marvel","secret-invasion"],
    universeInfo: {
      universeId: 'mcu',
      order: 46,
      phase: 'Phase 4'
    }
  },
  {
    slug: 'the-falcon-and-the-winter-soldier',
    type: ContentType.SERIES,
    status: ContentStatus.COMPLETED,
    poster: 'https://image.tmdb.org/t/p/w500/6kbAMLteGO8yyewYau6bJ683sw7.jpg',
    banner: 'https://image.tmdb.org/t/p/original/aTjbqMONy77fHJrIYu14g1F0d5h.jpg',
    trailer: 'https://www.youtube.com/embed/IWBsZbdiMCI',
    title: {
      en: "The Falcon and the Winter Soldier",
      te: "ది ఫాల్కన్ అండ్ ది వింటర్ సోల్జర్"
    },
    description: {
      en: "Following the events of Avengers: Endgame, Sam Wilson/Falcon and Bucky Barnes/Winter Soldier team up in a global adventure that tests their abilities—and their patience.",
      te: "కెప్టెన్ అమెరికా వెళ్ళిన తర్వాత అతని డాలును సామ్ విల్సన్ అంగీకరించే ముందు, బక్కీ బార్న్స్ తో కలిసి ఫ్లాగ్ స్మాషర్స్ కు వ్యతిరేకంగా చేసే సాహసోపేత పోరాటం."
    },
    genres: ["Action","Sci-Fi","Thriller","Super Hero"],
    year: 2021,
    totalEpisodes: 6,
    totalSeasons: 1,
    imdbRating: 7.2,
    studio: 'Marvel Studios',
    language: 'English',
    country: 'United States',
    ottPlatforms: [{platform:"JIO_HOTSTAR",url:"https://www.hotstar.com/series/the-falcon-and-the-winter-soldier/1260055117"}],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: false,
    isTrending: false,
    isTopRated: false,
    trendingScore: 75,
    popularityScore: 90,
    similarSlugs: ["wandavision","loki"],
    universeInfo: {
      universeId: 'mcu',
      order: 42,
      phase: 'Phase 4'
    }
  },
  {
    slug: 'vision-quest',
    type: ContentType.SERIES,
    status: ContentStatus.UPCOMING,
    poster: 'https://image.tmdb.org/t/p/w500/6j60tGRAjBmWRPTOEwhW6oRbPMP.jpg',
    banner: 'https://image.tmdb.org/t/p/original/hgo15B8eUnbEjszVV1qdV8sGz9S.jpg',
    trailer: 'https://www.youtube.com/embed/sOLeq3U5QYk',
    title: {
      en: "Vision Quest",
      te: "విజన్ క్వెస్ట్"
    },
    description: {
      en: "Rebuilt as a soulless, pristine white synthezoid, Vision searches for his lost memories and strives to reclaim his core humanity.",
      te: "జ్ఞాపకాలను కోల్పోయిన వైట్ విజన్, తన గతాన్ని అన్వేషిస్తూ తన నిజమైన రూపాన్ని మరియు భావాలను తిరిగి పొందేందుకు చేసే ప్రయాణం."
    },
    genres: ["Sci-Fi","Drama","Super Hero"],
    year: 2026,
    totalEpisodes: 6,
    totalSeasons: 1,
    imdbRating: 7.5,
    studio: 'Marvel Studios',
    language: 'English',
    country: 'United States',
    ottPlatforms: [{platform:"JIO_HOTSTAR",url:"https://www.hotstar.com"}],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: false,
    isTrending: false,
    isTopRated: false,
    popularityScore: 90,
    similarSlugs: [],
    universeInfo: {
      universeId: 'mcu',
      order: 53,
      phase: 'Phase 6'
    }
  },
  {
    slug: 'wandavision',
    type: ContentType.SERIES,
    status: ContentStatus.COMPLETED,
    poster: 'https://image.tmdb.org/t/p/w500/frobUz2X5Pc8OiVZU8Oo5K3NKMM.jpg',
    banner: 'https://image.tmdb.org/t/p/original/lOr9NKxh4vMweufMOUDJjJhCRHW.jpg',
    trailer: 'https://www.youtube.com/embed/sj9J2ecsSpo',
    title: {
      en: "WandaVision",
      te: "వాండావిజన్"
    },
    description: {
      en: "Blends the style of classic sitcoms with the Marvel Cinematic Universe in which Wanda Maximoff and Vision - two super-powered beings living their ideal suburban lives - begin to suspect that everything is not as it seems.",
      te: "వాండా మాగ్జిమోఫ్ మరియు విజన్ ఇద్దరూ ఒక మాయా ప్రపంచంలో సంతోషంగా జీవిస్తున్న సమయంలో, ఆ ప్రపంచం వెనుక గల వింత రహస్యాలను శోధించే కథ."
    },
    genres: ["Sci-Fi","Drama","Fantasy","Super Hero"],
    year: 2021,
    totalEpisodes: 9,
    totalSeasons: 1,
    imdbRating: 7.9,
    studio: 'Marvel Studios',
    language: 'English',
    country: 'United States',
    ottPlatforms: [{platform:"JIO_HOTSTAR",url:"https://www.hotstar.com/series/wandavision/1260051344"}],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isFeatured: false,
    isTrending: false,
    isTopRated: true,
    trendingScore: 82,
    popularityScore: 93,
    similarSlugs: ["loki","hawkeye"],
    universeInfo: {
      universeId: 'mcu',
      order: 40,
      phase: 'Phase 4'
    }
  },
  {
    slug: 'monarch-legacy-of-monsters',
    type: ContentType.SERIES,
    status: ContentStatus.COMPLETED,
    poster: 'https://image.tmdb.org/t/p/w500/7LBbaEaLSbqdviBYaSS1rRPMnrs.jpg',
    banner: 'https://image.tmdb.org/t/p/original/7IY4wELVMvtUc78vPiuL8kQV2iA.jpg',
    trailer: 'https://www.youtube.com/embed/ec2P3C1m3s4',
    title: {
      en: 'Monarch: Legacy of Monsters',
      te: 'మోనార్క్: లెగసీ ఆఫ్ మాన్‌స్టర్స్'
    },
    description: {
      en: 'Following the thunderous battle between Godzilla and the Titans that leveled San Francisco, two siblings tread in their father\'s footsteps to uncover their family\'s connection to the secretive organization known as Monarch.',
      te: 'గాడ్జిల్లా మరియు టైటాన్స్ మధ్య జరిగిన యుద్ధం తర్వాత, ఇద్దరు తోబుట్టువులు తమ తండ్రి అడుగుజాడల్లో ప్రయాణిస్తూ మోనార్క్ అనే రహస్య సంస్థతో తమ కుటుంబానికి ఉన్న సంబంధాన్ని ఎలా ఛేదించారు అనేదే ఈ సస్పెన్స్ డ్రామా.'
    },
    genres: ['Sci-Fi', 'Action', 'Adventure'],
    year: 2023,
    totalEpisodes: 10,
    totalSeasons: 1,
    imdbRating: 7.0,
    studio: 'Legendary Television',
    language: 'English',
    country: 'United States',
    ottPlatforms: [],
    teluguDubAvail: false,
    teluguSubAvail: false,
    isFeatured: false,
    isTrending: false,
    isTopRated: false,
    similarSlugs: ['godzilla-2014', 'godzilla-vs-kong'],
    universeInfo: {
      universeId: 'monsterverse',
      order: 6,
      phase: 'Phase 2'
    }
  }
]
