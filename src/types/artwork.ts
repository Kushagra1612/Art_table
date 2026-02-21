
export type Artwork = {
  id: number;
  title: string | null;
  place_of_origin?: string | null;
  artist_display?: string | null;
  inscriptions?: string | null;
  date_start?: number | null;
  date_end?: number | null;
};

export type Pagination = {
  total: number;
  limit: number;
  total_pages: number;
  current_page: number;
};

export type ArtworkApiResponse = {
  data: Artwork[];
  pagination: Pagination;
};