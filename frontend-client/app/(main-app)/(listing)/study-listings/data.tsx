import { StudyListing } from "../studyCard"

export const tagData:{[key:string]: string[]} = {
  "modules"   : ["CS1101S", "CS1010X", "CS1010S" ,"CS1231", "CS1231S", "CS2030", "CS2030S", "CS2040", 
  "CS2040S", "CS2100", "MA1521", "MA2001", "ST2334", "IS1108", "IS2218", "GEA1000", "HSI1000", "ES2660"],
  "locations" : ["Terrace", "Benches @ LT-19", "Basement 1", "COM3"],
  "faculties" : ["SOC", "CHS", "FASS", "Computing", "Social Sciences", "Mathematics", "Statistics",
  "Engineering"],
}

export const testData : StudyListing[] = [
  {
    createdBy: "Tze Jie",
    title:     "Study @ Terrace",
    desc:      "Let's have some fun grinding together!",
    tags:      {"modules": ["CS2040S"], "locations": ["COM3"], "faculties": ["SOC"]},
    date:      new Date("2023-06-16T08:36:50.175Z"),
    freq:      "Every Week",
    interest:  20,
    id:        "invite1"
  },

  {
    createdBy: "Bryan",
    title:     "Study @ Basement1",
    desc:      "Seeking for people willing to carry my assignment",
    tags:      {"modules": ["CS1231S"], "locations": ["COM3"], "faculties": ["SOC"]},
    date:      new Date("2023-06-16T08:36:50.175Z"),
    freq:      "Every Week",
    interest:  0,
    id:        "invite2"
  },

  {
    createdBy: "Brandon",
    title:     "Study @ ASL2",
    desc:      "Anyone wants to be my study date?",
    tags:      {"modules": ["HSI1000"], "locations": ["COM3"], "faculties": ["CHS"]},
    date:      new Date("2023-06-16T08:36:50.175Z"),
    freq:      "Once",
    interest:  2,
    id:        "invite3"
  },

  {
    createdBy: "Tiffany",
    title:     "Grind Sesh",
    desc:      "NUS Grind Sesh by your favourite boi",
    tags:      {"modules": ["CS2040S", "CS2030S", "CS2100"], "locations": ["COM3"], "faculties": ["SOC"]},
    date:      new Date("2023-06-16T08:36:50.175Z"),
    freq:      "Every Week",
    interest:  50,
    id:        "invite4"
  },

  {
    createdBy: "Amelia",
    title:     "Chill study",
    desc:      "Talk, study and chill",
    tags:      {"modules": ["IS2218"], "locations": ["Terrace"], "faculties": ["SOC"]},
    date:      new Date("2023-06-16T08:36:50.175Z"),
    freq:      "Once",
    interest:  2,
    id:        "invite5"
  }
]