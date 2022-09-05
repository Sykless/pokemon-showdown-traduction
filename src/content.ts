// Little trick in order to access Showdown variables inside script.js
var s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.js');
(document.head || document.documentElement).appendChild(s);

var observer = new MutationObserver(onMutation);
observer.observe(document, {
	childList: true, // report added/removed nodes
	subtree: true,   // observe any descendant elements
});

function removeDiacritics(text: string)
{
	return text
	  .normalize('NFD')
	  .replace(/[\u0300-\u036f]/g, '');
}

const PokemonDico: { [englishName: string]: string; } = {
	"Bulbasaur": "Bulbizarre",
	"Ivysaur": "Herbizarre",
	"Venusaur": "Florizarre",
	"Charmander": "Salamèche",
	"Charmeleon": "Reptincel",
	"Charizard": "Dracaufeu",
	"Squirtle": "Carapuce",
	"Wartortle": "Carabaffe",
	"Blastoise": "Tortank",
	"Caterpie": "Chenipan",
	"Metapod": "Chrysacier",
	"Butterfree": "Papilusion",
	"Weedle": "Aspicot",
	"Kakuna": "Coconfort",
	"Beedrill": "Dardargnan",
	"Pidgey": "Roucool",
	"Pidgeotto": "Roucoups",
	"Pidgeot": "Roucarnage",
	"Rattata": "Rattata",
	"Raticate": "Rattatac",
	"Spearow": "Piafabec",
	"Fearow": "Rapasdepic",
	"Ekans": "Abo",
	"Arbok": "Arbok",
	"Pikachu": "Pikachu",
	"Raichu": "Raichu",
	"Sandshrew": "Sabelette",
	"Sandslash": "Sablaireau",
	"Nidoran-F": "Nidoran-F",
	"Nidorina": "Nidorina",
	"Nidoqueen": "Nidoqueen",
	"Nidoran-M": "Nidoran-M",
	"Nidorino": "Nidorino",
	"Nidoking": "Nidoking",
	"Clefairy": "Mélofée",
	"Clefable": "Mélodelfe",
	"Vulpix": "Goupix",
	"Ninetales": "Feunard",
	"Jigglypuff": "Rondoudou",
	"Wigglytuff": "Grodoudou",
	"Zubat": "Nosferapti",
	"Golbat": "Nosferalto",
	"Oddish": "Mystherbe",
	"Gloom": "Ortide",
	"Vileplume": "Rafflesia",
	"Paras": "Paras",
	"Parasect": "Parasect",
	"Venonat": "Mimitoss",
	"Venomoth": "Aéromite",
	"Diglett": "Taupiqueur",
	"Dugtrio": "Triopikeur",
	"Meowth": "Miaouss",
	"Persian": "Persian",
	"Psyduck": "Psykokwak",
	"Golduck": "Akwakwak",
	"Mankey": "Férosinge",
	"Primeape": "Colossinge",
	"Growlithe": "Caninos",
	"Arcanine": "Arcanin",
	"Poliwag": "Ptitard",
	"Poliwhirl": "Têtarte",
	"Poliwrath": "Tartard",
	"Abra": "Abra",
	"Kadabra": "Kadabra",
	"Alakazam": "Alakazam",
	"Machop": "Machoc",
	"Machoke": "Machopeur",
	"Machamp": "Mackogneur",
	"Bellsprout": "Chétiflor",
	"Weepinbell": "Boustiflor",
	"Victreebel": "Empiflor",
	"Tentacool": "Tentacool",
	"Tentacruel": "Tentacruel",
	"Geodude": "Racaillou",
	"Graveler": "Gravalanch",
	"Golem": "Grolem",
	"Ponyta": "Ponyta",
	"Rapidash": "Galopa",
	"Slowpoke": "Ramoloss",
	"Slowbro": "Flagadoss",
	"Magnemite": "Magnéti",
	"Magneton": "Magnéton",
	"Farfetch’d": "Canarticho",
	"Doduo": "Doduo",
	"Dodrio": "Dodrio",
	"Seel": "Otaria",
	"Dewgong": "Lamantine",
	"Grimer": "Tadmorv",
	"Muk": "Grotadmorv",
	"Shellder": "Kokiyas",
	"Cloyster": "Crustabri",
	"Gastly": "Fantominus",
	"Haunter": "Spectrum",
	"Gengar": "Ectoplasma",
	"Onix": "Onix",
	"Drowzee": "Soporifik",
	"Hypno": "Hypnomade",
	"Krabby": "Krabby",
	"Kingler": "Krabboss",
	"Voltorb": "Voltorbe",
	"Electrode": "Électrode",
	"Exeggcute": "Noeunoeuf",
	"Exeggutor": "Noadkoko",
	"Cubone": "Osselait",
	"Marowak": "Ossatueur",
	"Hitmonlee": "Kicklee",
	"Hitmonchan": "Tygnon",
	"Lickitung": "Excelangue",
	"Koffing": "Smogo",
	"Weezing": "Smogogo",
	"Rhyhorn": "Rhinocorne",
	"Rhydon": "Rhinoféros",
	"Chansey": "Leveinard",
	"Tangela": "Saquedeneu",
	"Kangaskhan": "Kangourex",
	"Horsea": "Hypotrempe",
	"Seadra": "Hypocéan",
	"Goldeen": "Poissirène",
	"Seaking": "Poissoroy",
	"Staryu": "Stari",
	"Starmie": "Staross",
	"Mr. Mime": "M. Mime",
	"Scyther": "Insécateur",
	"Jynx": "Lippoutou",
	"Electabuzz": "Élektek",
	"Magmar": "Magmar",
	"Pinsir": "Scarabrute",
	"Tauros": "Tauros",
	"Magikarp": "Magicarpe",
	"Gyarados": "Léviator",
	"Lapras": "Lokhlass",
	"Ditto": "Métamorph",
	"Eevee": "Évoli",
	"Vaporeon": "Aquali",
	"Jolteon": "Voltali",
	"Flareon": "Pyroli",
	"Porygon": "Porygon",
	"Omanyte": "Amonita",
	"Omastar": "Amonistar",
	"Kabuto": "Kabuto",
	"Kabutops": "Kabutops",
	"Aerodactyl": "Ptéra",
	"Snorlax": "Ronflex",
	"Articuno": "Artikodin",
	"Zapdos": "Électhor",
	"Moltres": "Sulfura",
	"Dratini": "Minidraco",
	"Dragonair": "Draco",
	"Dragonite": "Dracolosse",
	"Mewtwo": "Mewtwo",
	"Mew": "Mew",
	"Chikorita": "Germignon",
	"Bayleef": "Macronium",
	"Meganium": "Méganium",
	"Cyndaquil": "Héricendre",
	"Quilava": "Feurisson",
	"Typhlosion": "Typhlosion",
	"Totodile": "Kaiminus",
	"Croconaw": "Crocrodil",
	"Feraligatr": "Aligatueur",
	"Sentret": "Fouinette",
	"Furret": "Fouinar",
	"Hoothoot": "Hoothoot",
	"Noctowl": "Noarfang",
	"Ledyba": "Coxy",
	"Ledian": "Coxyclaque",
	"Spinarak": "Mimigal",
	"Ariados": "Migalos",
	"Crobat": "Nostenfer",
	"Chinchou": "Loupio",
	"Lanturn": "Lanturn",
	"Pichu": "Pichu",
	"Cleffa": "Mélo",
	"Igglybuff": "Toudoudou",
	"Togepi": "Togepi",
	"Togetic": "Togetic",
	"Natu": "Natu",
	"Xatu": "Xatu",
	"Mareep": "Wattouat",
	"Flaaffy": "Lainergie",
	"Ampharos": "Pharamp",
	"Bellossom": "Joliflor",
	"Marill": "Marill",
	"Azumarill": "Azumarill",
	"Sudowoodo": "Simularbre",
	"Politoed": "Tarpaud",
	"Hoppip": "Granivol",
	"Skiploom": "Floravol",
	"Jumpluff": "Cotovol",
	"Aipom": "Capumain",
	"Sunkern": "Tournegrin",
	"Sunflora": "Héliatronc",
	"Yanma": "Yanma",
	"Wooper": "Axoloto",
	"Quagsire": "Maraiste",
	"Espeon": "Mentali",
	"Umbreon": "Noctali",
	"Murkrow": "Cornèbre",
	"Slowking": "Roigada",
	"Misdreavus": "Feuforêve",
	"Unown": "Zarbi",
	"Wobbuffet": "Qulbutoké",
	"Girafarig": "Girafarig",
	"Pineco": "Pomdepik",
	"Forretress": "Foretress",
	"Dunsparce": "Insolourdo",
	"Gligar": "Scorplane",
	"Steelix": "Steelix",
	"Snubbull": "Snubbull",
	"Granbull": "Granbull",
	"Qwilfish": "Qwilfish",
	"Scizor": "Cizayox",
	"Shuckle": "Caratroc",
	"Heracross": "Scarhino",
	"Sneasel": "Farfuret",
	"Teddiursa": "Teddiursa",
	"Ursaring": "Ursaring",
	"Slugma": "Limagma",
	"Magcargo": "Volcaropod",
	"Swinub": "Marcacrin",
	"Piloswine": "Cochignon",
	"Corsola": "Corayon",
	"Remoraid": "Rémoraid",
	"Octillery": "Octillery",
	"Delibird": "Cadoizo",
	"Mantine": "Démanta",
	"Skarmory": "Airmure",
	"Houndour": "Malosse",
	"Houndoom": "Démolosse",
	"Kingdra": "Hyporoi",
	"Phanpy": "Phanpy",
	"Donphan": "Donphan",
	"Porygon2": "Porygon2",
	"Stantler": "Cerfrousse",
	"Smeargle": "Queulorior",
	"Tyrogue": "Debugant",
	"Hitmontop": "Kapoera",
	"Smoochum": "Lippouti",
	"Elekid": "Élekid",
	"Magby": "Magby",
	"Miltank": "Écrémeuh",
	"Blissey": "Leuphorie",
	"Raikou": "Raikou",
	"Entei": "Entei",
	"Suicune": "Suicune",
	"Larvitar": "Embrylex",
	"Pupitar": "Ymphect",
	"Tyranitar": "Tyranocif",
	"Lugia": "Lugia",
	"Ho-Oh": "Ho-Oh",
	"Celebi": "Celebi",
	"Treecko": "Arcko",
	"Grovyle": "Massko",
	"Sceptile": "Jungko",
	"Torchic": "Poussifeu",
	"Combusken": "Galifeu",
	"Blaziken": "Braségali",
	"Mudkip": "Gobou",
	"Marshtomp": "Flobio",
	"Swampert": "Laggron",
	"Poochyena": "Medhyèna",
	"Mightyena": "Grahyèna",
	"Zigzagoon": "Zigzaton",
	"Linoone": "Linéon",
	"Wurmple": "Chenipotte",
	"Silcoon": "Armulys",
	"Beautifly": "Charmillon",
	"Cascoon": "Blindalys",
	"Dustox": "Papinox",
	"Lotad": "Nénupiot",
	"Lombre": "Lombre",
	"Ludicolo": "Ludicolo",
	"Seedot": "Grainipiot",
	"Nuzleaf": "Pifeuil",
	"Shiftry": "Tengalice",
	"Taillow": "Nirondelle",
	"Swellow": "Hélédelle",
	"Wingull": "Goélise",
	"Pelipper": "Bekipan",
	"Ralts": "Tarsal",
	"Kirlia": "Kirlia",
	"Gardevoir": "Gardevoir",
	"Surskit": "Arakdo",
	"Masquerain": "Maskadra",
	"Shroomish": "Balignon",
	"Breloom": "Chapignon",
	"Slakoth": "Parecool",
	"Vigoroth": "Vigoroth",
	"Slaking": "Monaflèmit",
	"Nincada": "Ningale",
	"Ninjask": "Ninjask",
	"Shedinja": "Munja",
	"Whismur": "Chuchmur",
	"Loudred": "Ramboum",
	"Exploud": "Brouhabam",
	"Makuhita": "Makuhita",
	"Hariyama": "Hariyama",
	"Azurill": "Azurill",
	"Nosepass": "Tarinor",
	"Skitty": "Skitty",
	"Delcatty": "Delcatty",
	"Sableye": "Ténéfix",
	"Mawile": "Mysdibule",
	"Aron": "Galekid",
	"Lairon": "Galegon",
	"Aggron": "Galeking",
	"Meditite": "Méditikka",
	"Medicham": "Charmina",
	"Electrike": "Dynavolt",
	"Manectric": "Élecsprint",
	"Plusle": "Posipi",
	"Minun": "Négapi",
	"Volbeat": "Muciole",
	"Illumise": "Lumivole",
	"Roselia": "Rosélia",
	"Gulpin": "Gloupti",
	"Swalot": "Avaltout",
	"Carvanha": "Carvanha",
	"Sharpedo": "Sharpedo",
	"Wailmer": "Wailmer",
	"Wailord": "Wailord",
	"Numel": "Chamallot",
	"Camerupt": "Camérupt",
	"Torkoal": "Chartor",
	"Spoink": "Spoink",
	"Grumpig": "Groret",
	"Spinda": "Spinda",
	"Trapinch": "Kraknoix",
	"Vibrava": "Vibraninf",
	"Flygon": "Libégon",
	"Cacnea": "Cacnea",
	"Cacturne": "Cacturne",
	"Swablu": "Tylton",
	"Altaria": "Altaria",
	"Zangoose": "Mangriff",
	"Seviper": "Séviper",
	"Lunatone": "Séléroc",
	"Solrock": "Solaroc",
	"Barboach": "Barloche",
	"Whiscash": "Barbicha",
	"Corphish": "Écrapince",
	"Crawdaunt": "Colhomard",
	"Baltoy": "Balbuto",
	"Claydol": "Kaorine",
	"Lileep": "Lilia",
	"Cradily": "Vacilys",
	"Anorith": "Anorith",
	"Armaldo": "Armaldo",
	"Feebas": "Barpau",
	"Milotic": "Milobellus",
	"Castform": "Morphéo",
	"Kecleon": "Kecleon",
	"Shuppet": "Polichombr",
	"Banette": "Branette",
	"Duskull": "Skelénox",
	"Dusclops": "Téraclope",
	"Tropius": "Tropius",
	"Chimecho": "Éoko",
	"Absol": "Absol",
	"Wynaut": "Okéoké",
	"Snorunt": "Stalgamin",
	"Glalie": "Oniglali",
	"Spheal": "Obalie",
	"Sealeo": "Phogleur",
	"Walrein": "Kaimorse",
	"Clamperl": "Coquiperl",
	"Huntail": "Serpang",
	"Gorebyss": "Rosabyss",
	"Relicanth": "Relicanth",
	"Luvdisc": "Lovdisc",
	"Bagon": "Draby",
	"Shelgon": "Drackhaus",
	"Salamence": "Drattak",
	"Beldum": "Terhal",
	"Metang": "Métang",
	"Metagross": "Métalosse",
	"Regirock": "Regirock",
	"Regice": "Regice",
	"Registeel": "Registeel",
	"Latias": "Latias",
	"Latios": "Latios",
	"Kyogre": "Kyogre",
	"Groudon": "Groudon",
	"Rayquaza": "Rayquaza",
	"Jirachi": "Jirachi",
	"Deoxys": "Deoxys",
	"Turtwig": "Tortipouss",
	"Grotle": "Boskara",
	"Torterra": "Torterra",
	"Chimchar": "Ouisticram",
	"Monferno": "Chimpenfeu",
	"Infernape": "Simiabraz",
	"Piplup": "Tiplouf",
	"Prinplup": "Prinplouf",
	"Empoleon": "Pingoléon",
	"Starly": "Étourmi",
	"Staravia": "Étourvol",
	"Staraptor": "Étouraptor",
	"Bidoof": "Keunotor",
	"Bibarel": "Castorno",
	"Kricketot": "Crikzik",
	"Kricketune": "Mélokrik",
	"Shinx": "Lixy",
	"Luxio": "Luxio",
	"Luxray": "Luxray",
	"Budew": "Rozbouton",
	"Roserade": "Roserade",
	"Cranidos": "Kranidos",
	"Rampardos": "Charkos",
	"Shieldon": "Dinoclier",
	"Bastiodon": "Bastiodon",
	"Burmy": "Cheniti",
	"Wormadam": "Cheniselle",
	"Mothim": "Papilord",
	"Combee": "Apitrini",
	"Vespiquen": "Apireine",
	"Pachirisu": "Pachirisu",
	"Buizel": "Mustébouée",
	"Floatzel": "Mustéflott",
	"Cherubi": "Ceribou",
	"Cherrim": "Ceriflor",
	"Shellos": "Sancoki",
	"Gastrodon": "Tritosor",
	"Ambipom": "Capidextre",
	"Drifloon": "Baudrive",
	"Drifblim": "Grodrive",
	"Buneary": "Laporeille",
	"Lopunny": "Lockpin",
	"Mismagius": "Magirêve",
	"Honchkrow": "Corboss",
	"Glameow": "Chaglam",
	"Purugly": "Chaffreux",
	"Chingling": "Korillon",
	"Stunky": "Moufouette",
	"Skuntank": "Moufflair",
	"Bronzor": "Archéomire",
	"Bronzong": "Archéodong",
	"Bonsly": "Manzaï",
	"Mime Jr.": "Mime Jr.",
	"Happiny": "Ptiravi",
	"Chatot": "Pijako",
	"Spiritomb": "Spiritomb",
	"Gible": "Griknot",
	"Gabite": "Carmache",
	"Garchomp": "Carchacrok",
	"Munchlax": "Goinfrex",
	"Riolu": "Riolu",
	"Lucario": "Lucario",
	"Hippopotas": "Hippopotas",
	"Hippowdon": "Hippodocus",
	"Skorupi": "Rapion",
	"Drapion": "Drascore",
	"Croagunk": "Cradopaud",
	"Toxicroak": "Coatox",
	"Carnivine": "Vortente",
	"Finneon": "Écayon",
	"Lumineon": "Luminéon",
	"Mantyke": "Babimanta",
	"Snover": "Blizzi",
	"Abomasnow": "Blizzaroi",
	"Weavile": "Dimoret",
	"Magnezone": "Magnézone",
	"Lickilicky": "Coudlangue",
	"Rhyperior": "Rhinastoc",
	"Tangrowth": "Bouldeneu",
	"Electivire": "Élekable",
	"Magmortar": "Maganon",
	"Togekiss": "Togekiss",
	"Yanmega": "Yanméga",
	"Leafeon": "Phyllali",
	"Glaceon": "Givrali",
	"Gliscor": "Scorvol",
	"Mamoswine": "Mammochon",
	"Porygon-Z": "Porygon-Z",
	"Gallade": "Gallame",
	"Probopass": "Tarinorme",
	"Dusknoir": "Noctunoir",
	"Froslass": "Momartik",
	"Rotom": "Motisma",
	"Uxie": "Créhelf",
	"Mesprit": "Créfollet",
	"Azelf": "Créfadet",
	"Dialga": "Dialga",
	"Palkia": "Palkia",
	"Heatran": "Heatran",
	"Regigigas": "Regigigas",
	"Giratina": "Giratina",
	"Cresselia": "Cresselia",
	"Phione": "Phione",
	"Manaphy": "Manaphy",
	"Darkrai": "Darkrai",
	"Shaymin": "Shaymin",
	"Arceus": "Arceus",
	"Victini": "Victini",
	"Snivy": "Vipélierre",
	"Servine": "Lianaja",
	"Serperior": "Majaspic",
	"Tepig": "Gruikui",
	"Pignite": "Grotichon",
	"Emboar": "Roitiflam",
	"Oshawott": "Moustillon",
	"Dewott": "Mateloutre",
	"Samurott": "Clamiral",
	"Patrat": "Ratentif",
	"Watchog": "Miradar",
	"Lillipup": "Ponchiot",
	"Herdier": "Ponchien",
	"Stoutland": "Mastouffe",
	"Purrloin": "Chacripan",
	"Liepard": "Léopardus",
	"Pansage": "Feuillajou",
	"Simisage": "Feuiloutan",
	"Pansear": "Flamajou",
	"Simisear": "Flamoutan",
	"Panpour": "Flotajou",
	"Simipour": "Flotoutan",
	"Munna": "Munna",
	"Musharna": "Mushana",
	"Pidove": "Poichigeon",
	"Tranquill": "Colombeau",
	"Unfezant": "Déflaisan",
	"Blitzle": "Zébribon",
	"Zebstrika": "Zéblitz",
	"Roggenrola": "Nodulithe",
	"Boldore": "Géolithe",
	"Gigalith": "Gigalithe",
	"Woobat": "Chovsourir",
	"Swoobat": "Rhinolove",
	"Drilbur": "Rototaupe",
	"Excadrill": "Minotaupe",
	"Audino": "Nanméouïe",
	"Timburr": "Charpenti",
	"Gurdurr": "Ouvrifier",
	"Conkeldurr": "Bétochef",
	"Tympole": "Tritonde",
	"Palpitoad": "Batracné",
	"Seismitoad": "Crapustule",
	"Throh": "Judokrak",
	"Sawk": "Karaclée",
	"Sewaddle": "Larveyette",
	"Swadloon": "Couverdure",
	"Leavanny": "Manternel",
	"Venipede": "Venipatte",
	"Whirlipede": "Scobolide",
	"Scolipede": "Brutapode",
	"Cottonee": "Doudouvet",
	"Whimsicott": "Farfaduvet",
	"Petilil": "Chlorobule",
	"Lilligant": "Fragilady",
	"Basculin": "Bargantua",
	"Sandile": "Mascaïman",
	"Krokorok": "Escroco",
	"Krookodile": "Crocorible",
	"Darumaka": "Darumarond",
	"Darmanitan": "Darumacho",
	"Maractus": "Maracachi",
	"Dwebble": "Crabicoque",
	"Crustle": "Crabaraque",
	"Scraggy": "Baggiguane",
	"Scrafty": "Baggaïd",
	"Sigilyph": "Cryptéro",
	"Yamask": "Tutafeh",
	"Cofagrigus": "Tutankafer",
	"Tirtouga": "Carapagos",
	"Carracosta": "Mégapagos",
	"Archen": "Arkéapti",
	"Archeops": "Aéroptéryx",
	"Trubbish": "Miamiasme",
	"Garbodor": "Miasmax",
	"Zorua": "Zorua",
	"Zoroark": "Zoroark",
	"Minccino": "Chinchidou",
	"Cinccino": "Pashmilla",
	"Gothita": "Scrutella",
	"Gothorita": "Mesmérella",
	"Gothitelle": "Sidérella",
	"Solosis": "Nucléos",
	"Duosion": "Méios",
	"Reuniclus": "Symbios",
	"Ducklett": "Couaneton",
	"Swanna": "Lakmécygne",
	"Vanillite": "Sorbébé",
	"Vanillish": "Sorboul",
	"Vanilluxe": "Sorbouboul",
	"Deerling": "Vivaldaim",
	"Sawsbuck": "Haydaim",
	"Emolga": "Emolga",
	"Karrablast": "Carabing",
	"Escavalier": "Lançargot",
	"Foongus": "Trompignon",
	"Amoonguss": "Gaulet",
	"Frillish": "Viskuse",
	"Jellicent": "Moyade",
	"Alomomola": "Mamanbo",
	"Joltik": "Statitik",
	"Galvantula": "Mygavolt",
	"Ferroseed": "Grindur",
	"Ferrothorn": "Noacier",
	"Klink": "Tic",
	"Klang": "Clic",
	"Klinklang": "Cliticlic",
	"Tynamo": "Anchwatt",
	"Eelektrik": "Lampéroie",
	"Eelektross": "Ohmassacre",
	"Elgyem": "Lewsor",
	"Beheeyem": "Neitram",
	"Litwick": "Funécire",
	"Lampent": "Mélancolux",
	"Chandelure": "Lugulabre",
	"Axew": "Coupenotte",
	"Fraxure": "Incisache",
	"Haxorus": "Tranchodon",
	"Cubchoo": "Polarhume",
	"Beartic": "Polagriffe",
	"Cryogonal": "Hexagel",
	"Shelmet": "Escargaume",
	"Accelgor": "Limaspeed",
	"Stunfisk": "Limonde",
	"Mienfoo": "Kungfouine",
	"Mienshao": "Shaofouine",
	"Druddigon": "Drakkarmin",
	"Golett": "Gringolem",
	"Golurk": "Golemastoc",
	"Pawniard": "Scalpion",
	"Bisharp": "Scalproie",
	"Bouffalant": "Frison",
	"Rufflet": "Furaiglon",
	"Braviary": "Gueriaigle",
	"Vullaby": "Vostourno",
	"Mandibuzz": "Vaututrice",
	"Heatmor": "Aflamanoir",
	"Durant": "Fermite",
	"Deino": "Solochi",
	"Zweilous": "Diamat",
	"Hydreigon": "Trioxhydre",
	"Larvesta": "Pyronille",
	"Volcarona": "Pyrax",
	"Cobalion": "Cobaltium",
	"Terrakion": "Terrakium",
	"Virizion": "Viridium",
	"Tornadus": "Boréas",
	"Thundurus": "Fulguris",
	"Reshiram": "Reshiram",
	"Zekrom": "Zekrom",
	"Landorus": "Démétéros",
	"Kyurem": "Kyurem",
	"Keldeo": "Keldeo",
	"Meloetta": "Meloetta",
	"Genesect": "Genesect",
	"Chespin": "Marisson",
	"Quilladin": "Boguérisse",
	"Chesnaught": "Blindépique",
	"Fennekin": "Feunnec",
	"Braixen": "Roussil",
	"Delphox": "Goupelin",
	"Froakie": "Grenousse",
	"Frogadier": "Croâporal",
	"Greninja": "Amphinobi",
	"Bunnelby": "Sapereau",
	"Diggersby": "Excavarenne",
	"Fletchling": "Passerouge",
	"Fletchinder": "Braisillon",
	"Talonflame": "Flambusard",
	"Scatterbug": "Lépidonille",
	"Spewpa": "Pérégrain",
	"Vivillon": "Prismillon",
	"Litleo": "Hélionceau",
	"Pyroar": "Némélios",
	"Flabébé": "Flabébé",
	"Floette": "Floette",
	"Florges": "Florges",
	"Skiddo": "Cabriolaine",
	"Gogoat": "Chevroum",
	"Pancham": "Pandespiègle",
	"Pangoro": "Pandarbare",
	"Furfrou": "Couafarel",
	"Espurr": "Psystigri",
	"Meowstic": "Mistigrix",
	"Honedge": "Monorpale",
	"Doublade": "Dimoclès",
	"Aegislash": "Exagide",
	"Spritzee": "Fluvetin",
	"Aromatisse": "Cocotine",
	"Swirlix": "Sucroquin",
	"Slurpuff": "Cupcanaille",
	"Inkay": "Sepiatop",
	"Malamar": "Sepiatroce",
	"Binacle": "Opermine",
	"Barbaracle": "Golgopathe",
	"Skrelp": "Venalgue",
	"Dragalge": "Kravarech",
	"Clauncher": "Flingouste",
	"Clawitzer": "Gamblast",
	"Helioptile": "Galvaran",
	"Heliolisk": "Iguolta",
	"Tyrunt": "Ptyranidur",
	"Tyrantrum": "Rexillius",
	"Amaura": "Amagara",
	"Aurorus": "Dragmara",
	"Sylveon": "Nymphali",
	"Hawlucha": "Brutalibré",
	"Dedenne": "Dedenne",
	"Carbink": "Strassie",
	"Goomy": "Mucuscule",
	"Sliggoo": "Colimucus",
	"Goodra": "Muplodocus",
	"Klefki": "Trousselin",
	"Phantump": "Brocélôme",
	"Trevenant": "Desséliande",
	"Pumpkaboo": "Pitrouille",
	"Gourgeist": "Banshitrouye",
	"Bergmite": "Grelaçon",
	"Avalugg": "Séracrawl",
	"Noibat": "Sonistrelle",
	"Noivern": "Bruyverne",
	"Xerneas": "Xerneas",
	"Yveltal": "Yveltal",
	"Zygarde": "Zygarde",
	"Diancie": "Diancie",
	"Hoopa": "Hoopa",
	"Volcanion": "Volcanion",
	"Rowlet": "Brindibou",
	"Dartrix": "Efflèche",
	"Decidueye": "Archéduc",
	"Litten": "Flamiaou",
	"Torracat": "Matoufeu",
	"Incineroar": "Félinferno",
	"Popplio": "Otaquin",
	"Brionne": "Otarlette",
	"Primarina": "Oratoria",
	"Pikipek": "Picassaut",
	"Trumbeak": "Piclairon",
	"Toucannon": "Bazoucan",
	"Yungoos": "Manglouton",
	"Gumshoos": "Argouste",
	"Grubbin": "Larvibule",
	"Charjabug": "Chrysapile",
	"Vikavolt": "Lucanon",
	"Crabrawler": "Crabagarre",
	"Crabominable": "Crabominable",
	"Oricorio": "Plumeline",
	"Cutiefly": "Bombydou",
	"Ribombee": "Rubombelle",
	"Rockruff": "Rocabot",
	"Lycanroc": "Lougaroc",
	"Wishiwashi": "Froussardine",
	"Mareanie": "Vorastérie",
	"Toxapex": "Prédastérie",
	"Mudbray": "Tiboudet",
	"Mudsdale": "Bourrinos",
	"Dewpider": "Araqua",
	"Araquanid": "Tarenbulle",
	"Fomantis": "Mimantis",
	"Lurantis": "Floramantis",
	"Morelull": "Spododo",
	"Shiinotic": "Lampignon",
	"Salandit": "Tritox",
	"Salazzle": "Malamandre",
	"Stufful": "Nounourson",
	"Bewear": "Chelours",
	"Bounsweet": "Croquine",
	"Steenee": "Candine",
	"Tsareena": "Sucreine",
	"Comfey": "Guérilande",
	"Oranguru": "Gouroutan",
	"Passimian": "Quartermac",
	"Wimpod": "Sovkipou",
	"Golisopod": "Sarmuraï",
	"Sandygast": "Bacabouh",
	"Palossand": "Trépassable",
	"Pyukumuku": "Concombaffe",
	"Type: Null": "Type:0",
	"Silvally": "Silvallié",
	"Minior": "Météno",
	"Komala": "Dodoala",
	"Turtonator": "Boumata",
	"Togedemaru": "Togedemaru",
	"Mimikyu": "Mimiqui",
	"Bruxish": "Denticrisse",
	"Drampa": "Draïeul",
	"Dhelmise": "Sinistrail",
	"Jangmo-o": "Bébécaille",
	"Hakamo-o": "Écaïd",
	"Kommo-o": "Ékaïser",
	"Tapu Koko": "Tokorico",
	"Tapu Lele": "Tokopiyon",
	"Tapu Bulu": "Tokotoro",
	"Tapu Fini": "Tokopisco",
	"Cosmog": "Cosmog",
	"Cosmoem": "Cosmovum",
	"Solgaleo": "Solgaleo",
	"Lunala": "Lunala",
	"Nihilego": "Zéroïd",
	"Buzzwole": "Mouscoto",
	"Pheromosa": "Cancrelove",
	"Xurkitree": "Câblifère",
	"Celesteela": "Bamboiselle",
	"Kartana": "Katagami",
	"Guzzlord": "Engloutyran",
	"Necrozma": "Necrozma",
	"Magearna": "Magearna",
	"Marshadow": "Marshadow",
	"Poipole": "Vémini",
	"Naganadel": "Mandrillon",
	"Stakataka": "Ama-Ama",
	"Blacephalon": "Pierroteknik",
	"Zeraora": "Zeraora",
	"Meltan": "Meltan",
	"Melmetal": "Melmetal",
	"Grookey": "Ouistempo",
	"Thwackey": "Badabouin",
	"Rillaboom": "Gorythmic",
	"Scorbunny": "Flambino",
	"Raboot": "Lapyro",
	"Cinderace": "Pyrobut",
	"Sobble": "Larméléon",
	"Drizzile": "Arrozard",
	"Inteleon": "Lézargus",
	"Skwovet": "Rongourmand",
	"Greedent": "Rongrigou",
	"Rookidee": "Minisange",
	"Corvisquire": "Bleuseille",
	"Corviknight": "Corvaillus",
	"Blipbug": "Larvadar",
	"Dottler": "Coléodôme",
	"Orbeetle": "Astronelle",
	"Nickit": "Goupilou",
	"Thievul": "Roublenard",
	"Gossifleur": "Tournicoton",
	"Eldegoss": "Blancoton",
	"Wooloo": "Moumouton",
	"Dubwool": "Moumouflon",
	"Chewtle": "Khélocrok",
	"Drednaw": "Torgamord",
	"Yamper": "Voltoutou",
	"Boltund": "Fulgudog",
	"Rolycoly": "Charbi",
	"Carkol": "Wagomine",
	"Coalossal": "Monthracite",
	"Applin": "Verpom",
	"Flapple": "Pomdrapi",
	"Appletun": "Dratatin",
	"Silicobra": "Dunaja",
	"Sandaconda": "Dunaconda",
	"Cramorant": "Nigosier",
	"Arrokuda": "Embrochet",
	"Barraskewda": "Hastacuda",
	"Toxel": "Toxizap",
	"Toxtricity": "Salarsen",
	"Sizzlipede": "Grillepattes",
	"Centiskorch": "Scolocendre",
	"Clobbopus": "Poulpaf",
	"Grapploct": "Krakos",
	"Sinistea": "Théffroi",
	"Polteageist": "Polthégeist",
	"Hatenna": "Bibichut",
	"Hattrem": "Chapotus",
	"Hatterene": "Sorcilence",
	"Impidimp": "Grimalin",
	"Morgrem": "Fourbelin",
	"Grimmsnarl": "Angoliath",
	"Obstagoon": "Ixon",
	"Perrserker": "Berserkatt",
	"Cursola": "Corayôme",
	"Sirfetch’d": "Palarticho",
	"Mr. Rime": "M. Glaquette",
	"Runerigus": "Tutétékri",
	"Milcery": "Crèmy",
	"Alcremie": "Charmilly",
	"Falinks": "Hexadron",
	"Pincurchin": "Wattapik",
	"Snom": "Frissonille",
	"Frosmoth": "Beldeneige",
	"Stonjourner": "Dolman",
	"Eiscue": "Bekaglaçon",
	"Indeedee": "Wimessir",
	"Morpeko": "Morpeko",
	"Cufant": "Charibari",
	"Copperajah": "Pachyradjah",
	"Dracozolt": "Galvagon",
	"Arctozolt": "Galvagla",
	"Dracovish": "Hydragon",
	"Arctovish": "Hydragla",
	"Duraludon": "Duralugon",
	"Dreepy": "Fantyrm",
	"Drakloak": "Dispareptil",
	"Dragapult": "Lanssorien",
	"Zacian": "Zacian",
	"Zamazenta": "Zamazenta",
	"Eternatus": "Éthernatos",
	"Kubfu": "Wushours",
	"Urshifu": "Shifours",
	"Zarude": "Zarude",
	"Regieleki": "Regieleki",
	"Regidrago": "Regidrago",
	"Glastrier": "Blizzeval",
	"Spectrier": "Spectreval",
	"Calyrex": "Sylveroy",
	"Wyrdeer": "Cerbyllin",
	"Kleavor": "Hachécateur",
	"Ursaluna": "Ursaking",
	"Basculegion": "Paragruel",
	"Sneasler": "Farfurex",
	"Overqwil": "Qwilpik",
	"Enamorus": "Amovénus"
};

const AlternateFormsDico: { [englishName: string]: string; } = {
	"Hoenn": "Hoenn",
	"Sinnoh": "Sinnoh",
	"Unova": "Unys",
	"Kalos": "Kalos",
	"Alola": "Alola",
	"Galar": "Galar",
	"Gmax": "Gmax",
	"Mega": "Méga",
	"Mega-X": "Méga-X",
	"Mega-Y": "Méga-Y",
	"Primal": "Primo",
	"Ultra": "Ultra",
	"Belle": "Lady",
	"Cosplay": "Cosplayeur",
	"Libre": "Catcheur",
	"Original": "Original",
	"Partner": "Partenaire",
	"PhD": "Docteur",
	"Pop-Star": "Star",
	"Rock-Star": "Rockeur",
	"Starter": "Starter",
	"World": "Monde",
	"Attack": "Attaque",
	"Defense": "Défense",
	"Speed": "Vitesse",
	"Sandy": "Sable",
	"Trash": "Déchet",
	"Fan": "Hélice",
	"Frost": "Froid",
	"Heat": "Chaleur",
	"Mow": "Tonte",
	"Wash": "Lavage",
	"Origin": "Origine",
	"Sky": "Céleste",
	"Bug": "Insecte",
	"Dark": "Ténèbres",
	"Dragon": "Dragon",
	"Electric": "Électrik",
	"Fairy": "Fée",
	"Fighting": "Combat",
	"Fire": "Feu",
	"Flying": "Vol",
	"Ghost": "Spectre",
	"Grass": "Plante",
	"Ground": "Sol",
	"Ice": "Arceus:Glace|Silvally:Glace|Calyrex:Froid",
	"Poison": "Poison",
	"Psychic": "Psy",
	"Rock": "Roche",
	"Steel": "Acier",
	"Water": "Eau",
	"Blue-Striped": "Bleu",
	"White-Striped": "White",
	"Therian": "Totem",
	"Black": "Noir",
	"White": "Blanc",
	"Resolute": "Décidé",
	"Burn": "Pyro",
	"Chill": "Cryo",
	"Douse": "Aqua",
	"Shock": "Choc",
	"Ash": "Sacha",
	"Fancy": "Fantaisie",
	"Pokeball": "Pokéball",
	"F": "F",
	"Large": "Maxi",
	"Small": "Mini",
	"Super": "Ultra",
	"10%": "10%",
	"Complete": "Parfait",
	"Unbound": "Déchaîné",
	"Pa'u": "Hula",
	"Pom-Pom": "Pom-Pom",
	"Sensu": "Buyō",
	"Dusk": "Crépuscule",
	"Midnight": "Nocturne",
	"Dawn-Wings": "Aurore",
	"Dusk-Mane": "Couchant",
	"Low-Key": "Grave",
	"Antique": "Antique",
	"Crowned": "Zacian:Épée|Zamazenta:Bouclier",
	"Rapid-Strike": "Mille-Poings",
	"Dada": "Papa",
	"Shadow": "Effroi"
}

const HyphenPokemonName = ["Nidoran-F", "Nidoran-M", "Ho-Oh", "Porygon-Z", "Jangmo-o", "Hakamo-o", "Kommo-o"];

function onMutation(mutations: MutationRecord[]) {
	for (var i = 0, len = mutations.length; i < len; i++)
	{
		var added = mutations[i].addedNodes;
		var array = Array.from(added);

		for (var j = 0, node; (node = array[j]); j++)
		{
			var newElement = node as Element;
			// console.log(newElement);

			switch(newElement.className)
			{
				case 'utilichart':
					for (var k = 0, child; (child = node.childNodes[k]) ; k++) {
						updateResult(child as Element);
					}

					break;
				
				case 'result':
					updateResult(node as Element);
			}
		}
	}
}

function updateResult(element: Element)
{
	var pokemonElement = element.querySelector('.pokemonnamecol');
	
	if (pokemonElement != null)
	{
		var alternameFormName = "";
		var pokemonShowdownName = pokemonElement.textContent;

		if (pokemonShowdownName == null)
			pokemonShowdownName = "";

		// Translate Pokémon name and its alternate form if present
		if (pokemonShowdownName.includes("-") // Translate Pokemon alternate forms defined by "-something"
			&& !HyphenPokemonName.includes(pokemonShowdownName)) // Don't count Pokemon with "-" in their names as alternate forms
		{
			// Only split with the first occurence of "-" in case the altername form name contains a "-"
			var wholePokemonName = pokemonShowdownName.split(/-(.*)/s); 

			// Translate Pokémon name and alternate form
			var pokemonFrenchName = PokemonDico[wholePokemonName[0]];
			alternameFormName = getAlternateFormName(wholePokemonName);
		}
		else
		{
			// Translate Pokémon name
			pokemonFrenchName = PokemonDico[pokemonShowdownName];
		}

		if (pokemonFrenchName == null)
		{
			console.log("Unable to translate " + pokemonShowdownName);
			return;
		}

		
		// Remove current Pokémon name
		pokemonElement.textContent = '';

		// Retrieve the searched content
		var inputElement = document.getElementsByName("pokemon")[0] as HTMLInputElement;
		var searchInput = inputElement.value;
		var searchIndex = -1;
		var searchString = "";

		if (searchInput.length > 0)
		{
			searchString = removeDiacritics(searchInput.toLowerCase());
			searchIndex = removeDiacritics(pokemonFrenchName.toLowerCase()).indexOf(searchString);
		}

		// Make the searched content bold in the Pokémon name.
		if (searchIndex >= 0)
		{
			var boldName = pokemonFrenchName.slice(searchIndex, searchIndex + searchString.length);
			var regularName = pokemonFrenchName.slice(searchIndex + searchString.length, pokemonFrenchName.length);

			var boldElement = document.createElement("b");
			boldElement.appendChild(document.createTextNode(boldName))

			if (searchIndex > 0)
			{
				pokemonElement.appendChild(document.createTextNode(pokemonFrenchName.slice(0,searchIndex)));
			}
			
			pokemonElement.appendChild(boldElement);
			pokemonElement.appendChild(document.createTextNode(regularName));
		}
		else
		{
			// No searched content, add the raw name
			pokemonElement.appendChild(document.createTextNode(pokemonFrenchName));
		}

		// If an altername form is present, add it in a small tag
		if (alternameFormName != "")
		{
			var alternateForm = document.createElement("small");
			alternateForm.appendChild(document.createTextNode(alternameFormName)); // Put the alternate form name in small tag
			pokemonElement.appendChild(alternateForm);	
		}
	}
}

function getAlternateFormName(pokemonShowdownName: string[])
{
	var alternameFormName = AlternateFormsDico[pokemonShowdownName[1]];

	if (alternameFormName == null)
	{
		console.log("Unable to translate form " + pokemonShowdownName[1] + " of " + pokemonShowdownName[0]);
		return "-TOTRANSLATE";
	}
	else if (alternameFormName.includes("|")) // If multiple Pokémons match the alternate form name
	{
		for (var i = 0, name; (name = alternameFormName.split("|")[i]); i++)
		{
			var attribute = name.split(":");

			if (attribute[0] == pokemonShowdownName[0]) { // Use the correct alterate form name for the Pokémon
				return "-" + attribute[1];
			}
		}
	}
	
	return "-" + alternameFormName;
}