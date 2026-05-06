import { useState } from "react";
import { Wand2 } from "lucide-react";

const examples = [
  "cheap studio in New York",
  "family house near schools",
  "luxury villa with pool near beach",
  "apartment downtown with parking",
  "quiet eco house with garden",
];

export default function AiSearchBar({
  aiQuery,
  setAiQuery,
  runAiSearch,
  generateProperties,
  isGenerating,
}) {
    const [activeExample, setActiveExample] = useState(null);
    
    return (
        <div className="mt-8 rounded-md border border-slate-200 bg-white/80 p-4 backdrop-blur dark:border-white/10 dark:bg-white/10">
            <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative flex-1">
                    <Wand2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-500 dark:text-orange-300" />

                    <input
                        value={aiQuery}
                        onChange={(event) => setAiQuery(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") runAiSearch();
                        }}
                        placeholder="Try: family house near schools"
                        className="h-14 w-full rounded-md border border-slate-200 bg-white pl-12 pr-4 text-slate-900 outline-none ring-orange-500/40 placeholder:text-slate-400 focus:ring-4 
                                dark:border-white/10 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500"
                    />
                </label>

                {/* <button
                    onClick={() => runAiSearch()}
                    className="h-14 rounded-md bg-orange-600 px-6 font-semibold text-white transition hover:bg-orange-500"
                    >
                    AI Search
                </button> */}


                <button
                    onClick={generateProperties}
                    disabled={isGenerating}
                    className="h-14 rounded-md bg-orange-600 px-6 font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                    {isGenerating ? "Generating..." : "AI listings"}
                </button>



            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {examples.map((example) => (
                <button
                    key={example}
                    onClick={() => {
                        if (activeExample === example) {
                            // повторний клік — скидаємо
                            setActiveExample(null);
                            runAiSearch(""); // або default
                        } else {
                            setActiveExample(example);
                            runAiSearch(example);
                        }
                    }}
                    className={`rounded-full border px-3 py-2 text-sm transition
                        ${
                            activeExample === example
                            ? "bg-orange-600 text-white border-orange-600 dark:bg-orange-500 dark:border-orange-500"
                            : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                        }
                      `}
                >
                    {example}
                </button>
                ))}
            </div>
        </div>
    );
}