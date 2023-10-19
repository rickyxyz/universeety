import { ProvinceName } from "./mappings";

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
