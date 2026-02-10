import { createFileRoute, Link } from "@tanstack/react-router";
import { getCharacter } from "../../server/character";

interface CharacterDetails {
  id: number | string;
  name: string;
  portrait_path: string;
  occupation?: string;
  description?: string;
  phrases?: string[];
  gender?: string;
  status?: string;
  born?: string;
}

export const Route = createFileRoute("/character/$id")({
  loader: async ({ params: { id } }) => {
    const character = await getCharacter({ data: id });
    return { character: character as CharacterDetails | null };
  },
  pendingComponent: () => (
    <div className="text-center mt-20 text-2xl animate-pulse">Loading...</div>
  ),
  component: CharacterDetailsComponent,
});

function CharacterDetailsComponent() {
  const { character } = Route.useLoaderData();

  if (!character) {
    return <div className="text-center mt-20 text-2xl">Character not found.</div>;
  }

  const imageUrl = `https://cdn.thesimpsonsapi.com/500${character.portrait_path}`;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-black">
      <div className="md:flex">
        <div className="md:w-1/2 bg-simpsons-yellow p-8 flex items-center justify-center border-r-4 border-black">
          <img
            src={imageUrl}
            alt={character.name}
            className="max-h-[500px] object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="md:w-1/2 p-8 flex flex-col justify-center bg-sky-50">
          <h1 className="text-4xl font-bold mb-2 text-simpsons-blue">{character.name}</h1>
          {character.occupation && (
            <h2 className="text-xl text-gray-600 mb-6 font-semibold">{character.occupation}</h2>
          )}

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="font-bold text-gray-400 text-xs uppercase tracking-wide">
                Status
              </span>
              <p className="text-lg">{character.status || "Unknown"}</p>
            </div>

            {character.gender && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <span className="font-bold text-gray-400 text-xs uppercase tracking-wide">
                  Gender
                </span>
                <p className="text-lg">{character.gender}</p>
              </div>
            )}

            {character.phrases && character.phrases.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold text-simpsons-red text-lg mb-2">Famous Quotes</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 italic">
                  {character.phrases.slice(0, 3).map((phrase, i) => (
                    <li key={i}>"{phrase}"</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link to="/" className="text-simpsons-blue hover:underline font-bold">
              &larr; Back to Search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
