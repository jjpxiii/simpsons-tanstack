import { createServerFn } from "@tanstack/react-start";

let cachedCharacters: any[] | null = null;

async function getAllCharacters() {
  if (cachedCharacters) return cachedCharacters;

  const pages = Array.from({ length: 60 }, (_, i) => i + 1);
  const fetches = pages.map((page) =>
    fetch(`https://thesimpsonsapi.com/api/characters?page=${page}`).then((r) => r.json()),
  );

  const results = await Promise.all(fetches);
  cachedCharacters = [];
  results.forEach((data: any) => {
    if (data.results) {
      cachedCharacters!.push(...data.results);
    }
  });

  return cachedCharacters;
}

export const searchCharacters = createServerFn({ method: "GET" })
  .inputValidator((query: string) => query)
  .handler(async ({ data: query }) => {
    const allCharacters = await getAllCharacters();

    const filtered = allCharacters.filter((char: any) =>
      char.name.toLowerCase().includes(query.toLowerCase()),
    );

    return filtered.slice(0, 10);
  });
