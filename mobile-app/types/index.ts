export interface Card {
  _id: string;
  card_id: string;
  card_name: string;
  image_url?: string;
  card_link?: string;
  package?: string;
  type?: string;
  color?: string;
  effects?: string[];
  race?: string;
  level?: string;
  cost?: string;
  ap?: string;
  hp?: string;
  zone?: string;
  link?: string;
  source_title?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CardListResponse {
  total: number;
  limit: number;
  skip: number;
  cards: Card[];
}

export interface StatItem {
  name: string | null;
  count: number;
}

export interface CardStatsResponse {
  total_cards: number;
  by_type: StatItem[];
  by_color: StatItem[];
  by_package: StatItem[];
}

export interface FiltersResponse {
  types: string[];
  colors: string[];
  races: string[];
  packages: string[];
}

export interface CardSearchParams {
  search?: string;
  card_type?: string;
  color?: string;
  race?: string;
  package?: string;
  limit?: number;
  skip?: number;
}
