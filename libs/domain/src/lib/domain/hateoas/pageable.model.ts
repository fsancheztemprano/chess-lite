export interface Pageable {
  page?: number;
  size?: number;
  sort?: string;
}

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}
