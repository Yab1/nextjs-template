export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function api<T>(path: string, options: RequestOptions = {}) {
  const { body, headers, ...rest } = options;
  const response = await fetch(path, {
    ...rest,
    credentials: "include",
    cache: "no-store",
    headers: {
      ...(body === undefined ? {} : { "content-type": "application/json" }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => null)) as
    { message?: string } | T | null;

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      payload.message
        ? payload.message
        : "Request failed";
    throw new ApiError(message, response.status);
  }

  return payload as T;
}
