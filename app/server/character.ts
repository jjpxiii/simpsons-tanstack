import { createServerFn } from "@tanstack/react-start";

export const getCharacter = createServerFn({ method: "GET" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const response = await fetch(`https://thesimpsonsapi.com/api/characters/${id}`);

    if (!response.ok) {
      return null;
    }

    return response.json();
  });
