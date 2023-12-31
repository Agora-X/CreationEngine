import { SearchQuery, Source } from "@/types";
import { IconArrowRight, IconBolt, IconSearch } from "@tabler/icons-react";
import endent from "endent";
import { FC, KeyboardEvent, useEffect, useRef, useState } from "react";

interface SearchProps {
  onSearch: (searchResult: SearchQuery) => void;
  onAnswerUpdate: (answer: string) => void;
  onDone: (done: boolean) => void;
}

export const Search: FC<SearchProps> = ({
  onSearch,
  onAnswerUpdate,
  onDone,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query) {
      alert("Please enter a query");
      return;
    }

    setLoading(true);
    await handleStream(query);
  };

  const api_key = () => {
    process.env.OPENAI_API_KEY
  }


  const handleStream = async (query: string) => {
    try {
      const prompt = endent`Provide a 2-3 sentence answer to the query based on the following sources. Be original, concise, accurate, and helpful. Cite sources as [1] or [2] or [3] after each sentence (not just the very end) to back up your answer (Ex: Correct: [1], Correct: [2][3], Incorrect: [1, 2]).
      
      ${query}`;

      const response = await fetch("/api/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error(response.statusText);
      }

      setLoading(false);

      const data = response.body;

      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        onAnswerUpdate(chunkValue);
      }

      onDone(true);
    } catch (err) {
      onAnswerUpdate("Error");
    }
  };

  const generateImage = async (prompt: string) => {
    const response = await fetch("/api/img_generation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setImageUrl(url);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSave = () => {
    if (apiKey.length !== 51) {
      alert("Please enter a valid API key.");
      return;
    }

    localStorage.setItem("CREATION_KEY", apiKey);

    setShowSettings(false);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    localStorage.removeItem("CREATION_KEY");

    setApiKey("");
  };

  useEffect(() => {
    const CREATION_KEY = localStorage.getItem("CREATION_KEY");

    if (CREATION_KEY) {
      setApiKey(CREATION_KEY);
    } else {
      setShowSettings(true);
    }

    inputRef.current?.focus();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center pt-64 sm:pt-72 flex-col">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <div className="mt-8 text-2xl">Creating..</div>
        </div>
      ) : (
        <div className="mx-auto flex h-full w-full max-w-[750px] flex-col items-center space-y-6 px-3 pt-32 sm:pt-64">
          <div className="flex items-center">
            <IconBolt size={36} />
            <div className="ml-1 text-center text-4xl">Creation Engine</div>
          </div>

            <div className="relative w-full">
              <IconSearch className="text=[#D4D4D8] absolute top-3 w-10 left-1 h-6 rounded-full opacity-50 sm:left-3 sm:top-4 sm:h-8" />

              <input
                ref={inputRef}
                className="h-12 w-full rounded-md border border-cyan-600 bg-[#2A2A31] pr-12 pl-11 focus:border-violet-800 focus:bg-[#18181C] focus:outline-none focus:ring-2 focus:ring-zinc-800 sm:h-16 sm:py-2 sm:pr-16 sm:pl-16 sm:text-lg"
                type="text"
                placeholder="Create Anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <button>
                <IconArrowRight
                  onClick={handleSearch}
                  className="absolute right-2 top-2.5 h-7 w-7 rounded-full bg-blue-500 p-1 hover:cursor-pointer hover:bg-blue-600 sm:right-3 sm:top-3 sm:h-10 sm:w-10"
                />
              </button>
            </div>
        </div>
      )}
    </>
  );
};
