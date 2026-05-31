// STATEFUL MOCK DATA LAYER - SYNCS TO LOCAL STORAGE FOR FULL DYNAMIC CRUD DEMO

// Database Version Migration to clear stale Picsum dummy data and force load real woodworking Unsplash images
const DB_VERSION_KEY = 'carpenter_db_version';
const CURRENT_DB_VERSION = '3.0';

if (typeof window !== 'undefined' && window.localStorage) {
  const storedVersion = localStorage.getItem(DB_VERSION_KEY);
  if (storedVersion !== CURRENT_DB_VERSION) {
    localStorage.removeItem('settings');
    localStorage.removeItem('categories');
    localStorage.removeItem('subcategories');
    localStorage.setItem(DB_VERSION_KEY, CURRENT_DB_VERSION);
  }
}

const getUnsplashUrl = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&h=800&q=80`;

const subcategoryImageIds = {
  // DOORS
  "single-door": [
    "photo-1544984243-ec57ea16fe25", // wooden door interior
    "photo-1513694203232-719a280e022f", // rustic bedroom door
    "photo-1584622650111-993a426fbf0a", // solid oak bathroom door
    "photo-1600585154340-be6161a56a0c", // modern walnut interior door
    "photo-1600607687939-ce8a6c25118c", // minimalist wood veneer door
    "photo-1615529182904-14819c35db37", // sliding timber barn door
    "photo-1517581177682-a085bb7ffb15", // heavy oak paneled door
    "photo-1534349762230-e0cadf78f5da", // vintage carved entry door
    "photo-1600585452201-303b784a5ca8", // sleek veneer flush door
    "photo-1600566752355-35792bedcfea", // contemporary wood pivot door
    "photo-1507089947368-19c1da9775ae", // wooden villa door
    "photo-1505691938895-1758d7feb511"  // hardwood frame interior door
  ],
  "double-door": [
    "photo-1512917774080-9991f1c4c750", // massive mahogany double entrance doors
    "photo-1497366216548-37526070297c", // office double doors in glass/teak
    "photo-1582268611958-ebfd161ef9cf", // grand classical oak double doors
    "photo-1600585154526-990dced4db0d", // luxury residence front double doors
    "photo-1600607688066-890987f18a86", // custom walnut double entry
    "photo-1600573472591-ee6b68d14c68", // french pane glass double doors
    "photo-1598928506311-c55ded91a20c", // modern wood double doors with metal pull bars
    "photo-1600047509807-ba8f99d2cdde", // custom grain matched double doors
    "photo-1600566753190-17f0baa2a6c3", // grand villa main pivot double doors
    "photo-1505691938895-1758d7feb511"  // heavy solid timber entry double door
  ],
  "designer-door": [
    "photo-1505691938895-1758d7feb511", // architectural designer door
    "photo-1544984243-ec57ea16fe25", // modern light oak designer door
    "photo-1513694203232-719a280e022f", // classic luxury custom door
    "photo-1600585154340-be6161a56a0c", // designer wood pivot door
    "photo-1584622650111-993a426fbf0a", // modern grooved teak designer door
    "photo-1600607687939-ce8a6c25118c", // walnut door with custom brass insert
    "photo-1613977257363-707ba9348227", // designer door sliding track panel
    "photo-1600566752229-2734f5b0edd0", // premium wood door with frosted glass slats
    "photo-1600210492486-724fe5c67fb0", // minimal wood designer panel door
    "photo-1600566752355-35792bedcfea"  // luxury wooden door with horizontal grain detail
  ],
  "entrance-door": [
    "photo-1507089947368-19c1da9775ae", // rustic custom main entrance door
    "photo-1512917774080-9991f1c4c750", // majestic entry double door
    "photo-1600585154526-990dced4db0d", // modern architecture luxury pivot entrance door
    "photo-1582268611958-ebfd161ef9cf", // heavy solid timber front door
    "photo-1600607687920-4e2a09cf159d", // premium teak front door with sidelights
    "photo-1600047509807-ba8f99d2cdde", // architectural wood slat main entrance door
    "photo-1600573472591-ee6b68d14c68", // bespoke paneled wood front door
    "photo-1598928506311-c55ded91a20c"  // robust security timber entrance door
  ],

  // WINDOWS
  "sliding-window-2": [
    "photo-1600566753376-12c8ab7fb75b", // 2 track sliding glass window wooden frame
    "photo-1600607687644-c7171b42498f", // premium oak sliding window frames
    "photo-1613977257363-707ba9348227", // minimal modern 2 track sliding wood window
    "photo-1600585154526-990dced4db0d", // timber sliding window panoramic view
    "photo-1509644851169-2acc08aa25b5", // cozy double track sliding wooden window
    "photo-1513694203232-719a280e022f", // interior wood window panels
    "photo-1502672260266-1c1ef2d93688", // minimal wood trim sliding window
    "photo-1486406146926-c627a92ad1ab", // architectural wood frame exterior window
    "photo-1522708323590-d24dbb6b0267", // sash wood sliding window frame
    "photo-1585412727339-54e4bae3bbf9"  // sliding window looking onto forest
  ],
  "sliding-window-3": [
    "photo-1600607687644-c7171b42498f", // solid hardwood triple sliding window
    "photo-1613977257363-707ba9348227", // large 3 track sliding balcony window
    "photo-1600585154526-990dced4db0d", // luxury panoramic 3 track sliding frame
    "photo-1509644851169-2acc08aa25b5", // heavy oak frame triple sliding window
    "photo-1513694203232-719a280e022f", // bright room study with 3 track timber windows
    "photo-1502672260266-1c1ef2d93688", // minimalist pine triple track window
    "photo-1486406146926-c627a92ad1ab", // large custom cedar window frames
    "photo-1522708323590-d24dbb6b0267"  // classic timber triple sliding frame
  ],
  "french-window": [
    "photo-1600210492486-724fe5c67fb0", // double french doors windows wood frames
    "photo-1600573472591-ee6b68d14c68", // luxury floor to ceiling french casement windows
    "photo-1513694203232-719a280e022f", // sunny white oak french windows
    "photo-1509644851169-2acc08aa25b5", // elegant traditional grid french windows
    "photo-1600585154526-990dced4db0d", // premium architectural french window panes
    "photo-1502672260266-1c1ef2d93688", // light timber french windows grid
    "photo-1486406146926-c627a92ad1ab", // heavy timber rustic french window
    "photo-1522708323590-d24dbb6b0267", // dark oak traditional french window grid
    "photo-1585412727339-54e4bae3bbf9", // cozy master bedroom french wood windows
    "photo-1600566753376-12c8ab7fb75b"  // contemporary designer wood frame window
  ],
  "casement-window": [
    "photo-1585412727339-54e4bae3bbf9", // swing out casement wood window frame
    "photo-1502672260266-1c1ef2d93688", // single casement hinge window pine
    "photo-1522708323590-d24dbb6b0267", // traditional sash casement timber window
    "photo-1509644851169-2acc08aa25b5", // custom architectural wooden swing casement
    "photo-1513694203232-719a280e022f", // high ceiling casement window woodwork
    "photo-1600585154526-990dced4db0d", // premium luxury casement window crank
    "photo-1486406146926-c627a92ad1ab", // heavy rustic cedar swing window frame
    "photo-1600566753376-12c8ab7fb75b"  // minimalist walnut casement window
  ],

  // TABLES
  "dining-table": [
    "photo-1530018607912-eff2df114fbe", // rustic solid oak slab dining table
    "photo-1577140917170-285929fb55b7", // premium joinery double trestle oak dining table
    "photo-1595515106969-1ce29566ff1c", // close up details mortise and tenon dining table
    "photo-1615066390971-03e4e1c36ddf", // massive live edge slab wood dining table
    "photo-1533090161767-e6ffed986c88", // minimal walnut dynamic dining table
    "photo-1565793298595-6a879b1d9492", // high gloss walnut luxury dining table
    "photo-1518455027359-f3f8164ba6bd", // solid ash rectangular kitchen table
    "photo-1493663284031-b7e3aefcae8e", // sleek round wood table pedestal base
    "photo-1532372320978-9b4d6a3a854c", // heavy farm style wooden dining table
    "photo-1581428982868-e410dd047a90"  // precision butterfly join wood table
  ],
  "coffee-table": [
    "photo-1544457070-4cd96414ad5d", // live edge cross section tree trunk coffee table
    "photo-1533090161767-e6ffed986c88", // modern low profile wooden coffee table
    "photo-1493663284031-b7e3aefcae8e", // hand turned legs small wood coffee table
    "photo-1581428982868-e410dd047a90", // solid wood coffee table showing grain structure
    "photo-1530018607912-eff2df114fbe", // rustic pallet style wood coffee chest
    "photo-1615066390971-03e4e1c36ddf", // live edge maple slab coffee table with steel legs
    "photo-1577140917170-285929fb55b7", // custom joinery dual level coffee table
    "photo-1565793298595-6a879b1d9492", // polished mahogany console coffee table
    "photo-1518455027359-f3f8164ba6bd", // minimalist oak block coffee table
    "photo-1542838132-92c53300491e"  // premium hand scraped teak coffee table
  ],
  "office-table": [
    "photo-1565793298595-6a879b1d9492", // executive double pedestal solid walnut desk
    "photo-1532372320978-9b4d6a3a854c", // bespoke conference room live edge oak table
    "photo-1518455027359-f3f8164ba6bd", // computer desk with floating oak drawer units
    "photo-1581428982868-e410dd047a90", // custom joiner's work table office integration
    "photo-1542838132-92c53300491e", // clean minimal ash wood study office desk
    "photo-1533090161767-e6ffed986c88", // executive modern desk walnut veneer drawers
    "photo-1493663284031-b7e3aefcae8e", // small wooden writing desk turned legs
    "photo-1577140917170-285929fb55b7"  // luxury wooden desk custom grommets wire hiding
  ],
  "study-table": [
    "photo-1518455027359-f3f8164ba6bd", // study desk white oak legs drawer unit
    "photo-1532372320978-9b4d6a3a854c", // home office writing desk teak wood
    "photo-1581428982868-e410dd047a90", // craft desk workspace heavy timber top
    "photo-1542838132-92c53300491e", // youth study desk birch plywood edges
    "photo-1533090161767-e6ffed986c88", // bedroom study corner table walnut
    "photo-1493663284031-b7e3aefcae8e", // small drop leaf wooden study table
    "photo-1565793298595-6a879b1d9492", // bookcase secretary study desk combo wood
    "photo-1577140917170-285929fb55b7"  // wall mounted floating oak study shelf desk
  ],

  // CHAIRS
  "dining-chair": [
    "photo-1567538096630-e0c55bd6374c", // handcrafted solid maple dining chair
    "photo-1592078615290-033ee584e267", // dining room table set with matching oak chairs
    "photo-1586023492125-27b2c045efd7", // minimalist wooden dinette chair
    "photo-1519947486511-461091892c87", // traditional spindle back timber chair
    "photo-1503602642458-232111445657", // mid-century modern teak dining chair
    "photo-1598300042247-d088f8ab3a91", // contemporary bentwood dining chair
    "photo-1506439773649-6e0eb8cfb237", // Windsor dining chair solid ash
    "photo-1581858726788-75bc0f6a952d", // padded seat wooden frame dining chair
    "photo-1501045661006-fde69c47a622", // mid-century walnut dining chair set
    "photo-1580481072645-022f9a6dbf27"  // classic ladderback oak dining chair
  ],
  "office-chair": [
    "photo-1501045661006-fde69c47a622", // executive office chair wooden swivel frame
    "photo-1598300042247-d088f8ab3a91", // ergonomic desk chair wood back structure
    "photo-1586023492125-27b2c045efd7", // minimalist birch plywood task chair
    "photo-1503602642458-232111445657", // mid-century leather office chair teak frame
    "photo-1567538096630-e0c55bd6374c", // clean wood office side chair
    "photo-1592078615290-033ee584e267", // meeting room wooden frame chairs
    "photo-1581858726788-75bc0f6a952d", // luxury conference chair walnut arms
    "photo-1549497538-303791108f95"  // modern low back wood swivel desk chair
  ],
  "lounge-chair": [
    "photo-1598300042247-d088f8ab3a91", // premium leather lounge chair molded plywood shell
    "photo-1506439773649-6e0eb8cfb237", // hand carved rocking lounge chair solid cherry
    "photo-1549497538-303791108f95", // stylish contemporary wood slat lounge chair
    "photo-1503602642458-232111445657", // classic danish cord woven wood lounge chair
    "photo-1567538096630-e0c55bd6374c", // lounge chair accent ash frame
    "photo-1592078615290-033ee584e267", // living room wooden low seat chairs
    "photo-1586023492125-27b2c045efd7", // custom grain bentwood lounge chair
    "photo-1581858726788-75bc0f6a952d", // luxury armchair lounge cushion wood base
    "photo-1501045661006-fde69c47a622", // mid-century walnut lounge chair
    "photo-1596568300556-2e99a2ad0f3b"  // cozy wood frame armchair linen cushions
  ],
  "armchair": [
    "photo-1581858726788-75bc0f6a952d", // custom walnut frame armchair joinery detail
    "photo-1596568300556-2e99a2ad0f3b", // white oak armchair loose cushioning
    "photo-1506439773649-6e0eb8cfb237", // master wood carver's heavy oak armchair
    "photo-1549497538-303791108f95", // designer slatted backyard redwood armchair
    "photo-1598300042247-d088f8ab3a91", // mid-century plywood side armchair
    "photo-1503602642458-232111445657", // woven rattan and teak wood armchair
    "photo-1567538096630-e0c55bd6374c", // simple elegant dining armchair wood arms
    "photo-1592078615290-033ee584e267"  // classic solid wood library armchair
  ],

  // BEDS
  "single-bed": [
    "photo-1522771739844-6a9f6d5f14af", // kids wooden single bed white oak
    "photo-1505693395321-883724634266", // rustic pine guest single bed frame
    "photo-1540518614846-7eded433c457", // minimal ash single platform bed
    "photo-1505693416388-ac5ce068fe85", // heavy timber spindle single bed frame
    "photo-1616594039964-ae9021a400a0", // maple single bed frame slats
    "photo-1586521995568-39abaa0c2411", // single storage bed with underbed drawers
    "photo-1617325247661-675c443422b8", // modern low profile single bed timber
    "photo-1618220179428-22790b461013"  // walnut single bed panel headboard
  ],
  "double-bed": [
    "photo-1600210492486-724fe5c67fb0", // double bed frame wood matching nightstands
    "photo-1616046229478-9901c5536a45", // solid cherry double bed frame classic design
    "photo-1505693416388-ac5ce068fe85", // rustic farmhouse style double bed frame
    "photo-1616594039964-ae9021a400a0", // modern white oak master double bed
    "photo-1586521995568-39abaa0c2411", // double bed headboard shelf organizer
    "photo-1617325247661-675c443422b8", // low platform double bed walnut wood
    "photo-1540518614846-7eded433c457", // minimalist birch double bed slatted headboard
    "photo-1618220179428-22790b461013"  // custom wood slab headboard double bed
  ],
  "king-bed": [
    "photo-1505693416388-ac5ce068fe85", // massive king size walnut platform bed
    "photo-1616594039964-ae9021a400a0", // premium solid oak king bed frame mortise joins
    "photo-1617325247661-675c443422b8", // floating look teak wood king size bed
    "photo-1540518614846-7eded433c457", // low platform wood slatted king size bed frame
    "photo-1618220179428-22790b461013", // wood live edge slab headboard king bed
    "photo-1600585154526-990dced4db0d", // luxury master suite master wood frame king bed
    "photo-1600210492486-724fe5c67fb0", // elegant wood poster king bed frame
    "photo-1595428774223-ef52624120d2", // custom wood paneled accent headboard king
    "photo-1616046229478-9901c5536a45", // matching nightstands oak king bed frame
    "photo-1586521995568-39abaa0c2411"  // heavy hardwood rustic king bed
  ],
  "storage-bed": [
    "photo-1586521995568-39abaa0c2411", // platform bed with 4 massive wooden underdrawers
    "photo-1505693416388-ac5ce068fe85", // master king bed lift up hydraulic wooden base
    "photo-1616594039964-ae9021a400a0", // oak storage bed frame flush cabinets in headboard
    "photo-1617325247661-675c443422b8", // modern walnut storage bed cubbies
    "photo-1540518614846-7eded433c457", // minimalist birch bed hidden storage drawer
    "photo-1618220179428-22790b461013", // solid wood bed hydraulic lift storage deck
    "photo-1600585154526-990dced4db0d", // luxury storage bed frame grain match drawer fronts
    "photo-1595428774223-ef52624120d2"  // bespoke joinery bed with side integrated pullout drawer
  ],

  // CUPBOARDS
  "wardrobe": [
    "photo-1595428774223-ef52624120d2", // built-in custom walk in closet wardrobe white oak
    "photo-1551488831-00ddcb6c6bd3", // classic freestanding wardrobe walnut 2 doors
    "photo-1600607687939-ce8a6c25118c", // custom wardrobe handles joinery detail
    "photo-1603006905003-be475563bc59", // luxury custom cabinet wardrobes grain matching
    "photo-1595526114035-0d45ed16cfbf", // minimal light wood bedroom wardrobe cupboard
    "photo-1600566752355-35792bedcfea", // luxury wood walk-in wardrobe cabinet system
    "photo-1600121848594-d8644e57abad", // display glass doors dynamic wood closet
    "photo-1618219908412-a29a1bb7b86e", // dark walnut luxury wardrobe closet drawers
    "photo-1540518614846-7eded433c457", // minimal ash wood veneer wardrobe unit
    "photo-1597072689227-8882273e8f6a"  // sliding mirror wardrobe wood panel frame
  ],
  "sliding-wardrobe": [
    "photo-1615529182904-14819c35db37", // sliding closet doors premium oak panels
    "photo-1595428774223-ef52624120d2", // built-in sliding wooden wardrobe doors
    "photo-1603006905003-be475563bc59", // minimalist walnut sliding door system closet
    "photo-1595526114035-0d45ed16cfbf", // light ash sliding wardrobe doors
    "photo-1600566752355-35792bedcfea", // custom architectural sliding wardrobe dividers
    "photo-1600121848594-d8644e57abad", // glass sliding closet wood framing
    "photo-1618219908412-a29a1bb7b86e", // executive wardrobe walnut sliding slabs
    "photo-1540518614846-7eded433c457"  // pine sliding wardrobe door frame
  ],
  "modular-cupboard": [
    "photo-1603006905003-be475563bc59", // modular storage cabinetry walnut stacks
    "photo-1595526114035-0d45ed16cfbf", // custom ash modular cupboard modules
    "photo-1600566752355-35792bedcfea", // modular walk in wardrobe wood frames
    "photo-1600121848594-d8644e57abad", // glass and wood modular pantry cupboard
    "photo-1618219908412-a29a1bb7b86e", // modular office filing cupboard dark walnut
    "photo-1540518614846-7eded433c457", // stackable ash wood cubes storage cupboard
    "photo-1597072689227-8882273e8f6a", // modular bedroom closet drawers and inserts
    "photo-1595428774223-ef52624120d2"  // bespoke modular timber garage cupboard shelving
  ],
  "display-cabinet": [
    "photo-1600121848594-d8644e57abad", // floor to ceiling oak display cabinet glass pane doors
    "photo-1618219908412-a29a1bb7b86e", // custom built wall display case walnut led lighting
    "photo-1597072689227-8882273e8f6a", // living room wooden display console glass front
    "photo-1595428774223-ef52624120d2", // floating wood display cabinet cubbies
    "photo-1551488831-00ddcb6c6bd3", // antique style custom mahogany display case
    "photo-1600607687939-ce8a6c25118c", // walnut sideboard credenza display cabinet
    "photo-1603006905003-be475563bc59", // lighted modular display shelves wood backing
    "photo-1595526114035-0d45ed16cfbf"  // light timber china cabinet display
  ]
};

const initialSettings = {
  name: "Oak & Iron Studio",
  logoText: "Oak & Iron",
  logoSub: "ARCHITECTURAL JOINERY",
  tagline: "Bespoke Carpentry & Modern Furniture Design",
  description: "We craft premium, high-performance architectural doors, windows, and custom furniture. Blending traditional craftsmanship with modern design principles, our creations are built to last generations.",
  aboutIntro: "Founded on the values of precision, premium wood selection, and timeless aesthetics, Oak & Iron Studio works directly with architects, designers, and homeowners. Every joint is carefully calculated, every surface hand-finished to highlight the natural soul of the wood.",
  aboutExperience: "Over 15 years of dedicated woodcraft experience delivering flawless installations. We select only sustainably sourced hardwoods, utilizing both traditional mortise-and-tenon joins and state-of-the-art precision machinery.",
  experienceYears: "15+",
  projectsCompleted: "1,200+",
  craftsmenCount: "8",
  whatsappNumber: "",
  whatsappUrl: "https://wa.me/1234567890?text=Hi%2C%20I'm%20interested%20in%20your%20carpentry%20and%20design%20services!",
  phoneUrl: "tel:+1234567890",
  phoneDisplay: "+1 (234) 567-890",
  email: "hello@oakandiron.studio",
  addressDisplay: "742 Artisan Way, Suite 100, Woodworkers District",
  addressUrl: "https://maps.google.com/?q=742+Artisan+Way,+Woodworkers+District",
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d-122.41941550000001!3d37.774929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807bed123456%3A0x123456789abcdef0!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus",
  socialLinks: {
    instagram: "https://instagram.com",
    pinterest: "https://pinterest.com",
    facebook: "https://facebook.com",
    youtube: "https://youtube.com"
  },
  heroImage: getUnsplashUrl("photo-1600585154340-be6161a56a0c")
};

const initialCategories = [
  { id: "doors", name: "Doors", coverImage: getUnsplashUrl("photo-1600607687920-4e2a09cf159d"), description: "Bespoke interior and exterior doors designed to make a grand entrance.", displayOrder: 0, visible: true },
  { id: "windows", name: "Windows", coverImage: getUnsplashUrl("photo-1600566753376-12c8ab7fb75b"), description: "Architectural sliding and French windows that connect indoor elegance with outdoor beauty.", displayOrder: 1, visible: true },
  { id: "tables", name: "Tables", coverImage: getUnsplashUrl("photo-1577140917170-285929fb55b7"), description: "Premium dining, coffee, and office tables crafted from solid wood.", displayOrder: 2, visible: true },
  { id: "chairs", name: "Chairs", coverImage: getUnsplashUrl("photo-1503602642458-232111445657"), description: "Handcrafted ergonomic seating, lounge chairs, and stools highlighting wood grains.", displayOrder: 3, visible: true },
  { id: "beds", name: "Beds", coverImage: getUnsplashUrl("photo-1505693416388-ac5ce068fe85"), description: "Premium solid wood bed frames and bedroom collections built for comfort.", displayOrder: 4, visible: true },
  { id: "cupboards", name: "Cupboards", coverImage: getUnsplashUrl("photo-1595428774223-ef52624120d2"), description: "Architectural cabinetry, modern cupboards, wardrobes, and credenzas.", displayOrder: 5, visible: true }
];

const buildInitialSubcategories = () => {
  const getSubUrls = (subId) => {
    const ids = subcategoryImageIds[subId] || [];
    return ids.map(getUnsplashUrl);
  };
  const stamp = (sub) => {
    const images = sub.galleryImages || [];
    return { ...sub, imageCount: images.length, updatedAt: nowISO() };
  };

  return [
    // ── DOORS ──
    stamp({ id: "single-door", categoryId: "doors", name: "Single Door", coverImage: getUnsplashUrl("photo-1544984243-ec57ea16fe25"), description: "Handcrafted single doors in premium hardwoods. Each piece features solid wood construction with traditional joinery techniques.", displayOrder: 0, visible: true, galleryImages: getSubUrls("single-door"), coverIndex: 0 }),
    stamp({ id: "double-door", categoryId: "doors", name: "Double Door", coverImage: getUnsplashUrl("photo-1512917774080-9991f1c4c750"), description: "Grand double-entry doors for impressive entrances. Symmetrical designs with matching wood grain across both panels.", displayOrder: 1, visible: true, galleryImages: getSubUrls("double-door"), coverIndex: 0 }),
    stamp({ id: "designer-door", categoryId: "doors", name: "Designer Door", coverImage: getUnsplashUrl("photo-1600585154340-be6161a56a0c"), description: "Custom designer doors with unique architectural features. Contemporary styles with glass inserts and metal accents.", displayOrder: 2, visible: true, galleryImages: getSubUrls("designer-door"), coverIndex: 0 }),
    stamp({ id: "entrance-door", categoryId: "doors", name: "Main Entrance Door", coverImage: getUnsplashUrl("photo-1507089947368-19c1da9775ae"), description: "Solid wood main entrance doors with enhanced security features. Weather-resistant finishes for long-lasting beauty.", displayOrder: 3, visible: true, galleryImages: getSubUrls("entrance-door"), coverIndex: 0 }),

    // ── WINDOWS ──
    stamp({ id: "sliding-window-2", categoryId: "windows", name: "2 Track Sliding", coverImage: getUnsplashUrl("photo-1600566753376-12c8ab7fb75b"), description: "Dual track sliding windows for modern homes. Smooth gliding mechanism with weather-tight seals.", displayOrder: 0, visible: true, galleryImages: getSubUrls("sliding-window-2"), coverIndex: 0 }),
    stamp({ id: "sliding-window-3", categoryId: "windows", name: "3 Track Sliding", coverImage: getUnsplashUrl("photo-1600607687644-c7171b42498f"), description: "Triple track sliding windows offering maximum ventilation. Flexible panel configurations for any room.", displayOrder: 1, visible: true, galleryImages: getSubUrls("sliding-window-3"), coverIndex: 0 }),
    stamp({ id: "french-window", categoryId: "windows", name: "French Window", coverImage: getUnsplashUrl("photo-1600210492486-724fe5c67fb0"), description: "Elegant French casement windows with classic styling. Authentic period details combined with modern energy efficiency.", displayOrder: 2, visible: true, galleryImages: getSubUrls("french-window"), coverIndex: 0 }),
    stamp({ id: "casement-window", categoryId: "windows", name: "Casement Window", coverImage: getUnsplashUrl("photo-1585412727339-54e4bae3bbf9"), description: "Modern casement windows with crank-out operation. Clean sightlines and excellent ventilation control.", displayOrder: 3, visible: true, galleryImages: getSubUrls("casement-window"), coverIndex: 0 }),

    // ── TABLES ──
    stamp({ id: "dining-table", categoryId: "tables", name: "Dining Table", coverImage: getUnsplashUrl("photo-1530018607912-eff2df114fbe"), description: "Solid wood dining tables for family gatherings. Extendable designs crafted from sustainably sourced hardwoods.", displayOrder: 0, visible: true, galleryImages: getSubUrls("dining-table"), coverIndex: 0 }),
    stamp({ id: "coffee-table", categoryId: "tables", name: "Coffee Table", coverImage: getUnsplashUrl("photo-1544457070-4cd96414ad5d"), description: "Modern and traditional coffee tables in various finishes. Features live-edge slabs and minimalist silhouettes.", displayOrder: 1, visible: true, galleryImages: getSubUrls("coffee-table"), coverIndex: 0 }),
    stamp({ id: "office-table", categoryId: "tables", name: "Office Table", coverImage: getUnsplashUrl("photo-1565793298595-6a879b1d9492"), description: "Executive desks and office tables with integrated cable management. Ergonomic designs for productive workspaces.", displayOrder: 2, visible: true, galleryImages: getSubUrls("office-table"), coverIndex: 0 }),
    stamp({ id: "study-table", categoryId: "tables", name: "Study Table", coverImage: getUnsplashUrl("photo-1518455027359-f3f8164ba6bd"), description: "Compact study tables and writing desks. Space-saving designs with built-in storage for home offices.", displayOrder: 3, visible: true, galleryImages: getSubUrls("study-table"), coverIndex: 0 }),

    // ── CHAIRS ──
    stamp({ id: "dining-chair", categoryId: "chairs", name: "Dining Chair", coverImage: getUnsplashUrl("photo-1567538096630-e0c55bd6374c"), description: "Dining chairs crafted for comfort and durability. Upholstered seats with solid wood frames in timeless silhouettes.", displayOrder: 0, visible: true, galleryImages: getSubUrls("dining-chair"), coverIndex: 0 }),
    stamp({ id: "office-chair", categoryId: "chairs", name: "Office Chair", coverImage: getUnsplashUrl("photo-1501045661006-fde69c47a622"), description: "Ergonomic office chairs with lumbar support. Adjustable height and tilt mechanisms wrapped in premium materials.", displayOrder: 1, visible: true, galleryImages: getSubUrls("office-chair"), coverIndex: 0 }),
    stamp({ id: "lounge-chair", categoryId: "chairs", name: "Lounge Chair", coverImage: getUnsplashUrl("photo-1598300042247-d088f8ab3a91"), description: "Comfortable lounge chairs with premium upholstery. Mid-century and contemporary designs for relaxed living spaces.", displayOrder: 2, visible: true, galleryImages: getSubUrls("lounge-chair"), coverIndex: 0 }),
    stamp({ id: "armchair", categoryId: "chairs", name: "Wooden Armchair", coverImage: getUnsplashUrl("photo-1581858726788-75bc0f6a952d"), description: "Elegant armchairs with solid wood frames and plush cushioning. Traditional craftsmanship meets modern comfort.", displayOrder: 3, visible: true, galleryImages: getSubUrls("armchair"), coverIndex: 0 }),

    // ── BEDS ──
    stamp({ id: "single-bed", categoryId: "beds", name: "Single Bed", coverImage: getUnsplashUrl("photo-1522771739844-6a9f6d5f14af"), description: "Space-saving single bed frames for kids and guest rooms. Sturdy construction with optional under-bed storage.", displayOrder: 0, visible: true, galleryImages: getSubUrls("single-bed"), coverIndex: 0 }),
    stamp({ id: "double-bed", categoryId: "beds", name: "Double Bed", coverImage: getUnsplashUrl("photo-1600210492486-724fe5c67fb0"), description: "Double bed frames with elegant headboard designs. Perfect for smaller master bedrooms and guest suites.", displayOrder: 1, visible: true, galleryImages: getSubUrls("double-bed"), coverIndex: 0 }),
    stamp({ id: "king-bed", categoryId: "beds", name: "King Size Bed", coverImage: getUnsplashUrl("photo-1505693416388-ac5ce068fe85"), description: "King size platform beds with built-in storage options. Premium hardwood construction with hand-finished details.", displayOrder: 2, visible: true, galleryImages: getSubUrls("king-bed"), coverIndex: 0 }),
    stamp({ id: "storage-bed", categoryId: "beds", name: "Storage Bed", coverImage: getUnsplashUrl("photo-1586521995568-39abaa0c2411"), description: "Beds with integrated drawer storage and hydraulic lift mechanisms. Maximize bedroom space without sacrificing style.", displayOrder: 3, visible: true, galleryImages: getSubUrls("storage-bed"), coverIndex: 0 }),

    // ── CUPBOARDS ──
    stamp({ id: "wardrobe", categoryId: "cupboards", name: "Wardrobe", coverImage: getUnsplashUrl("photo-1595428774223-ef52624120d2"), description: "Custom built-in and freestanding wardrobes. Adjustable shelving and hanging systems for organized storage.", displayOrder: 0, visible: true, galleryImages: getSubUrls("wardrobe"), coverIndex: 0 }),
    stamp({ id: "sliding-wardrobe", categoryId: "cupboards", name: "Sliding Wardrobe", coverImage: getUnsplashUrl("photo-1615529182904-14819c35db37"), description: "Modern sliding door wardrobes with mirrored panels. Space-efficient solutions for contemporary bedrooms.", displayOrder: 1, visible: true, galleryImages: getSubUrls("sliding-wardrobe"), coverIndex: 0 }),
    stamp({ id: "modular-cupboard", categoryId: "cupboards", name: "Modular Cupboard", coverImage: getUnsplashUrl("photo-1603006905003-be475563bc59"), description: "Flexible modular cupboard systems for any room. Customizable configurations to fit your storage needs.", displayOrder: 2, visible: true, galleryImages: getSubUrls("modular-cupboard"), coverIndex: 0 }),
    stamp({ id: "display-cabinet", categoryId: "cupboards", name: "Display Cabinet", coverImage: getUnsplashUrl("photo-1600121848594-d8644e57abad"), description: "Elegant display cabinets with glass doors and interior lighting. Showcase your cherished collections in style.", displayOrder: 3, visible: true, galleryImages: getSubUrls("display-cabinet"), coverIndex: 0 })
  ];
};

const getLocalStorage = (key, fallback) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  let parsed = JSON.parse(data);
  if (Array.isArray(parsed)) {
    let modified = false;
    parsed = parsed.map((item, index) => {
      let updatedItem = { ...item };
      if (updatedItem.visible === undefined) {
        updatedItem.visible = true;
        modified = true;
      }
      if (updatedItem.displayOrder === undefined) {
        updatedItem.displayOrder = index;
        modified = true;
      }
      if (key === 'subcategories') {
        if (!updatedItem.galleryImages || !Array.isArray(updatedItem.galleryImages)) {
          updatedItem.galleryImages = [];
          modified = true;
        }
        if (updatedItem.coverIndex === undefined) {
          updatedItem.coverIndex = 0;
          modified = true;
        }
        if (updatedItem.imageCount === undefined) {
          updatedItem.imageCount = (updatedItem.galleryImages || []).length;
          modified = true;
        }
        if (updatedItem.updatedAt === undefined) {
          updatedItem.updatedAt = nowISO();
          modified = true;
        }
      }
      return updatedItem;
    });
    if (modified) {
      localStorage.setItem(key, JSON.stringify(parsed));
    }
  }
  return parsed;
};

const setLocalStorage = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

export const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 480;
        const MAX_HEIGHT = 480;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = (err) => reject(err);
      img.src = event.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const getEffectiveCoverImage = (sub) => {
  const gallery = sub.galleryImages || [];
  const idx = sub.coverIndex !== undefined ? sub.coverIndex : 0;
  if (gallery.length > 0) {
    if (idx >= 0 && idx < gallery.length) return gallery[idx];
    return gallery[0];
  }
  return sub.coverImage;
};

export const getSettings = () => getLocalStorage('settings', initialSettings);
export const saveSettings = (newSettings) => setLocalStorage('settings', newSettings);

export const getCategories = () => getLocalStorage('categories', initialCategories);
export const saveCategories = (categories) => setLocalStorage('categories', categories);
export const addCategory = (cat) => {
  const list = getCategories();
  cat.displayOrder = cat.displayOrder !== undefined ? cat.displayOrder : list.length;
  cat.visible = cat.visible !== undefined ? cat.visible : true;
  list.push(cat);
  saveCategories(list);
};
export const deleteCategory = (id) => {
  const list = getCategories().filter(c => c.id !== id);
  saveCategories(list);
};
export const updateCategory = (cat) => {
  const list = getCategories().map(c => c.id === cat.id ? cat : c);
  saveCategories(list);
};

export const getSubcategoryImages = (slug) => {
  try {
    const all = JSON.parse(localStorage.getItem('subcategoryImages') || '{}');
    return all[slug] || [];
  } catch { return []; }
};

export const saveSubcategoryImages = (slug, images) => {
  const all = JSON.parse(localStorage.getItem('subcategoryImages') || '{}');
  all[slug] = images;
  localStorage.setItem('subcategoryImages', JSON.stringify(all));
};

export const deleteSubcategoryImages = (slug) => {
  const all = JSON.parse(localStorage.getItem('subcategoryImages') || '{}');
  delete all[slug];
  localStorage.setItem('subcategoryImages', JSON.stringify(all));
};

export function seedDefaultSubcategoryImages() {
  if (!localStorage.getItem('subcategoryImages')) {
    const all = {};
    for (const [subId, ids] of Object.entries(subcategoryImageIds)) {
      all[subId] = ids.map(getUnsplashUrl);
    }
    localStorage.setItem('subcategoryImages', JSON.stringify(all));
  }
}
