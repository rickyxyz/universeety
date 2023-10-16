export interface UniversityType {
  id: number;
  code: string;
  name: string;
  abbreviation: string;
  accreditation: string;
  program_count: number;
  website: string;
  phone: string;
  address1: string;
  address2: string;
  latitude: number;
  longitude: number;
  match_type: keyof FilterType;
}

export type FilterType = {
  name: boolean;
  address: boolean;
  course: boolean;
};
