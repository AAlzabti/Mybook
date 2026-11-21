export interface ChapterContent {
  chapter: number;
  storyPage: number;
  coloringPage: number;
  title: string;
  body: string;
  starHunt: string;
}

export type PageCategory =
  | 'title'
  | 'copyright'
  | 'activity'
  | 'blank'
  | 'story'
  | 'coloring'
  | 'certificate'
  | 'review'
  | 'promo';

export interface PageCatalogEntry {
  page: number;
  category: PageCategory;
  side: 'recto' | 'verso';
  title: string;
  chapter?: number;
  hasVisualFix?: boolean;
  fixSummaryAr?: string;
}

export const CHAPTERS: ChapterContent[] = [
  {
    chapter: 1,
    storyPage: 8,
    coloringPage: 9,
    title: "Nova's Cozy Den",
    body: "Deep inside a hollow oak tree, little Nova fluffed her starry quilt and yawned a tiny fox yawn. Her crescent-moon satchel hung neatly by the door, ready for tomorrow's games. Tonight, Whisperwood Forest was quiet, warm, and snug.",
    starHunt: "Can you find 3 hidden stars tucked inside Nova's cozy bedroom?",
  },
  {
    chapter: 2,
    storyPage: 10,
    coloringPage: 11,
    title: 'The Night the Sky Rained Stars',
    body: 'Whoosh! Plink! Plonk! A gentle shower of golden sparks danced right past Nova\'s window. One by one, the sleepy stars tumbled out of the sky and drifted down into the forest. "Oh my!" gasped Nova, pressing her nose to the glass.',
    starHunt: 'Can you find 3 hidden stars hiding among the falling sparkles?',
  },
  {
    chapter: 3,
    storyPage: 12,
    coloringPage: 13,
    title: 'Tail Up, Star Bright!',
    body: 'The night outside looked very big, and Nova\'s little paws felt a tiny bit wobbly. She clipped on her crescent-moon satchel, gave her floppy left ear a wiggle, and smiled her bravest gap-toothed smile. "Tail up, star bright!" she cheered, and her fluffy tail-tip began to glow.',
    starHunt: "Can you find 3 hidden stars shining near Nova's glowing tail?",
  },
  {
    chapter: 4,
    storyPage: 14,
    coloringPage: 15,
    title: 'Meeting Pebble',
    body: 'Out on the mossy garden path, a tiny lantern bobbed along at the speed of a yawn. It was Pebble the snail, Nova\'s sleepiest and bestest friend! "Going on a star hunt?" Pebble asked slowly. "Wait for me—I\'m practically zooming!"',
    starHunt: 'Can you find 3 hidden stars tucked along the garden path?',
  },
  {
    chapter: 5,
    storyPage: 16,
    coloringPage: 17,
    title: "Mama Owl's Starry Tree",
    body: 'Together they visited wise Mama Owl, who perched high in the tallest whispering willow. She adjusted her round spectacles and fluttered her wings gently. "Only your glowing star-tail can wake the fallen stars, dear Nova," she hooted softly.',
    starHunt: 'Can you find 3 hidden stars nestled in the willow branches?',
  },
  {
    chapter: 6,
    storyPage: 18,
    coloringPage: 19,
    title: 'The Map of Eight Lands',
    body: 'Mama Owl unrolled a big curly map painted with clouds, rivers, and mountains. Eight little stars had tumbled across eight magical lands far and wide. Nova traced each winding road with her paw and grinned—what an adventure!',
    starHunt: 'Can you find 3 hidden stars drawn onto the treasure map?',
  },
  {
    chapter: 7,
    storyPage: 20,
    coloringPage: 21,
    title: 'Waking the First Little Spark',
    body: 'Before they even left the willow roots, Nova spotted a tiny stray spark snoozing in a buttercup. She brushed it gently with the star on her tail—boop! The little star giggled, stretched its points, and zipped back up to cheer them on!',
    starHunt: 'Can you find 3 hidden stars hiding among the wildflowers?',
  },
  {
    chapter: 8,
    storyPage: 22,
    coloringPage: 23,
    title: 'Off on a Starlight Quest',
    body: 'With her satchel packed with berry snacks and Pebble riding safely on a cozy leaf-sled, Nova stepped through the leafy forest gate. "Ready, Pebble?" she asked. "Born ready—just give me a second to blink!" Pebble chuckled.',
    starHunt: 'Can you find 3 hidden stars woven into the forest archway?',
  },
  {
    chapter: 9,
    storyPage: 24,
    coloringPage: 25,
    title: 'The Giggly Mushroom Patch',
    body: 'First stop: Whisperwood Forest, where the polka-dot mushrooms talked and giggled all night long! "Hello, little fox!" chimed three plump toadstools, tipping their spotted caps. Nova bowed politely and asked if they had seen a fallen star.',
    starHunt: 'Can you find 3 hidden stars camouflaged on the mushroom caps?',
  },
  {
    chapter: 10,
    storyPage: 26,
    coloringPage: 27,
    title: 'The Hiccuping Toadstool',
    body: 'The tallest mushroom tried to answer, but all that came out was "Hic-cup!" Every time he bounced, his polka dots jiggled! Nova reached into her crescent satchel and offered him a cup of warm chamomile berry tea.',
    starHunt: 'Can you find 3 hidden stars floating in the tea steam?',
  },
  {
    chapter: 11,
    storyPage: 28,
    coloringPage: 29,
    title: 'The Moss-Bed Star',
    body: '"Ahhhh! Hiccups gone!" cheered the tall mushroom, lifting his wide cap like an umbrella. Right underneath, Fallen Star Number One was curled up in a soft clover nest. Nova tapped it with her glowing tail, and the star hopped happily into her satchel!',
    starHunt: 'Can you find 3 hidden stars nestled inside the patterned leaves?',
  },
  {
    chapter: 12,
    storyPage: 30,
    coloringPage: 31,
    title: 'Fluffy Sugar Hills',
    body: 'Next they bounced into Candy-Cloud Meadow, where the bushes were spun from cotton candy and the trees grew striped lollipops! Pebble tumbled onto a giant marshmallow and sighed in delight. "This is the softest parking spot in the world!" he beamed.',
    starHunt: 'Can you find 3 hidden stars swirled inside the lollipops?',
  },
  {
    chapter: 13,
    storyPage: 32,
    coloringPage: 33,
    title: 'The Sticky Caramel Puddle',
    body: 'By a bubbly brook, a tiny bunny sniffled because his favorite balloon string was stuck in a swirly caramel puddle. "Don\'t worry!" said Nova, grabbing a sturdy striped peppermint stick. Together, they lifted the string cleanly without getting a single paw sticky!',
    starHunt: "Can you find 3 hidden stars floating near the bunny's balloon?",
  },
  {
    chapter: 14,
    storyPage: 34,
    coloringPage: 35,
    title: 'The Star in the Cotton Cloud',
    body: 'To say thank you, the happy bunny pointed up to a wiggly cotton-candy bush that was giggling all by itself! Nova peeked inside and found Fallen Star Number Two tickled pink by the fluffy puffs. Boop! With one tail-tap, star number two joined the team!',
    starHunt: 'Can you find 3 hidden stars tucked inside the puffy candy clouds?',
  },
  {
    chapter: 15,
    storyPage: 36,
    coloringPage: 37,
    title: 'Ahoy, Captain Button!',
    body: 'At the edge of Sparkle River, a tiny mouse in a striped sailor hat shouted, "Ahoy, landlubbers! Climb aboard the S.S. Chamomile!" It was Captain Button, steering a fancy teacup boat with a crisp leaf sail. Nova hopped right in—her fluffy tail barely fit!',
    starHunt: 'Can you find 3 hidden stars painted on the teacup boat?',
  },
  {
    chapter: 16,
    storyPage: 38,
    coloringPage: 39,
    title: 'Sailing the Twinkle Rapids',
    body: 'Splish, splash, zoom! The teacup boat spun merrily down Sparkle River while playful fish leaped in shiny arcs beside them. Captain Button saluted the breeze and sang a silly sailor song. Even sleepy Pebble let out a cheerful, "Wheeeee!"',
    starHunt: 'Can you find 3 hidden stars splashing in the river bubbles?',
  },
  {
    chapter: 17,
    storyPage: 40,
    coloringPage: 41,
    title: 'The Star Under the Waterwheel',
    body: 'Ahead, a wooden river waterwheel had stopped spinning because a tangle of floating ribbons was wrapped around its paddles. Nova leaned carefully over the teacup rim and untied the knot with a gentle tug. Creak-splash! The wheel turned again, and Fallen Star Number Three hopped right out from a giant lily pad!',
    starHunt: 'Can you find 3 hidden stars resting on the lily pads?',
  },
  {
    chapter: 18,
    storyPage: 42,
    coloringPage: 43,
    title: 'Climbing the Pillow Peaks',
    body: 'Bidding Captain Button a sunny goodbye, Nova and Pebble hiked up the soft, snowy slopes of the Sleepy Mountains. The rounded boulders looked just like patchwork pillows, and even the pine trees drooped with cozy yawns. "Tail up, star bright!" whispered Nova, warming her paws.',
    starHunt: 'Can you find 3 hidden stars perched on the snowy pine trees?',
  },
  {
    chapter: 19,
    storyPage: 44,
    coloringPage: 45,
    title: 'The Snoring Bear Cave',
    body: 'Inside a warm glowing cave, three round, friendly bears were tossing and turning in a tangled knot of patchwork blankets. Nova tiptoed in, straightened their cozy quilts, and hummed her softest bedtime tune. Within seconds, all three bears sighed happily and fell fast asleep!',
    starHunt: 'Can you find 3 hidden stars stitched into the patchwork blankets?',
  },
  {
    chapter: 20,
    storyPage: 46,
    coloringPage: 47,
    title: 'The Star in the Honey Pot',
    body: 'The smallest bear cub cracked one sleepy eye open and pointed a fuzzy paw toward a round honey jar on the shelf. Inside, Fallen Star Number Four was shining like a golden nightlight! Nova lifted it gently, whispered "Sweet dreams," and tiptoed back into the snow.',
    starHunt: 'Can you find 3 hidden stars decorated on the honey jars?',
  },
  {
    chapter: 21,
    storyPage: 48,
    coloringPage: 49,
    title: 'The Bubble-Helmet Dive',
    body: "Down in the valley sparkled the Underwater Moon-Lagoon, shimmering like liquid silver. With a gentle swish of Nova's magic tail, two big shimmering bubbles popped right over Nova and Pebble like cozy space helmets! Bloop, bloop! Down they floated into the underwater world.",
    starHunt: 'Can you find 3 hidden stars floating inside the ocean bubbles?',
  },
  {
    chapter: 22,
    storyPage: 50,
    coloringPage: 51,
    title: 'Dancing with Glowing Jellyfish',
    body: 'A parade of giggling mermaid-fish and big, lacy jellyfish twirled around Nova in a glowing underwater dance. Their bell-shaped tops were covered in dizzying swirls and starry stripes. Nova spun a joyful underwater somersault right in the middle of the ring!',
    starHunt: 'Can you find 3 hidden stars patterned onto the jellyfish bells?',
  },
  {
    chapter: 23,
    storyPage: 52,
    coloringPage: 53,
    title: 'The Pearl-Shell Star',
    body: 'On the sandy seafloor sat a giant, bashful clam hiding something bright inside its shell. Nova wiggled her crooked left ear and told her silliest joke: "Why did the starfish blush? Because it saw the ocean\'s bottom!" The clam laughed so hard it popped right open—revealing Fallen Star Number Five!',
    starHunt: 'Can you find 3 hidden stars resting on the sandy seafloor?',
  },
  {
    chapter: 24,
    storyPage: 54,
    coloringPage: 55,
    title: 'Topsy-Turvy Tulips',
    body: 'Popping safely back onto dry land, Nova stepped into the Upside-Down Garden—and burst out laughing! Giant daisies, tulips, and sunflowers hung from floating vine arches, growing right toward the ground! Nova stood on her head for a second just to see how the flowers saw the world.',
    starHunt: 'Can you find 3 hidden stars hanging upside down from the flower stems?',
  },
  {
    chapter: 25,
    storyPage: 56,
    coloringPage: 57,
    title: 'The Dizzy Bumblebee',
    body: 'Bzzzz-woah! A chubby bumblebee was spinning in dizzy loops trying to sip nectar from an upside-down sunflower. Nova plucked a broad, sturdy garden leaf and held it up like a cozy landing pad. The grateful bee plopped down, caught his breath, and buzzed a happy thank-you!',
    starHunt: "Can you find 3 hidden stars hovering near the bee's curly flight trail?",
  },
  {
    chapter: 26,
    storyPage: 58,
    coloringPage: 59,
    title: 'The Star in the Hanging Bellflower',
    body: 'Feeling steady again, the little bumblebee zipped straight to a giant hanging bluebell and tapped its petals—ding-a-ling! Out swung Fallen Star Number Six, giggling like a wind chime! Nova gently booped it with her star-tail and tucked it beside its friends.',
    starHunt: 'Can you find 3 hidden stars woven into the floral garden vines?',
  },
  {
    chapter: 27,
    storyPage: 60,
    coloringPage: 61,
    title: 'Welcome to Tiny-House Town',
    body: 'A wide striped rainbow arched over the meadow, leading straight into Rainbow Bridge Village! Tiny teapot cottages and acorn houses lined the cobbled lanes, all fluttering with festival banners. Little hedgehogs, squirrels, and chipmunks waved from every round doorway!',
    starHunt: 'Can you find 3 hidden stars perched on the cottage rooftops?',
  },
  {
    chapter: 28,
    storyPage: 62,
    coloringPage: 63,
    title: 'The Lantern Parade Mix-Up',
    body: 'The village\'s Starlight Festival was about to begin, but a playful breeze had tangled all the paper lantern strings! Nova sat right down on the cobblestone square and helped the tiny villagers tie neat starry bows. "Many paws make quick work!" laughed Nova.',
    starHunt: 'Can you find 3 hidden stars drawn onto the paper lanterns?',
  },
  {
    chapter: 29,
    storyPage: 64,
    coloringPage: 65,
    title: 'The Star on the Festival Maypole',
    body: 'When the last lantern glowed, the villagers danced around a tall ribbon-wrapped festival pole—and pop! Out of a starry paper piñata tumbled Fallen Star Number Seven, showered in giggles and confetti! The whole village cheered, "Hooray for Nova!"',
    starHunt: 'Can you find 3 hidden stars mixed into the falling confetti?',
  },
  {
    chapter: 30,
    storyPage: 66,
    coloringPage: 67,
    title: 'The Swirly Cloud Stairs',
    body: 'Only one fallen star remained—high up at Grumble\'s Storm Castle, atop a winding staircase of bouncy clouds. Distant thunder rumbled softly like a sleepy tummy, and Nova\'s whiskers twitched. She took a big breath and called out, "Tail up, star bright!"',
    starHunt: 'Can you find 3 hidden stars tucked into the bouncy cloud steps?',
  },
  {
    chapter: 31,
    storyPage: 68,
    coloringPage: 69,
    title: 'A Grumpy Little Cloud',
    body: 'Inside the puffy cloud hall sat Grumble, a tiny round cloud with furrowed brows and big watery eyes. He was hugging Fallen Star Number Eight tightly to his chest. "I\'m not mean!" he sniffled. "Everyone runs away when I rumble—I just wanted a friend to keep me company!"',
    starHunt: 'Can you find 3 hidden stars floating inside the cloud castle arches?',
  },
  {
    chapter: 32,
    storyPage: 70,
    coloringPage: 71,
    title: 'A Hug for Grumble',
    body: 'Nova didn\'t run away—she wrapped Grumble in the fluffiest fox hug ever! "You can be OUR friend," she smiled. "And we need a cloud hero to help lift the stars home!" Grumble\'s frown melted into the biggest, brightest grin, and he happily shared Fallen Star Number Eight.',
    starHunt: "Can you find 3 hidden stars shining around Nova and Grumble's hug?",
  },
  {
    chapter: 33,
    storyPage: 72,
    coloringPage: 73,
    title: 'The Friends Reunite',
    body: "Back on Whisperwood Hilltop, Mama Owl, Captain Button, Pebble, and Grumble gathered in a happy circle around Nova. All eight fallen stars hopped out of Nova's crescent satchel, glowing brighter than ever! Together, they were ready for the biggest moment of the night.",
    starHunt: 'Can you find 3 hidden stars tucked into the hilltop grass?',
  },
  {
    chapter: 34,
    storyPage: 74,
    coloringPage: 75,
    title: 'The Starlight Ladder',
    body: '"My turn to help!" cheered Grumble, puffing himself up into the softest, bounciest cloud-elevator anyone had ever seen. Nova climbed right onto Grumble\'s fluffy back with Pebble and all eight stars. Whoosh! Up, up, up they floated toward the velvety night sky!',
    starHunt: 'Can you find 3 hidden stars riding along the swirling breezes?',
  },
  {
    chapter: 35,
    storyPage: 76,
    coloringPage: 77,
    title: 'Up, Up, and Twinkle!',
    body: 'High above the clouds, Nova lifted her glowing tail and sang out, "Tail up, star bright—fly home tonight!" With a chorus of musical chimes, all eight stars zoomed back into their places in the sky. Instantly, the whole night burst into dazzling, swirling patterns of starlight!',
    starHunt: 'Can you find 3 hidden stars woven into the mandala sky swirls?',
  },
  {
    chapter: 36,
    storyPage: 78,
    coloringPage: 79,
    title: 'The Grand Whisperwood Party',
    body: "Back on the ground, friends from all eight magical lands threw the biggest pajama-and-starlight party ever! The talking mushrooms played music, the friendly bears brought honey-berry cake, and Captain Button danced on a teacup. Grumble beamed proudly—he wasn't lonely anymore!",
    starHunt: 'Can you find 3 hidden stars frosted onto the celebration cake?',
  },
  {
    chapter: 37,
    storyPage: 80,
    coloringPage: 81,
    title: 'A Gift from the Sky',
    body: 'As the music hushed, the shining sky twinkled a special thank-you just for Nova. Down floated one tiny, dazzling crown-star that landed softly right on her crescent-moon satchel. "Look, Nova!" whispered Mama Owl. "The sky gave you a star of your very own!"',
    starHunt: 'Can you find 3 hidden stars sparkling around the floating gift star?',
  },
  {
    chapter: 38,
    storyPage: 82,
    coloringPage: 83,
    title: "Nova's Very Own Star",
    body: 'Nova hugged her new little star close and felt her heart glow warmer than a summer afternoon. She had learned that even the smallest fox can do big, magical things with kindness and a little bit of courage. Pebble yawned happily: "Best adventure ever."',
    starHunt: "Can you find 3 hidden stars glowing around Nova's portrait?",
  },
  {
    chapter: 39,
    storyPage: 84,
    coloringPage: 85,
    title: 'Goodnight, Little Fox',
    body: 'Back inside her cozy hollow-oak den, Nova curled up under her starry quilt with her crooked ear tucked against her pillow. Outside her window, every single star twinkled brightly in the peaceful night sky, keeping watch over Whisperwood Forest. Goodnight, brave little Nova—sweet, starry dreams.',
    starHunt: "Can you find 3 hidden stars shining outside Nova's bedtime window?",
  },
  {
    chapter: 40,
    storyPage: 86,
    coloringPage: 87,
    title: 'Draw Your Own Star!',
    body: "Now it's YOUR turn to be a star-maker! What does your very own magical star look like—does it wear a silly hat, have rainbow stripes, or carry a tiny lantern like Pebble? Draw and color your star right inside the magic frame, and give it a special name!",
    starHunt: 'Can you find 3 hidden stars tucked into the corners of the picture frame?',
  },
];

export function buildPageCatalog(): PageCatalogEntry[] {
  const pages: PageCatalogEntry[] = [
    { page: 1, category: 'title', side: 'recto', title: 'Title Page — Nova and the Fallen Stars' },
    {
      page: 2,
      category: 'copyright',
      side: 'verso',
      title: 'Copyright & Parent Tip',
      hasVisualFix: true,
      fixSummaryAr:
        'تحديث نص نصيحة الآباء ليعكس تخطيط الـ 92 صفحة بدقة (قصة يسار + تلوين يمين) بدلاً من عبارة الوجه الواحد غير الدقيقة، مع إعادة بنائها بخطوط فيكتور مدمجة.',
    },
    { page: 3, category: 'activity', side: 'recto', title: 'This Book Belongs To' },
    { page: 4, category: 'blank', side: 'verso', title: 'Blank Page (Back of Belongs To)' },
    {
      page: 5,
      category: 'activity',
      side: 'recto',
      title: 'Meet Your Adventure Friends!',
      hasVisualFix: true,
      fixSummaryAr:
        'إزالة أسماء الشخصيات الملتصقة بالحد العلوي للأشرطة وإعادة طباعتها بفيكتور متمركز تماماً في منتصف كل شريط (NOVA, PEBBLE, CAPTAIN BUTTON, GRUMBLE, MAMA OWL).',
    },
    { page: 6, category: 'blank', side: 'verso', title: 'Blank Page (Back of Friends)' },
    { page: 7, category: 'activity', side: 'recto', title: "Nova's Starlight Color-Test Page" },
  ];

  for (const ch of CHAPTERS) {
    pages.push({
      page: ch.storyPage,
      category: 'story',
      side: 'verso',
      chapter: ch.chapter,
      title: `Chapter ${ch.chapter}: ${ch.title} (Story)`,
    });
    const isP87 = ch.coloringPage === 87;
    pages.push({
      page: ch.coloringPage,
      category: 'coloring',
      side: 'recto',
      chapter: ch.chapter,
      title: `${ch.chapter}. ${ch.title} (Coloring)`,
      hasVisualFix: isP87,
      fixSummaryAr: isP87
        ? 'إزالة تداخل نص "My Star\'s Name:" فوق أذن الثعلب نوفا وإعادة وضعه بفيكتور نظيف في المساحة الفارغة يمين الشخصية.'
        : undefined,
    });
  }

  pages.push(
    { page: 88, category: 'blank', side: 'verso', title: 'Blank Page (Back of Chapter 40)' },
    { page: 89, category: 'certificate', side: 'recto', title: 'Official Star-Helper Certificate' },
    { page: 90, category: 'blank', side: 'verso', title: 'Blank Page (Back of Certificate)' },
    { page: 91, category: 'review', side: 'recto', title: 'Amazon Review Request' },
    { page: 92, category: 'promo', side: 'verso', title: 'Coming Soon — Book 2 Preview' },
  );

  return pages;
}
