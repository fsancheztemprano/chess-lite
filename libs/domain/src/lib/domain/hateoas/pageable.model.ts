export interface Pageable {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
}

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}
