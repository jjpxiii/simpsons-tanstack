import { createServerFn } from "@tanstack/react-start";

export const getRandomCharacter = createServerFn({ method: "GET" }).handler(async () => {
  const randomPage = Math.floor(Math.random() * 60) + 1;

  const response = await fetch(`https://thesimpsonsapi.com/api/characters?page=${randomPage}`);
  const data: any = await response.json();

  if (data.results && data.results.length > 0) {
    return data.results[Math.floor(Math.random() * data.results.length)];
  }

  return null;
});
