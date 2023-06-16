import { StudyListing } from "../studyCard"

export const tagData:{[key:string]:string[]} = {
  "modules" : ["CS1101S", "CS1010X", "CS1231S", "IS2218", "IS1108", "CS2030S", "CS2040S", "HSI1000"],

  "locations" : ["Terrace", "Benches @ LT-19", "Basement 1", "COM3"],

  "faculties" : ["SOC", "CHS", "FASS", "Computing", "Social Sciences", "Mathematics", "Statistics"],
}

export const testData : { [id: string] : StudyListing } = {
  invite_1: {
    title:    "Study @ Terrace",
    desc:     "Let's have some fun grinding together!",
    tags:     {"modules": ["CS2040S"], "locations": ["COM3"], "faculties": ["SOC"]},
    date:     new Date("2023-06-16T08:36:50.175Z"),
    freq:     "Every Week",
    interest: 20,
    id: 1001
  },

  invite_2: {
    title:    "Study @ Basement1",
    desc:     "Seeking for people willing to carry my assignment",
    tags:     {"modules": ["CS1231S"], "locations": ["COM3"], "faculties": ["SOC"]},
    date:     new Date("2023-06-16T08:36:50.175Z"),
    freq:     "Every Week",
    interest: 0,
    id: 1002
  },

  invite_3: {
    title:    "Study @ ASL2",
    desc:     "Anyone wants to be my study date?",
    tags:     {"modules": ["HSI1000"], "locations": ["COM3"], "faculties": ["CHS"]},
    date:     new Date("2023-06-16T08:36:50.175Z"),
    freq:     "Once",
    interest: 2,
    id: 1003
  },

  invite_4: {
    title:    "Grind Sesh",
    desc:     "NUS Grind Sesh by your favourite boi",
    tags:     {"modules": ["CS2040S", "CS2030S", "CS2100"], "locations": ["COM3"], "faculties": ["SOC"]},
    date:     new Date("2023-06-16T08:36:50.175Z"),
    freq:     "Every Week",
    interest: 50,
    id: 1003
  },

  invite_5: {
    title:    "Chill study",
    desc:     "Talk, study and chill",
    tags:     {"modules": ["IS2218"], "locations": ["Terrace"], "faculties": ["SOC"]},
    date:     new Date("2023-06-16T08:36:50.175Z"),
    freq:     "Once",
    interest: 2,
    id: 1003
  }
}