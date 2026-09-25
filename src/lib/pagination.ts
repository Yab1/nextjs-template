export type PageParams = {
  page: number;
  pageSize: number;
};

export type PageResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export function toRange({ page, pageSize }: PageParams) {
  const safePage = Math.max(1, page);
  const safeSize = Math.max(1, pageSize);

  return {
    limit: safeSize,
    offset: (safePage - 1) * safeSize,
  };
}

export function pageCount(total: number, pageSize: number) {
  if (pageSize <= 0) {
    return 1;
  }

  return Math.max(1, Math.ceil(total / pageSize));
}
