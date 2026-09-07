import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("http://localhost:8080/api/stocks", () => HttpResponse.json({
    content: [], totalElements: 0, totalPages: 0, size: 20, number: 0, first: true, last: true, empty: true,
  })),
];
