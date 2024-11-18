export interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
}

export interface DiscoverMoviesResponse {
  page: number;
  total_results: number;
  total_pages: number;
  results: Movie[];
}

export interface CrewMember {
  known_for_department: string;
  name: string;
}

export interface Editors {
  editors: string[];
  name: string;
}

export interface HomerunMovie {
  title: string;
  release_date: string;
  vote_average: number;
  editors: string[];
}