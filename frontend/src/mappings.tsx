export type ProvinceName =
  | "Aceh"
  | "North Sumatra"
  | "South Sumatra"
  | "West Sumatra"
  | "Bengkulu"
  | "Riau"
  | "Riau Islands"
  | "Jambi"
  | "Lampung"
  | "Bangka Belitung Islands"
  | "West Kalimantan"
  | "East Kalimantan"
  | "South Kalimantan"
  | "Central Kalimantan"
  | "North Kalimantan"
  | "Banten"
  | "Jakarta"
  | "West Java"
  | "Central Java"
  | "Special Region of Yogyakarta"
  | "East Java"
  | "Bali"
  | "East Nusa Tenggara"
  | "West Nusa Tenggara"
  | "Gorontalo"
  | "West Sulawesi"
  | "Central Sulawesi"
  | "South East Sulawesi"
  | "North Sulawesi"
  | "South Sulawesi"
  | "North Maluku"
  | "Maluku"
  | "West Papua"
  | "Papua";

export const provinces: Record<ProvinceName, string> = {
  Aceh: "ChIJvcR8UN-bOTARYMogsoCdAwE",
  "North Sumatra": "ChIJhxxy61r51y8RC8vXCYE-p6w",
  "South Sumatra": "ChIJLeo1PXWLEC4Rz8QB4gGB_Bg",
  "West Sumatra": "ChIJRUJ08Ey51C8RVTvVdblRsXA",
  Bengkulu: "ChIJeZLjNx6wNi4R4bGjxGX7HFE",
  Riau: "ChIJdz6xGVhXJy4Rsb21bJQCb4M",
  "Riau Islands": "ChIJAQuH1E1l2TERvCSFiXW1RnI",
  Jambi: "ChIJ2aytzd2IJS4R8E-Q0103c3Q",
  Lampung: "ChIJpyKsUwF2Oy4RmrCJX8dYO48",
  "Bangka Belitung Islands": "ChIJizmlLUMWFy4RuSOEsf04fhI",
  "West Kalimantan": "ChIJu_7rjBcYBS4RoEghTO3sXM0",
  "East Kalimantan": "ChIJkZxNlhBH8S0R13bjLx2wq8Q",
  "South Kalimantan": "ChIJRbTSvTm33S0RE8GXt1C2fhQ",
  "Central Kalimantan": "ChIJP5a8hrK_4i0Rrmv1g2fV288",
  "North Kalimantan": "ChIJ9wvfNH0GDzIRiLlGaN3wERk",
  Banten: "ChIJmbkNxNaKQS4R6bMai6ua074",
  Jakarta: "ChIJnUvjRenzaS4RILjULejFAAE",
  "West Java": "ChIJf0dSgjnmaC4Rfp2O_FSkGLw",
  "Central Java": "ChIJ3RjVnJt1ZS4RRrztj53Rd8M",
  "Special Region of Yogyakarta": "ChIJxWtbvYdXei4R8LPIyrKSG20",
  "East Java": "ChIJxbXun_eToy0RULh8yvsLAwE",
  Bali: "ChIJoQ8Q6NNB0S0RkOYkS7EPkSQ",
  "East Nusa Tenggara": "ChIJlzbpqE3yUiwR4Br3yvsLAwE",
  "West Nusa Tenggara": "ChIJIe0SGpQNuC0RxXX30MzCZ2k",
  Gorontalo: "ChIJSa0hzCXAcTIRIBr3yvsLAwE",
  "West Sulawesi": "ChIJCUS7VCTaki0R8nAzLyC_XOo",
  "Central Sulawesi": "ChIJPS2aZckJiC0RmWLbjP0zbkM",
  "South East Sulawesi": "ChIJg3FrC97smC0R7aQEn0N8HWI",
  "North Sulawesi": "ChIJMZ4GcEJ1hzIRNbgMmBcWiUU",
  "South Sulawesi": "ChIJi75r_YD6DC0R8Br3yvsLAwE",
  "North Maluku": "ChIJszIkro6uni0RwBr3yvsLAwE",
  Maluku: "ChIJ36EccLq8ES0RUZpkBNvoMF4",
  "West Papua": "ChIJLQviub0KVC0RYsvHxfjBSVM",
  Papua: "ChIJc5L_qgQsO2gRc-bvXpxOqes",
};

export type IconName = "name" | "address" | "course";

export const icons: Record<IconName, string> = {
  name: "/building.svg",
  address: "/location.svg",
  course: "/book.svg",
};