import type { CeritaBab, CeritaSlug, Foto, VideoCerita } from "./cerita";

/**
 * English version of the story pages (/cerita/[slug]): same structure, image paths, credits, and URLs as `cerita.ts`
 * (Indonesian source). Only the displayed text is translated. No new facts were added.
 */
const NASA = "NASA";
const BELUM = "NASA (detailed credit not yet recorded)";
const f = (src: string, keterangan: string, kredit = NASA): Foto => ({ src, keterangan, kredit });
const v = (nama: string, judul: string, keterangan: string): VideoCerita => ({
  src: `/videos/apollo-11/${nama}.mp4`,
  poster: `/videos/apollo-11/${nama}.webp`,
  judul,
  keterangan,
});

const SUMBER_APOLLO = [
  { judul: "NASA: Apollo 11 Mission Overview", url: "https://www.nasa.gov/missions/apollo/apollo-11/apollo-11-mission-overview/" },
  { judul: "NASA: Apollo 11", url: "https://www.nasa.gov/mission/apollo-11/" },
];

export const DATA_EN: Record<CeritaSlug, Omit<CeritaBab, "slug" | "babId" | "nomor" | "judul" | "ringkasan">> = {
  "awal-eksplorasi": {
    hero: f("/images/story/bab-1-apollo-11-orbit.webp", "Apollo 11: the command module in lunar orbit.", "NASA"),
    pengantar:
      "Before humans left their footprints on the Moon, there was a long journey of research, experiments, and the courage to explore a place no human had ever visited.",
    bagian: [
      {
        waktu: "29 July 1958",
        judul: "NASA's legal foundation",
        isi: "President Dwight D. Eisenhower signed the law that became the basis for creating NASA. The agency was formed to develop aeronautical research and study space.",
      },
      {
        waktu: "1 October 1958",
        judul: "NASA begins work",
        isi: "NASA began operating. T. Keith Glennan became the first administrator, with Hugh L. Dryden as deputy administrator.",
      },
      {
        waktu: "25 May 1961",
        judul: "Kennedy's goal",
        isi: "President John F. Kennedy set a national goal: land a human on the Moon and bring them back to Earth safely.",
      },
      {
        waktu: "The 1960s",
        judul: "The road to the Moon",
        isi: "NASA worked to achieve that goal. The Apollo 8 and Apollo 10 missions helped prove that a trip to the Moon could be done and prepared the next step.",
        foto: f("/images/galeri/moon-view-moon.webp", "Apollo 11: a view of the Moon.", "NASA"),
      },
      {
        waktu: "July 1969",
        judul: "The test of Apollo 11",
        isi: "Apollo 11 had to prove that humans could travel from Earth to the Moon, land on its surface, and return to Earth safely. Its crew was three astronauts: Neil Armstrong, Buzz Aldrin, and Michael Collins.",
      },
    ],
    galeri: [
      f("/images/story/bab-1-apollo-11-orbit.webp", "Apollo 11: the command module in lunar orbit."),
      f("/images/galeri/moon-view-moon.webp", "Apollo 11: a view of the Moon."),
      f("/images/galeri/moon-aldrin-bendera.webp", "Buzz Aldrin saluting near the U.S. flag."),
    ],
    video: [v("saturn-v-peluncuran", "Saturn V launch, 1969", "The Saturn V rocket that launched Apollo 11.")],
    fakta: [
      { isi: "The law creating NASA was signed on 29 July 1958; NASA began operating on 1 October 1958.", sumber: "NASA: NASA's Origins" },
      { isi: "Apollo 11 was not the beginning of NASA, but one of its great achievements a few years later.", sumber: "NASA: The 1960s" },
      { isi: "The missions before Apollo 11 mentioned in the NASA article are Apollo 8 and Apollo 10.", sumber: "NASA: The 1960s" },
    ],
    artefak: [
      {
        nama: "Saturn V rocket",
        status: "Apollo 11's launch vehicle",
        deskripsi: "A giant rocket 363 feet (about 111 m) tall that launched Apollo 11 from Kennedy Space Center.",
        model: "A 3D model of the Saturn V is in the NASA asset folder, not yet placed in the 3D environment.",
      },
      {
        nama: "Columbia, the command module",
        status: "Stayed in lunar orbit",
        deskripsi: "The astronauts' home during the journey. Michael Collins stayed inside while Eagle went down to the surface.",
        foto: f("/images/story/bab-1-apollo-11-orbit.webp", "The command module in lunar orbit.", "NASA"),
        model: "There is no NASA 3D model of Columbia yet.",
      },
    ],
    tiga3d: null,
    sumber: [
      { judul: "NASA: NASA's Origins", url: "https://www.nasa.gov/image-article/nasas-origins/" },
      { judul: "NASA: The 1960s, from dream to reality in 10 years", url: "https://www.nasa.gov/history/the-1960s-from-dream-to-reality-in-10-years/" },
      ...SUMBER_APOLLO,
    ],
  },

  "eksplorasi-bulan": {
    hero: f("/images/galeri/moon-aldrin-bendera.webp", "Buzz Aldrin saluting near the U.S. flag, Apollo 11, July 1969.", "NASA"),
    pengantar:
      "On 20 July 1969, Eagle landed in the Sea of Tranquility and humans set foot on the Moon for the first time. Follow the journey, and see what was left behind there.",
    bagian: [
      {
        waktu: "16 July 1969",
        judul: "Launch",
        isi: "The Saturn V rocket lifted off from Kennedy Space Center (Pad 39A) at 09:32 EDT. About 2 hours 44 minutes later its engine fired again, pushing the spacecraft out of Earth orbit toward the Moon.",
      },
      {
        waktu: "16 to 19 July",
        judul: "Heading to the Moon",
        isi: "Columbia separated from the rocket, then docked with Eagle. People on Earth could watch color TV broadcasts from the spacecraft. On 19 July the spacecraft entered lunar orbit.",
        foto: f("/images/story/bab-1-apollo-11-orbit.webp", "The Columbia command module in lunar orbit.", "NASA"),
      },
      {
        waktu: "20 July",
        judul: "Eagle lands",
        isi: "Eagle separated from Columbia. Armstrong and Aldrin went down, while Collins stayed in orbit. Eagle landed in the Sea of Tranquility, about 4 miles from the planned spot and slightly ahead of schedule.",
        foto: f("/images/galeri/moon-lm-jauh.webp", "The Lunar Module seen from a distance.", "NASA"),
      },
      {
        waktu: "20 July",
        judul: "One small step",
        isi: "Armstrong stepped onto the Moon, and Aldrin followed about 20 minutes later. \"That's one small step for man, one giant leap for mankind.\"",
        foto: f("/images/galeri/moon-armstrong-sampel.webp", "Neil Armstrong collecting lunar samples.", "NASA"),
      },
      {
        waktu: "20 to 21 July",
        judul: "On the lunar surface",
        isi: "They walked on the Moon for about 2.5 hours, spending 21 hours 36 minutes on the surface in total. They collected rock samples and set up experiments. President Nixon phoned the astronauts while they were there.",
        foto: f("/images/galeri/moon-easep-bendera.webp", "Aldrin after deploying the EASEP: the seismometer, laser retroreflector, and the U.S. flag in the background.", "NASA"),
      },
      {
        waktu: "21 to 24 July",
        judul: "Coming home",
        isi: "Eagle lifted off and docked with Columbia again, then the engine fired to head home. On 24 July the spacecraft splashed down in the Pacific Ocean near the USS Hornet. The whole trip took about 8 days, and 21.55 kg of lunar rock and soil samples were brought home.",
      },
    ],
    galeri: [
      f("/images/galeri/moon-aldrin-bendera.webp", "Buzz Aldrin saluting near the U.S. flag."),
      f("/images/galeri/moon-lm-jauh.webp", "The Lunar Module seen from a distance."),
      f("/images/galeri/moon-armstrong-sampel.webp", "Neil Armstrong collecting lunar samples."),
      f("/images/galeri/moon-aldrin-tangga.webp", "Buzz Aldrin near the Lunar Module ladder."),
      f("/images/galeri/moon-aldrin-lm.webp", "Buzz Aldrin beside the Lunar Module."),
      f("/images/galeri/moon-bootprint.webp", "An Apollo astronaut's bootprint in the lunar dust."),
      f("/images/galeri/moon-easep-bendera.webp", "Aldrin after deploying the EASEP; the U.S. flag in the background."),
      f("/images/galeri/moon-aldrin-membawa-easep.webp", "Aldrin carrying the seismometer and laser retroreflector."),
      f("/images/galeri/moon-komponen-easep.webp", "Components of the EASEP experiment package."),
      f("/images/galeri/moon-bendera-terpasang.webp", "The U.S. flag planted on the lunar surface."),
      f("/images/galeri/moon-aldrin-angin-matahari.webp", "Buzz Aldrin beside the solar wind experiment."),
      f("/images/galeri/moon-plakat.webp", "The Apollo 11 commemorative plaque."),
      f("/images/galeri/moon-angin-matahari.webp", "The Apollo 11 solar wind experiment."),
      f("/images/galeri/moon-view-moon.webp", "Apollo 11: a view of the Moon."),
    ],
    video: [
      v("pengantar-misi", "Introduction to the Apollo 11 mission", "An introduction to the Apollo 11 mission."),
      v("satu-langkah-kecil", "One small step", "Neil Armstrong steps onto the Moon."),
      v("aldrin-menjejak-bulan", "Aldrin steps onto the Moon", "Buzz Aldrin goes down to the lunar surface."),
      v("mengibarkan-bendera", "Raising the flag", "The U.S. flag is planted on the lunar surface."),
      v("plakat-peringatan", "The commemorative plaque", "The plaque mounted on the lander's leg."),
    ],
    fakta: [
      { isi: "The Eagle descent stage is 4.2 m wide and 1.7 m thick, with a dry mass of 2,034 kg.", sumber: "NSSDCA" },
      { isi: "Total time on the lunar surface was 21 hours 36 minutes, with about 2.5 hours spent walking on the Moon.", sumber: "NASA: Apollo 11 Mission Overview" },
      { isi: "Armstrong and Aldrin left behind medals for three Apollo 1 astronauts and two cosmonauts, and a silicon disc with messages from 73 countries.", sumber: "NASA: Apollo 11 Mission Overview" },
    ],
    artefak: [
      {
        nama: "Eagle descent stage",
        status: "Left on the Moon",
        deskripsi: "The lower part of the lander, which served as the launch platform for the ascent stage. An octagonal prism, 4.2 m wide.",
        foto: f("/images/galeri/moon-lm-jauh.webp", "The Lunar Module seen from a distance.", "NASA"),
        model: "3D model: the generic Apollo Lunar Module model (not an Eagle-specific model), available in the 3D environment.",
      },
      {
        nama: "Commemorative plaque",
        status: "Left on the Moon",
        deskripsi: "Mounted on a leg of the lander. It reads: \"Here men from the planet Earth first set foot upon the moon. July 1969 A.D. We came in peace for all mankind.\"",
        foto: f("/images/galeri/moon-plakat.webp", "The Apollo 11 commemorative plaque.", "NASA"),
        model: "There is no NASA 3D model yet: shown as a photo plate in the 3D environment.",
      },
      {
        nama: "American flag",
        status: "Left on the Moon",
        deskripsi: "Planted by the astronauts on the lunar surface.",
        foto: f("/images/galeri/moon-bendera-terpasang.webp", "The U.S. flag planted on the lunar surface.", "NASA"),
        model: "There is no NASA 3D model yet: shown as a photo plate in the 3D environment.",
      },
      {
        nama: "Seismometer (PSE)",
        status: "Left behind, inactive",
        deskripsi: "A moonquake recorder in the EASEP package, placed about 17 m south of the lander. It worked from 21 July to 27 August 1969.",
        foto: f("/images/galeri/moon-komponen-easep.webp", "Components of the EASEP experiment package.", "NASA"),
        model: "There is no NASA 3D model yet: shown as a photo plate in the 3D environment.",
      },
      {
        nama: "Laser retroreflector (LRRR)",
        status: "Left on the Moon",
        deskripsi: "A 46 cm panel of 100 silica corner mirrors that reflects lasers from Earth. Needs no power; placed about 5 m from the EASEP.",
        foto: f("/images/galeri/moon-aldrin-membawa-easep.webp", "Aldrin carrying the seismometer and laser retroreflector.", "NASA"),
        model: "There is no NASA 3D model yet: shown as a photo plate in the 3D environment.",
      },
      {
        nama: "Astronaut Bootprint",
        status: "A trace in the lunar dust",
        deskripsi: "An Apollo astronaut's bootprint on the lunar surface. The mission and date of the photo are not recorded.",
        foto: f("/images/galeri/moon-bootprint.webp", "An Apollo astronaut's bootprint in the lunar dust.", BELUM),
        model: "This is a photo, not a 3D model: shown as a photo plate in the 3D environment.",
      },
      {
        nama: "Commemorative items",
        status: "Left on the Moon",
        deskripsi: "Medals for three Apollo 1 astronauts and two cosmonauts, and a 1.5-inch silicon disc with messages from 73 countries.",
        model: "There is no NASA model or photo yet: text information only, marked by a pin in the 3D environment.",
      },
      {
        nama: "Other equipment",
        status: "Left on the Moon",
        deskripsi: "A TV camera, two still cameras, sampling tools, the portable life support system (PLSS), lunar boots, and a gnomon.",
        model: "There is no NASA model or photo yet: text information only, marked by a pin in the 3D environment.",
      },
      {
        nama: "Solar wind experiment",
        status: "An Apollo 11 experiment",
        deskripsi: "An experiment set up by the astronauts on the lunar surface; Buzz Aldrin can be seen beside it in a NASA photo.",
        foto: f("/images/galeri/moon-angin-matahari.webp", "The Apollo 11 solar wind experiment.", "NASA"),
        model: "This is a photo, not a 3D model: shown as a photo plate in the 3D environment.",
      },
      {
        nama: "Rock and soil samples",
        status: "Brought home to Earth",
        deskripsi: "Armstrong collected lunar rock and soil samples; 21.55 kg were brought home.",
        foto: f("/images/galeri/moon-armstrong-sampel.webp", "Neil Armstrong collecting lunar samples.", "NASA"),
        model: "This is a photo, not a 3D model: shown as a photo plate in the 3D environment.",
      },
      {
        nama: "Eagle ascent stage",
        status: "Fate unknown",
        deskripsi: "Carried Armstrong and Aldrin back to Columbia, then was released into lunar orbit on 22 July 1969. Believed to have crashed into the Moon 1 to 4 months later.",
        model: "3D model: the upper part of the generic Apollo Lunar Module model, available in the 3D environment.",
      },
    ],
    tiga3d: {
      label: "Explore the Moon Environment",
      href: "/story/2",
      deskripsi: "Stand at Tranquility Base: see the Lunar Module and the objects left behind, then choose an info point to read its data.",
    },
    sumber: [
      ...SUMBER_APOLLO,
      { judul: "NSSDCA: Apollo 11 (Eagle, EASEP, LRRR)", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C" },
    ],
  },

  "eksplorasi-mars": {
    hero: f("/images/galeri/mars-opportunity-foto-diri.webp", "Self-portrait of Opportunity, January 2014.", "NASA/JPL-Caltech/Cornell Univ./Arizona State Univ."),
    pengantar:
      "Two twin rovers have been searching for traces of water on Mars since 2004. The plan was only about 90 Mars days, but they worked for years and changed how we understand the planet.",
    bagian: [
      {
        waktu: "2003",
        judul: "Searching for traces of water",
        isi: "NASA sent two twin rovers to Mars. Mars is dry and cold today, but scientists suspected it was once wet. Spirit was sent to Gusev Crater, a large crater that may once have been a lake. Opportunity was sent to Meridiani Planum, a place with minerals that usually form in water.",
      },
      {
        waktu: "10 June and 8 July 2003",
        judul: "Launch",
        isi: "Spirit launched on a Delta II rocket on 10 June 2003. Opportunity followed on 8 July 2003 (UT).",
      },
      {
        waktu: "3 and 24 January 2004",
        judul: "Landing in two places",
        isi: "Spirit landed in Gusev Crater on 3 January 2004, and Opportunity on Meridiani Planum on 24 January 2004.",
        foto: f("/images/galeri/mars-spirit-gusev.webp", "The Spirit rover in Gusev Crater.", "NASA/JPL-Caltech"),
      },
      {
        waktu: "2 March 2004",
        judul: "Evidence of water",
        isi: "NASA announced strong evidence that Meridiani Planum was once wet. Opportunity found the mineral hematite and traces of salty water; Spirit found the mineral goethite and soil that is 90 percent silica, which is also linked to water.",
        foto: f("/images/galeri/mars-meridiani-planum.webp", "Meridiani Planum, Opportunity's landing site (HiRISE image).", "NASA/JPL/Univ. of Arizona"),
      },
      {
        waktu: "The following years",
        judul: "Far beyond the plan",
        isi: "Both were designed to work for about 90 sols (Mars days), but kept going. Opportunity travelled 45.16 km, while Spirit about 7.7 km. Opportunity also found Heat Shield Rock, an iron-nickel meteorite.",
        foto: f("/images/galeri/mars-heat-shield-rock.webp", "Opportunity's heat shield fragments; Heat Shield Rock on the left of the photo.", "NASA/JPL/Cornell"),
      },
      {
        waktu: "2009 to 2011",
        judul: "Spirit stops",
        isi: "Spirit got stuck in soft soil on 1 May 2009, on the western edge of the Home Plate plateau. Its last communication was on 22 March 2010, and official recovery efforts ended on 25 May 2011.",
        foto: f("/images/galeri/mars-spirit-tanah-lunak.webp", "Spirit slipping in soft soil (sol 1889).", "NASA/JPL-Caltech"),
      },
      {
        waktu: "2018 to 2019",
        judul: "Opportunity stops",
        isi: "Last contact with Opportunity came on 10 June 2018 during a global dust storm, when it was in Perseverance Valley, a canyon on the western rim of Endeavour Crater. NASA declared the mission over on 13 February 2019.",
        foto: f("/images/galeri/mars-perseverance-valley.webp", "A view from inside Perseverance Valley.", "NASA/JPL-Caltech/Cornell Univ./Arizona State Univ."),
      },
    ],
    galeri: [
      f("/images/galeri/mars-opportunity-foto-diri.webp", "Self-portrait of Opportunity, January 2014.", "NASA/JPL-Caltech/Cornell Univ./Arizona State Univ."),
      f("/images/galeri/mars-spirit-gusev.webp", "The Spirit rover in Gusev Crater.", "NASA/JPL-Caltech"),
      f("/images/galeri/mars-spirit-home-plate.webp", "Spirit after a drive west of Home Plate.", "NASA/JPL-Caltech"),
      f("/images/galeri/mars-spirit-tanah-lunak.webp", "Spirit slipping in soft soil (sol 1889).", "NASA/JPL-Caltech"),
      f("/images/galeri/mars-heat-shield-rock.webp", "Opportunity's heat shield fragments; Heat Shield Rock on the left of the photo.", "NASA/JPL/Cornell"),
      f("/images/galeri/mars-opportunity-sol-354.webp", "Opportunity panorama, sol 354; Heat Shield Rock on the right.", "NASA/JPL"),
      f("/images/galeri/mars-kawah-endeavour.webp", "Opportunity's shadow and a view of Endeavour Crater.", "NASA/JPL-Caltech"),
      f("/images/galeri/mars-perseverance-valley.webp", "A view from inside Perseverance Valley.", "NASA/JPL-Caltech/Cornell Univ./Arizona State Univ."),
      f("/images/galeri/mars-meridiani-planum.webp", "Meridiani Planum, Opportunity's landing site (HiRISE image).", "NASA/JPL/Univ. of Arizona"),
    ],
    video: [],
    fakta: [
      { isi: "Spirit and Opportunity landed in January 2004. Spirit worked until 2010 and Opportunity until 2018, more than 14 years.", sumber: "NASA Science" },
      { isi: "Opportunity travelled 45.16 km, a record until Perseverance surpassed it on 11 October 2026 (45.22 km). Spirit travelled about 7.7 km.", sumber: "NASA" },
    ],
    artefak: [
      {
        nama: "Spirit rover",
        status: "Left on Mars, inactive",
        deskripsi: "Landed in Gusev Crater. Got stuck in soft soil on the western edge of Home Plate; last communication 22 March 2010.",
        foto: f("/images/galeri/mars-spirit-gusev.webp", "The Spirit rover in Gusev Crater.", "NASA/JPL-Caltech"),
        model: "3D model: the generic MER rover model (Spirit and Opportunity are twins), available in the 3D environment.",
      },
      {
        nama: "Opportunity rover",
        status: "Left on Mars, inactive",
        deskripsi: "Landed on Meridiani Planum. Last contact 10 June 2018 in Perseverance Valley.",
        foto: f("/images/galeri/mars-opportunity-foto-diri.webp", "Self-portrait of Opportunity, January 2014.", "NASA/JPL-Caltech/Cornell Univ./Arizona State Univ."),
        model: "3D model: NASA's Mars Exploration Rover Opportunity (MER-B) model, available in the 3D environment.",
      },
      {
        nama: "Heat Shield Rock",
        status: "An Opportunity find",
        deskripsi: "An iron-nickel meteorite found by Opportunity. Not a human-made object.",
        foto: f("/images/galeri/mars-heat-shield-rock.webp", "Opportunity's heat shield fragments; Heat Shield Rock on the left of the photo.", "NASA/JPL/Cornell"),
        model: "There is no NASA 3D model yet: shown as a photo plate in the 3D environment.",
      },
    ],
    tiga3d: {
      label: "Explore the Mars Environment",
      href: "/story/3",
      deskripsi: "See both rovers on the surface of Mars, then choose an info point to read each one's journey.",
    },
    sumber: [
      { judul: "NASA Science: Mars Exploration Rovers", url: "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/" },
      { judul: "NSSDCA: Spirit", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-027A" },
      { judul: "NSSDCA: Opportunity", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A" },
      { judul: "NASA: Opportunity mission ends", url: "https://www.nasa.gov/news-release/nasas-record-setting-opportunity-rover-mission-on-mars-comes-to-end/" },
    ],
  },

  "deep-space": {
    hero: f("/images/galeri/deep-space-voyager-konsep.webp", "An illustration of Voyager in interstellar space (artist's concept).", "NASA/JPL-Caltech"),
    pengantar:
      "Voyager 1 and 2 flew into interstellar space carrying the Golden Record, a message from Earth for anyone who finds it.",
    bagian: [
      {
        waktu: "20 August and 5 September 1977",
        judul: "Two twin spacecraft",
        isi: "Voyager 2 launched on 20 August 1977, followed by Voyager 1 on 5 September 1977. Voyager 1 has a mass of 721.9 kg.",
        foto: f("/images/galeri/deep-space-golden-record-persiapan.webp", "Preparing the Golden Record for Voyager.", "NASA/JPL-Caltech"),
      },
      {
        waktu: "1977 to 1989",
        judul: "Passing the planets",
        isi: "Voyager 2 flew past Jupiter, Saturn, Uranus (24 January 1986), and Neptune (25 August 1989).",
        foto: f("/images/galeri/deep-space-uranus.webp", "Uranus as seen by Voyager 2.", "NASA/JPL-Caltech"),
      },
      {
        waktu: "Carried aboard",
        judul: "The Golden Record",
        isi: "Both spacecraft carry a gold-plated copper disc 30 cm wide. It holds greetings in 55 languages, 35 natural sounds, about 90 minutes of music, 115 images, and greetings from President Carter and U.N. Secretary-General Waldheim. Its cover carries a symbol showing Earth's position relative to several pulsars.",
        foto: f("/images/galeri/deep-space-golden-record-sampul.webp", "The Golden Record cover plate: a diagram of how to play it and where Earth is.", BELUM),
      },
      {
        waktu: "August 2012 and 5 November 2018",
        judul: "Out into interstellar space",
        isi: "Voyager 1 entered interstellar space in August 2012, and Voyager 2 on 5 November 2018. Since 17 February 1998, Voyager 1 has been the most distant human-made object from the Sun.",
      },
      {
        waktu: "Today",
        judul: "Still operating",
        isi: "Both are still operating in extended missions. Some instruments have been switched off to save power. As of 17 April 2026, Voyager 1's active instruments are MAG and PWS, while Voyager 2 uses CRS, MAG, and PWS. NASA projects Voyager 1 to be 16.094 billion miles (25.902 billion km) from Earth on 18 November 2026.",
      },
    ],
    galeri: [
      f("/images/galeri/deep-space-golden-record-sampul.webp", "The Golden Record cover plate: a diagram of how to play it and where Earth is.", BELUM),
      f("/images/galeri/deep-space-golden-record-diagram.webp", "An explanation of the diagram on the Golden Record cover.", BELUM),
      f("/images/galeri/deep-space-golden-record.webp", "The Voyager Golden Record.", BELUM),
      f("/images/galeri/deep-space-golden-record-persiapan.webp", "Preparing the Golden Record for Voyager.", "NASA/JPL-Caltech"),
      f("/images/galeri/deep-space-voyager-2-antarbintang.webp", "Voyager 2, the interstellar traveler.", BELUM),
      f("/images/galeri/deep-space-jupiter-bintik.webp", "Jupiter and the Great Red Spot, from Voyager.", BELUM),
      f("/images/galeri/deep-space-io.webp", "A mosaic of Jupiter's moon Io, from Voyager.", BELUM),
      f("/images/galeri/deep-space-saturnus-cincin.webp", "Detail of Saturn's rings.", BELUM),
      f("/images/galeri/deep-space-saturnus-atmosfer.webp", "Changes in Saturn's atmosphere.", BELUM),
      f("/images/galeri/deep-space-uranus.webp", "Uranus as seen by Voyager 2.", "NASA/JPL-Caltech"),
      f("/images/galeri/deep-space-neptunus.webp", "Neptune as seen by Voyager 2.", "NASA/JPL"),
      f("/images/galeri/deep-space-neptunus-bintik-gelap.webp", "Neptune: the Great Dark Spot.", "NASA/JPL"),
      f("/images/galeri/deep-space-pale-blue-dot.webp", "Pale Blue Dot, revisited.", BELUM),
      f("/images/galeri/deep-space-saturnus-lanjut.webp", "Saturn on Voyager's journey.", BELUM),
      f("/images/galeri/deep-space-voyager-konsep.webp", "An illustration of Voyager in interstellar space (artist's concept).", "NASA/JPL-Caltech"),
    ],
    video: [],
    fakta: [
      { isi: "Voyager 2 flew past Uranus on 24 January 1986 and Neptune on 25 August 1989.", sumber: "NASA Science" },
      { isi: "The Golden Record holds greetings in 55 languages, 35 natural sounds, about 90 minutes of music, and 115 images.", sumber: "NASA Science" },
      { isi: "As of 21 August 2024, Voyager 1 was 164.7 AU from the Sun, moving at 17.0 km/s relative to the Sun (older data).", sumber: "NASA Science: Voyager 1" },
    ],
    artefak: [
      {
        nama: "Voyager 1",
        status: "Still operating",
        deskripsi: "Launched 5 September 1977, with a mass of 721.9 kg. Entered interstellar space in August 2012.",
        foto: f("/images/galeri/deep-space-voyager-konsep.webp", "An illustration of Voyager in interstellar space (artist's concept).", "NASA/JPL-Caltech"),
        model: "3D model: NASA's generic Voyager Probe (B) model, available in the 3D environment.",
      },
      {
        nama: "Voyager 2",
        status: "Still operating",
        deskripsi: "Launched 20 August 1977. Entered interstellar space on 5 November 2018.",
        foto: f("/images/galeri/deep-space-voyager-2-antarbintang.webp", "Voyager 2, the interstellar traveler.", BELUM),
        model: "3D model: NASA's generic Voyager Probe (A) model, available in the 3D environment.",
      },
      {
        nama: "Golden Record Cover",
        status: "Carried into interstellar space",
        deskripsi: "The disc's cover: a diagram of how to play it and where Earth is, with a symbol showing Earth's position relative to several pulsars.",
        foto: f("/images/galeri/deep-space-golden-record-sampul.webp", "The Golden Record cover.", BELUM),
        model: "NASA only provides photos: shown as a cut-out of the real photo in the 3D environment.",
      },
      {
        nama: "Golden Record",
        status: "Carried into interstellar space",
        deskripsi: "A gold-plated copper disc, 30 cm, aboard both spacecraft.",
        foto: f("/images/galeri/deep-space-golden-record.webp", "The Voyager Golden Record.", BELUM),
        model: "NASA only provides photos: shown as a cut-out of the real photo in the 3D environment.",
      },
    ],
    tiga3d: {
      label: "Explore the Deep Space Environment",
      href: "/story/4",
      deskripsi: "See both Voyagers floating in interstellar space, then choose an info point to read each one's story.",
    },
    sumber: [
      { judul: "NASA Science: Voyager", url: "https://science.nasa.gov/mission/voyager/" },
      { judul: "NASA Science: Voyager 1", url: "https://science.nasa.gov/mission/voyager/voyager-1/" },
      { judul: "NASA Science: Where Are They Now", url: "https://science.nasa.gov/mission/voyager/where-are-they-now/" },
      { judul: "NASA Science: Golden Record", url: "https://science.nasa.gov/mission/voyager/golden-record-contents/" },
    ],
  },
};
