import { Wand2 } from "lucide-react";

const examples = [
  "cheap studio in New York",
  "family house near schools",
  "luxury villa with pool near beach",
  "apartment downtown with parking",
  "quiet eco house with garden",
];

export default function AiSearchBar({ aiQuery, setAiQuery, runAiSearch }) {
  return (
    <div className="mt-8 rounded-md border border-white/10 bg-white/10 p-4 backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Wand2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-300" />

          <input
            value={aiQuery}
            onChange={(event) => setAiQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") runAiSearch();
            }}
            placeholder="Try: family house near schools"
            className="h-14 w-full rounded-md border border-white/10 bg-slate-900/80 pl-12 pr-4 text-white outline-none ring-blue-500/40 placeholder:text-slate-500 focus:ring-4"
          />
        </label>

        <button
          onClick={() => runAiSearch()}
          className="h-14 rounded-md bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-500"
        >
          AI Search
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example}
            onClick={() => runAiSearch(example)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}