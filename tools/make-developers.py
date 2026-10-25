#!/usr/bin/env python3
"""Dev-time: writes data/developers.json (original copy; no prices, unit mixes or availability).

Project names and communities were checked against each developer's public website where it was reachable;
re-verify before publishing, because launch lists change often."""
import json
from pathlib import Path

W, B, M, U, V, G, I = ("Waterfront", "Branded residences", "Master communities", "Urban towers", "Villas & townhouses", "Golf & parks", "Islands")

def P(name, community, collection, blurb, tags, url=None):
    return dict(name=name, community=community, collection=collection, blurb=blurb, tags=tags, url=url)

D = []
def dev(slug, name, hue, site, tagline, about, known, projects):
    D.append(dict(slug=slug, name=name, hue=hue, site=site, tagline=tagline, about=about, knownFor=known, projects=projects))

dev("emaar", "Emaar", "215 70% 38%", "https://www.emaar.com", "The master-planner behind Downtown Dubai.",
    "Emaar builds whole districts rather than single towers, so its launches arrive with parks, retail, schools and transport already designed in. Its current pipeline stretches from Dubai Creek Harbour and Dubai Hills Estate to Emaar South beside Al Maktoum airport.",
    "Master-planned districts",
    [P("Greencrest", "Dubai Hills Estate", M, "A residential cluster in Dubai Hills Estate that pairs clean architecture with landscaped courtyards and parkland, aimed at households that want a calm daily rhythm close to the city.", ["Park-facing planning", "Established community", "Family routines"], "https://www.emaar.com/en/properties/greencrest-at-dubai-hills-estate"),
     P("Grove Ridge", "Emaar South", V, "Low-rise family living inside Emaar South, built around shared greens and walkable streets for neighbours to meet rather than pass.", ["Family-first layout", "Shared green streets", "Near Al Maktoum airport"], "https://www.emaar.com/en/properties/grove-ridge-at-emaar-south"),
     P("Golf Vale", "Emaar South", G, "A golf-course address in Emaar South where homes are arranged to borrow the fairway landscape, with sports and leisure close by.", ["Golf outlook", "Landscaped setting", "Resort-style leisure"], "https://www.emaar.com/en/properties/golf-vale-at-emaar-south"),
     P("Creek Haven", "Dubai Creek Harbour", W, "A waterfront launch on the creek in Dubai Creek Harbour, the district Emaar is shaping as a second city centre beside the Ras Al Khor sanctuary.", ["Creek and skyline views", "Waterfront promenade", "New city centre"], None),
     P("Terra Woods", "Expo Living", M, "Part of Emaar's residential offer around Expo City Dubai, a post-Expo district designed for walking, cycling and shared public space.", ["Expo City setting", "Car-light planning", "Public realm focus"], None),
     P("Avarra by Palace", "Business Bay", B, "A branded residential tower in Business Bay carrying the Palace hospitality name, for buyers who want hotel-grade service in a central location.", ["Hospitality brand", "Central address", "Canal-side district"], "https://www.emaar.com/en/properties/avarra-by-palace-at-business-bay"),
     P("Rashid Yachts & Marina", "Rashid Yachts & Marina", W, "A marina district with a working yacht harbour, where residences sit beside the waterline and the leisure economy of the port.", ["Yacht harbour", "Marina promenade", "Waterfront retail"], None)])

dev("damac", "DAMAC", "16 72% 46%", "https://www.damacproperties.com", "Branded living, from towers to lagoon villages.",
    "DAMAC is known for pairing its homes with fashion, automotive and sporting names, and for large resort-style communities. The portfolio ranges from Business Bay towers to the lagoon-centred districts of DAMAC Lagoons.",
    "Branded and resort-style living",
    [P("Chelsea Residences", "Dubai Maritime City", B, "A waterfront development created in collaboration with Chelsea Football Club, combining sea and skyline views with sport and wellness amenities.", ["Football-club partnership", "Sea and skyline views", "Wellness amenities"], None),
     P("DAMAC Casa", "Al Sufouh", U, "A residential tower in Al Sufouh, between Dubai Marina and Palm Jumeirah, for buyers who want the coast and the Marina's dining close at hand.", ["Coastal location", "Near Marina and Palm", "High-floor views"], None),
     P("Reva Residences", "Business Bay", U, "A Business Bay tower close to the canal and Downtown, suited to professionals who want the central business district on the doorstep.", ["Canal district", "Downtown proximity", "Urban amenities"], None),
     P("DAMAC Prive", "Business Bay", U, "A premium Business Bay launch from DAMAC's higher-end collection, with a design language aimed at more discerning city buyers.", ["Premium positioning", "Central location", "Skyline outlook"], None),
     P("DAMAC Lagoons", "DAMAC Lagoons", W, "A master community of Mediterranean-style neighbourhoods arranged around large lagoons, with townhouses and villas themed on European coastal towns.", ["Lagoon centrepieces", "Themed neighbourhoods", "Family community"], None),
     P("DAMAC Islands", "Dubailand", I, "A tropical island-themed community in Dubailand, with villas and townhouses grouped around water features and landscaped islets.", ["Island-style planning", "Water features", "Villas and townhouses"], None),
     P("Park Greens", "DAMAC Hills 2", V, "Suburban villas within DAMAC Hills 2, a community that has grown around parks, a golf course and everyday family amenities.", ["Suburban setting", "Parks and trails", "Family villas"], None)])

dev("sobha", "Sobha Realty", "180 62% 30%", "https://sobharealty.com", "Backward integration, built to be seen up close.",
    "Sobha controls much of its own construction chain, from design to finishing, and markets that as the reason its buildings look tightly detailed up close. Its flagship is Sobha Hartland, with the eight-million-square-foot Hartland II rising beside it in Mohammed Bin Rashid City.",
    "In-house construction and detail",
    [P("Sobha SeaHaven", "Dubai Harbour", W, "A seafront high-rise at Dubai Harbour, set to look out across the Gulf with marina and yacht-club neighbours.", ["Seafront tower", "Harbour district", "Gulf views"], None),
     P("Sobha Skyscape", "Sobha Hartland II", M, "A tower within Sobha Hartland II, designed around open green space and canal edges in a district planned for walking.", ["Green-space planning", "Canal edges", "New district"], None),
     P("Sobha Skyvue", "Sobha Hartland II", M, "A residential tower in the Hartland II masterplan, which devotes more than a third of its land to open and green areas.", ["Open-space masterplan", "Skyline outlook", "School and park access"], None),
     P("360 Riverside Crescent", "Sobha Hartland II", W, "Residences arranged on a crescent beside the Hartland II waterway, built around river-side landscaping and promenades.", ["Waterway frontage", "Crescent layout", "Landscaped promenade"], None),
     P("Waves Opulence", "Sobha Hartland", W, "A waterfront project inside the original Sobha Hartland, where towers face a lagoon and the Burj Khalifa skyline.", ["Lagoon frontage", "Established community", "Skyline view"], None),
     P("Sobha One", "Ras Al Khor", U, "A multi-tower complex beside the Ras Al Khor wildlife sanctuary, with the creek on one side and the city on the other.", ["Wildlife sanctuary outlook", "Creek-side", "Multi-tower plaza"], None),
     P("Sobha Sanctuary", "Dubailand", V, "A villa community in Dubailand, planned around green belts and low-density streets for family living away from the towers.", ["Low density", "Green belts", "Villa community"], None)])

dev("azizi", "Azizi Developments", "276 40% 42%", "https://www.azizidevelopments.com", "High volume, with a new district every year.",
    "Azizi has built a reputation on pace, with many projects launched across Dubai and a first step into Sharjah. Its portfolio runs from beachfront Riviera in Meydan to Palm Jumeirah and Dubai Islands.",
    "Volume and breadth of locations",
    [P("Azizi Venice", "Dubai South", W, "A lagoon-led community in Dubai South, designed with waterways, boulevards and a central water body as its organising idea.", ["Lagoon centrepiece", "Dubai South growth area", "Mixed housing types"], "https://www.azizidevelopments.com/dubai/dubai-south/azizi-venice"),
     P("Riviera", "Meydan", W, "A beachfront community with a crystal lagoon at the heart of Meydan, close to Downtown Dubai and everyday amenities.", ["Crystal lagoon", "Close to Downtown", "Promenade living"], "https://www.azizidevelopments.com/dubai/meydan/riviera"),
     P("Mina", "Palm Jumeirah", W, "A waterfront project on Palm Jumeirah that gives buyers the island address with marina frontage and sea views.", ["Palm address", "Marina frontage", "Sea outlook"], "https://www.azizidevelopments.com/dubai/palm-jumeirah/mina"),
     P("Azizi Wasel", "Dubai Islands", I, "A residential development on Dubai Islands, the new man-made archipelago off the Deira coast with beaches and marinas.", ["Island coastline", "New archipelago", "Beach access"], "https://www.azizidevelopments.com/projects"),
     P("Azizi Milan", "Dubai Land", M, "A multi-building residential community in Dubai Land, positioned near Global Village and the city's growing south-eastern corridor.", ["Dubai Land location", "Near Global Village", "Family community"], "https://www.azizidevelopments.com/dubai/dubai-land/azizi-milan"),
     P("Azizi Raffi", "Al Furjan", U, "A mid-rise building in Al Furjan, a well-connected suburb with Metro access and an established retail and school ecosystem.", ["Metro-linked suburb", "Established amenities", "Mid-rise scale"], "https://www.azizidevelopments.com/dubai/al-furjan/azizi-raffi"),
     P("Azizi Florence", "Sharjah", U, "Azizi's newest release and its entry into Sharjah, bringing the developer's apartment format to the neighbouring emirate.", ["Sharjah debut", "New release", "Commuter-friendly"], "https://www.azizidevelopments.com/projects")])

dev("imtiaz", "Imtiaz Developments", "150 48% 31%", "https://imtiaz.ae", "Design-led towers with a point of view.",
    "Imtiaz has built a long list of mid-rise residences, now moving into more concept-driven projects, from a wellness-focused tower to a Zaha Hadid Architects-designed building. It works in Dubai Islands, Dubailand, Meydan Horizon and Jumeirah Village Circle.",
    "Concept-led residences",
    [P("KORE by Imtiaz", "Dubai Land Residence Complex", U, "A residence conceived around human performance and longevity, drawing its name from the body's core and built around movement and recovery.", ["Wellness concept", "Performance-led amenities", "Dubai Land setting"], "https://imtiaz.ae/property/kore-by-imtiaz"),
     P("The Archive by Imtiaz", "Dubai Land Residence Complex", U, "A building organised around reading and quiet, where the common spaces are designed for slow hours rather than loud ones.", ["Reading-centred design", "Quiet common areas", "Dubai Land setting"], "https://imtiaz.ae/property/the-archive-by-imtiaz"),
     P("Raw District II", "Downtown Jebel Ali", U, "The second phase of an urban district off Sheikh Zayed Road, built to be used rather than admired, with spaces that overlap and connect.", ["Urban district format", "Sheikh Zayed Road corridor", "Mixed-use feel"], "https://imtiaz.ae/property/raw-district-ii-by-imtiaz"),
     P("Sea Cliff by Imtiaz", "Dubai Islands", I, "An island address on Dubai Islands, laid out between shaded pathways and open-water views.", ["Open-water outlook", "Shaded island paths", "Island lifestyle"], "https://imtiaz.ae/property/sea-cliff"),
     P("Enre Residence", "Dubai South", M, "A residence in Dubai South planned to let daily life flow with the outdoors, close to the future airport district.", ["Outdoor-led planning", "Dubai South growth area", "Calm setting"], "https://imtiaz.ae/property/enre-residence-by-imtiaz"),
     P("The Symphony by Imtiaz", "Meydan Horizon", U, "A building designed by Zaha Hadid Architects in the Meydan Horizon masterplan, treated as a dialogue between form and feeling.", ["Zaha Hadid Architects design", "Meydan Horizon", "Architectural landmark"], "https://imtiaz.ae/property/the-symphony-by-imtiaz"),
     P("Wynwood Horizon", "Meydan Horizon", U, "A distinguished address in the heart of the Meydan Horizon masterplan, positioned for business, culture and leisure access.", ["Masterplan centre", "Business and culture links", "Meydan location"], "https://imtiaz.ae/property/wynwood-horizon-by-imtiaz")])

dev("danube", "Danube Properties", "38 86% 40%", "https://danubeproperties.com", "Themed towers with an amenity-first pitch.",
    "Danube gives each building a theme, from sport to jewels to bays, and fills it with a long list of shared amenities. It is also known for a monthly instalment structure that many buyers from India and the wider region follow closely.",
    "Themed, amenity-rich towers",
    [P("Oceanz", "Dubai Maritime City", W, "A waterfront tower group in Dubai Maritime City, themed around the sea and aimed at buyers who want the coast without the Marina price of entry.", ["Sea-themed design", "Maritime City coast", "Amenity-rich"], "https://danubeproperties.com/portfolio/oceanz/"),
     P("Sportz", "Dubai Sports City", U, "A 39-floor tower built around active living, with an Olympic-sized lap pool, climbing wall, sky jogging track and coaching as amenities.", ["Olympic-sized lap pool", "Sky jogging track", "Sports City location"], "https://danubeproperties.com/portfolio/sportz/"),
     P("Elitz", "Jumeirah Village Circle", U, "Twin towers in Jumeirah Village Circle with a tower-wide amenity floor, in a suburb known for parks and everyday convenience.", ["Twin towers", "JVC community", "Amenity floor"], "https://danubeproperties.com/construction/elitz/"),
     P("Diamondz", "Jumeirah Lake Towers", U, "A tower in Jumeirah Lake Towers, built for professionals who want the lakes, Metro and the Marina within quick reach.", ["Lakeside district", "Metro access", "Near Marina"], "https://danubeproperties.com/portfolio/"),
     P("Bayz101", "Business Bay", U, "A Business Bay tower with canal-side access, part of Danube's run of Bay-themed buildings aimed at central-Dubai tenants.", ["Business Bay location", "Canal district", "Rental-friendly area"], "https://danubeproperties.com/portfolio/bayz/"),
     P("Jewelz", "Arjan", U, "A jewel-themed building in Arjan, a quieter pocket between Al Barsha and Dubai Hills with a growing retail base.", ["Jewel theme", "Arjan neighbourhood", "Quiet pocket"], "https://danubeproperties.com/portfolio/jewelz/"),
     P("Eleganz", "Jumeirah Village Circle", U, "Danube's first ready-to-move-in launch, delivering apartments and townhouses in Jumeirah Village Circle.", ["Ready-to-move-in", "Townhouses and apartments", "JVC community"], "https://danubeproperties.com/danube-properties-launches-two-projects-sportz-and-eleganz-amidst-high-demand/")])

dev("binghatti", "Binghatti", "16 72% 46%", "https://www.binghatti.com", "Architecture first, with partners from the car world.",
    "Binghatti is recognised by its sculptural, geometric facades and by collaborations with Jacob & Co, Mercedes-Benz and Bugatti. Its towers cluster in Business Bay, Downtown Dubai, Al Jaddaf and Jumeirah Village Circle.",
    "Sculptural facades and brand partnerships",
    [P("Burj Binghatti Jacob & Co Residences", "Business Bay", B, "A super-tall tower in Business Bay in partnership with the watch and jewellery house Jacob & Co, advancing through its upper levels.", ["Jacob & Co partnership", "Super-tall silhouette", "Business Bay skyline"], None),
     P("Mercedes-Benz Places", "Downtown Dubai", B, "A Mercedes-Benz-branded residential tower rising in Downtown Dubai, with design detailing drawn from the car marque.", ["Mercedes-Benz brand", "Downtown address", "Penthouse collection"], None),
     P("Bugatti Residences by Binghatti", "Business Bay", B, "A tower that carries the Bugatti name and design cues in Business Bay, aimed at collectors of the brand and of the skyline.", ["Bugatti partnership", "Business Bay", "Automotive design cues"], None),
     P("Binghatti Hills", "Dubai Science Park", M, "A multi-building project in Dubai Science Park with distinctive geometric facades and access to the Al Barsha corridor.", ["Geometric facades", "Science Park setting", "Al Barsha access"], None),
     P("Binghatti Skyrise", "Business Bay", U, "A Business Bay high-rise whose angled facade is a signature of the developer's recent skyline projects.", ["Angled facade", "Canal district", "Central location"], None),
     P("Binghatti Gateway", "Al Jaddaf", U, "A tower in Al Jaddaf beside the Dubai Canal, one stop from Business Bay with creek-side access.", ["Creek-side district", "Near the canal", "Metro-linked"], None),
     P("Binghatti Mirage", "Jumeirah Village Circle", U, "A mid-rise block in Jumeirah Village Circle, with a reflective facade and the suburb's parks and schools around it.", ["Mid-rise block", "JVC community", "Everyday convenience"], None)])

dev("omniyat", "Omniyat", "276 40% 42%", "https://omniyat.com", "Fewer, more singular buildings.",
    "Omniyat builds a small number of design-focused towers, often with a hospitality partner such as Dorchester Collection and architects such as Zaha Hadid. Its work sits in Business Bay and on Palm Jumeirah.",
    "Ultra-prime, design-led",
    [P("ORLA, Dorchester Collection, Dubai", "Palm Jumeirah", B, "A Dorchester Collection-branded address on the Palm's crescent, with hotel service woven into the residences.", ["Dorchester Collection", "Palm crescent", "Hotel-grade service"], "https://omniyat.com/residential/orla-dorchester-collection-dubai"),
     P("ORLA Infinity", "Palm Jumeirah", B, "A follow-on branded project on Palm Jumeirah, set around the island's sea-facing frontage and infinity pool lines.", ["Dorchester Collection", "Sea frontage", "Palm Jumeirah"], "https://www.omniyat.com/residential/orla-infinity-dorchester-collection-dubai"),
     P("One at Palm Jumeirah", "Palm Jumeirah", B, "A low-density Dorchester Collection residence on Palm Jumeirah, with private pools and beach-level living.", ["Low density", "Private pools", "Beach level"], "https://www.omniyat.com/residential/one-at-palm-jumeirah"),
     P("The Lana", "Business Bay", B, "A Dorchester Collection hotel and residences tower in Business Bay, built beside the canal in the city's busiest district.", ["Dorchester Collection", "Canal-side", "Hotel and residences"], "https://www.omniyat.com/residential/the-lana-residences"),
     P("VELA", "Business Bay", B, "A Dorchester Collection residential tower in Business Bay, with the hospitality brand's concierge and design standards.", ["Dorchester Collection", "Business Bay", "Concierge service"], "https://www.omniyat.com/residential/vela-dorchester-collection-dubai"),
     P("VELA Viento", "Business Bay", B, "A sister tower to VELA, rising nearby with the same hospitality brand and a distinct sail-inspired silhouette.", ["Dorchester Collection", "Sail-inspired form", "Business Bay"], "https://www.omniyat.com/residential/vela-viento-dorchester-collection-dubai"),
     P("The Opus", "Business Bay", U, "A Zaha Hadid Architects-designed building in Business Bay, known for its cube split by a void, with a hotel and offices inside.", ["Zaha Hadid Architects", "Distinctive form", "Hotel and offices"], "https://omniyat.com")])

dev("samana", "Samana Developers", "180 62% 30%", "https://www.samanadevelopers.com", "Island-themed living for first-time buyers.",
    "Samana builds apartment communities with Mediterranean and island themes, mostly in Dubai Studio City, Jumeirah Village Circle and Arjan. Its buildings lean on lagoon-style pools and lifestyle amenities.",
    "Themed communities, accessible entry",
    [P("Samana Golf Avenue", "Dubai Studio City", G, "A community on the edge of Dubai Studio City organised around a golf outlook and generous landscaped podium.", ["Golf outlook", "Studio City location", "Landscaped podium"], None),
     P("Samana Mykonos", "Dubai Studio City", W, "A Greek-island-inspired development in Dubai Studio City, with whitewashed forms and a lagoon-style pool.", ["Greek-island theme", "Lagoon-style pool", "Studio City"], None),
     P("Samana Santorini", "Dubai Studio City", W, "A sister island-themed project in Dubai Studio City, with sunset-view terraces and a resort-style podium.", ["Island theme", "Resort-style podium", "Studio City"], None),
     P("Samana Waves", "Jumeirah Village Circle", U, "A wave-themed building in Jumeirah Village Circle with a terraced pool deck and everyday retail close by.", ["Wave-inspired design", "JVC community", "Pool deck"], None),
     P("Samana Park Views", "Arjan", U, "A building in Arjan with a park-facing outlook and quick access to Al Barsha and Dubai Hills.", ["Park views", "Arjan location", "Central access"], None),
     P("Samana Barari Views", "Majan", M, "A residential project in Majan, within the Dubailand growth corridor, designed around gardens and communal terraces.", ["Garden setting", "Majan neighbourhood", "Communal terraces"], None),
     P("Samana Ivy Gardens", "Dubailand", M, "A garden-themed community in Dubailand with planted courtyards and a family-friendly mix of buildings.", ["Garden theme", "Courtyards", "Family-friendly"], None)])

dev("dubai-properties", "Dubai Properties", "215 70% 38%", "https://www.dubaiproperties.ae", "Established communities, from JBR to Mudon.",
    "Dubai Properties is a master developer with long-running communities, including Jumeirah Beach Residence, Business Bay, Dubai Wharf and Mudon. These are mature neighbourhoods with years of resident history.",
    "Mature, proven neighbourhoods",
    [P("Jumeirah Beach Residence", "JBR", W, "One of Dubai's best-known beachfront neighbourhoods, a continuous strip of towers with a pedestrian Walk and direct beach access.", ["Beach access", "Pedestrian Walk", "Established community"], None),
     P("Business Bay", "Business Bay", U, "The canal-side business district developed by Dubai Properties, mixing offices, residences and hotels beside Downtown.", ["Canal district", "Central address", "Mixed use"], None),
     P("Dubai Wharf", "Culture Village", W, "A creek-side development in Culture Village, with the waterfront and the old creek skyline as its backdrop.", ["Creek frontage", "Culture Village", "Heritage proximity"], None),
     P("Mudon", "Dubailand", V, "A family villa and townhouse community in Dubailand, built around parks, a community centre and schools.", ["Family community", "Parks and schools", "Villas and townhouses"], None),
     P("Mudon Views", "Dubailand", M, "A newer Mudon neighbourhood, with fresh landscaping, parks and quick access to the main Dubailand roads.", ["New neighbourhood", "Park access", "Dubailand roads"], None),
     P("Villanova", "Dubailand", V, "A Mediterranean-style townhouse community in Dubailand, with village squares and tree-lined streets.", ["Mediterranean styling", "Village squares", "Townhouses"], None),
     P("Remraam", "Dubailand", M, "A large apartment community in Dubailand with central landscaping and on-site community facilities.", ["Apartment community", "Central landscaping", "On-site facilities"], None)])

dev("empire-developments", "Empire Developments", "16 72% 46%", "https://empiredevelopments.ae", "Boutique luxury in small, finished runs.",
    "Empire Developments works in a boutique format, with a handful of luxury projects delivered one at a time. Its public portfolio includes Empire Livings, Empire Estates and Empire Residence.",
    "Boutique luxury",
    [P("Empire Livings", "Dubai", U, "A luxury residential project that Empire has delivered, positioned as part of its design-focused portfolio.", ["Delivered project", "Design-led", "Boutique scale"], "https://empiredevelopments.ae"),
     P("Empire Estates", "Dubai", V, "A luxury community from Empire, at an advanced stage of construction according to the developer's recent updates.", ["Advanced construction", "Luxury community", "Boutique scale"], "https://empiredevelopments.ae"),
     P("Empire Residence", "Dubai", U, "Part of Empire's portfolio of boutique residences, with a focus on finish and everyday service.", ["Boutique residence", "Finish quality", "Everyday service"], "https://empiredevelopments.ae")])

dev("arada", "Arada", "150 48% 31%", "https://www.arada.com", "Destination developer, from Sharjah to the Palm.",
    "Arada started in Sharjah with Aljada and Masaar and now builds in Dubai and Abu Dhabi, including the Armani Beach Residences on the Palm. It treats each community as a destination with its own retail, schools and green space.",
    "Destination communities",
    [P("Aljada", "Sharjah", M, "A large mixed-use destination in Sharjah with apartments, retail, entertainment and a cultural core.", ["Mixed-use destination", "Sharjah", "Retail and leisure"], "https://www.arada.com/en/"),
     P("Masaar", "Sharjah", V, "A green, villa-led community in Sharjah, planned with forest-like landscaping and walkable streets.", ["Forest-like landscaping", "Walkable streets", "Villa community"], "https://www.arada.com/en/"),
     P("Masaar 3", "Sharjah", V, "A later phase in the Masaar community, extending the villa neighbourhoods and green corridors.", ["Later phase", "Green corridors", "Sharjah"], "https://www.arada.com/en/"),
     P("Nasma Residences", "Sharjah", U, "An apartment community in Sharjah with shared courtyards and a retail strip.", ["Courtyards", "Retail strip", "Sharjah"], "https://www.arada.com/en/"),
     P("Armani Beach Residences", "Palm Jumeirah", B, "A beach-front, Armani-branded residential development on Palm Jumeirah, with interiors by Armani/Casa.", ["Armani/Casa interiors", "Beach frontage", "Palm Jumeirah"], "https://www.arada.com/en/"),
     P("Anantara Residences Sharjah", "Sharjah", B, "A branded residence tower pairing the Anantara hospitality name with Sharjah's waterfront.", ["Anantara hospitality", "Sharjah waterfront", "Branded service"], "https://www.arada.com/en/"),
     P("Jouri Hills", "Dubai", V, "A residential community in Dubai from Arada's newer portfolio, planned around landscaped streets.", ["Landscaped streets", "Dubai location", "Community plan"], "https://www.arada.com/en/")])

dev("nakheel", "Nakheel", "215 70% 38%", "https://www.nakheel.com", "The island-makers behind the Palm.",
    "Nakheel created Palm Jumeirah and is now building Palm Jebel Ali and Dubai Islands. It also manages established communities such as Jumeirah Islands and Jumeirah Park.",
    "Waterfront and island megaprojects",
    [P("Palm Jebel Ali", "Palm Jebel Ali", I, "The next palm, a large man-made island off the Jebel Ali coast with beaches, marinas and a mix of villas and apartments.", ["Man-made palm", "Beach frontage", "Large-scale masterplan"], None),
     P("Dubai Islands", "Dubai Islands", I, "An archipelago of five islands off Deira, with beaches, marinas and a mix of residential and hospitality districts.", ["Five-island archipelago", "Deira coast", "Marinas and beaches"], None),
     P("Como Residences", "Palm Jumeirah", B, "A branded residential tower on Palm Jumeirah, with wellness and hospitality design from the Como group.", ["Como group", "Wellness design", "Palm Jumeirah"], None),
     P("Palm Beach Towers", "Palm Jumeirah", W, "A long-established beachfront group on the Palm, with a mall, beach club access and sea-facing apartments.", ["Beach club access", "Mall on site", "Sea-facing"], None),
     P("Jumeirah Islands", "Jumeirah Islands", V, "A gated villa community on landscaped lake islands, one of Dubai's earlier planned waterfront neighbourhoods.", ["Lake-island villas", "Gated community", "Mature landscaping"], None),
     P("Jumeirah Park", "Jumeirah Park", V, "A family villa community near Dubai Marina and Sheikh Zayed Road, with parks and a community centre.", ["Family villas", "Parks and community centre", "Central access"], None)])

dev("aldar", "Aldar", "180 62% 30%", "https://www.aldar.com", "Abu Dhabi's largest developer, now in Dubai too.",
    "Aldar is Abu Dhabi's biggest master developer, behind communities on Saadiyat, Yas and Fahid islands, and has also launched in Dubai. For buyers who want the capital rather than the coast of Dubai, it is the reference point.",
    "Abu Dhabi master communities",
    [P("Saadiyat Lagoons", "Saadiyat Island", W, "A family-oriented lagoon community on Saadiyat, with villas and townhouses near the island's beaches and cultural district.", ["Lagoon setting", "Near Saadiyat beaches", "Cultural district nearby"], None),
     P("Saadiyat Grove", "Saadiyat Island", M, "A mixed-use district on Saadiyat, set among the island's cultural institutions and designed for a walkable day-to-day.", ["Mixed-use", "Cultural district", "Walkable"], None),
     P("Yas Acres", "Yas Island", V, "A leafy villa community on Yas Island, with parks, a golf course and close proximity to theme-park leisure.", ["Leafy streets", "Golf course", "Yas leisure"], None),
     P("Yas Bay", "Yas Island", W, "A waterfront entertainment and residential district on Yas Island, with promenade, dining and marina-side living.", ["Waterfront district", "Dining promenade", "Marina-side"], None),
     P("Fahid Island", "Fahid Island", I, "A large new island masterplan between Yas and Saadiyat, planned for beaches, residential neighbourhoods and leisure.", ["New island masterplan", "Between Yas and Saadiyat", "Beach neighbourhoods"], None),
     P("Jubail Island", "Jubail Island", I, "A mangrove-fringed island community in Abu Dhabi, with villas and apartments planned around nature trails.", ["Mangrove setting", "Nature trails", "Abu Dhabi"], None),
     P("Haven by Aldar", "Dubailand", V, "Aldar's Dubai launch, a villa and townhouse community in Dubailand planned around central parkland.", ["Dubai debut", "Central parkland", "Villas and townhouses"], None)])

dev("hh-development", "H&H Development", "276 40% 42%", "https://www.h-h.ae", "Branded residences with the world's hotel and luxury names.",
    "H&H builds residences tied to luxury names such as Four Seasons and Baccarat, alongside its Eden-branded projects. It is focused on a handful of high-service addresses in Dubai.",
    "Luxury-brand residences",
    [P("Eden House Za'abeel", "Za'abeel", U, "An Eden-branded residence in Za'abeel, near Dubai's cultural and business centres.", ["Eden brand", "Za'abeel", "Central location"], "https://www.h-h.ae/development"),
     P("Eden Hills Dubai", "Dubai", V, "An Eden-branded hillside residential community, presented by H&H as part of its signature collection.", ["Eden brand", "Signature collection", "Dubai"], "https://www.h-h.ae/development"),
     P("Baccarat Residences Dubai", "Dubai", B, "Residences carrying the Baccarat crystal house name, with interiors drawn from the brand's design language.", ["Baccarat brand", "Crystal-inspired design", "Dubai"], "https://www.h-h.ae/development"),
     P("Four Seasons branded residences", "Dubai", B, "Residences developed with Four Seasons, bringing the hotel group's service standards to a private-ownership format.", ["Four Seasons brand", "Hotel-grade service", "Dubai"], "https://www.h-h.ae/development")])

Path(__file__).resolve().parent.parent.joinpath("data", "developers.json").write_text(json.dumps(D, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
print(len(D), "developers,", sum(len(d["projects"]) for d in D), "projects")
