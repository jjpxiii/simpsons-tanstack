import { createFileRoute } from "@tanstack/react-router";
import CharacterCard from "../components/CharacterCard";
import { searchCharacters } from "../server/search";

type ResultsSearch = {
  q: string;
};

export const Route = createFileRoute("/results")({
  validateSearch: (search: Record<string, unknown>): ResultsSearch => ({
    q: (search.q as string) || "",
  }),
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: async ({ deps: { q } }) => {
    if (!q) return { results: [], query: "" };
    const results = await searchCharacters({ data: q });
    return { results, query: q };
  },
  pendingComponent: () => (
    <div className="space-y-6">
      <div className="border-b-4 border-simpsons-yellow pb-4">
        <h2 className="text-3xl font-bold text-slate-800">Searching...</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    </div>
  ),
  component: ResultsComponent,
});

function ResultsComponent() {
  const { results, query } = Route.useLoaderData();
  const { q } = Route.useSearch();

  const displayQuery = query || q;

  return (
    <div className="space-y-6">
      <div className="border-b-4 border-simpsons-yellow pb-4">
        <h2 className="text-3xl font-bold text-slate-800">
          Results for <span className="text-simpsons-blue">"{displayQuery}"</span>
        </h2>
        <p className="text-gray-500 mt-1">Found {results.length} characters</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((char: any) => (
          <CharacterCard key={char.id} character={char} />
        ))}
        {results.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-xl text-gray-500">D'oh! No characters found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
