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

export type AccreditationKey =
  | "A"
  | "B"
  | "C"
  | "Unggul"
  | "Baik"
  | "Baik Sekali"
  | "";

export interface UniversityType {
  id: number;
  code: string;
  name: string;
  abbreviation: string;
  accreditation: string;
  program_count: number;
  website: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  match_type: keyof FilterType;
  province: ProvinceName;
  place_id: string;
}

export type FilterType = {
  name: boolean;
  address: boolean;
  course: boolean;
};

export type AccreditationFilter = { [key in keyof AccreditationKey]?: boolean };

export type IconName = "name" | "address" | "course";

export type APISearchResponse = {
  name_match: number;
  address_match: number;
  course_match: number;
  universities: UniversityType[];
};
