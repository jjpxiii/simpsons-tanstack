import { createFileRoute } from "@tanstack/react-router";
import SearchTypeahead from "../components/SearchTypeahead";
import CharacterCard from "../components/CharacterCard";
import { getRandomCharacter } from "../server/random";

export const Route = createFileRoute("/")({
  loader: async () => {
    const character = await getRandomCharacter();
    return { randomCharacter: character };
  },
  pendingComponent: () => (
    <div className="flex flex-col items-center justify-center space-y-10 min-h-[60vh]">
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-simpsons-blue"></div>
      </div>
    </div>
  ),
  component: HomeComponent,
});

function HomeComponent() {
  const { randomCharacter } = Route.useLoaderData();

  return (
    <div className="flex flex-col items-center justify-center space-y-10 min-h-[60vh]">
      <div className="text-center space-y-4">
        <h1
          className="text-5xl md:text-6xl font-sans font-bold text-simpsons-yellow drop-shadow-[0_4px_0_#000] tracking-wider"
          style={{ WebkitTextStroke: "2px black" }}
        >
          SIMPSONS SEARCH
        </h1>
        <p className="text-xl font-medium text-slate-700">
          The most cromulent search engine on the web.
        </p>
      </div>

      <div className="w-full max-w-lg space-y-6">
        <SearchTypeahead />

        {randomCharacter ? (
          <div className="transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <p className="text-center text-gray-500 mb-2 font-bold uppercase tracking-widest text-xs">
              Featured Character
            </p>
            <CharacterCard character={randomCharacter} variant="large" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
