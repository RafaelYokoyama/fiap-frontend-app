import { useState, useCallback, useEffect } from "react";

export interface Message {
  id: string;
  question: string;
  answer: string;
  useCase?: string;
  isFavorite: boolean;
  timestamp: number;
}

/** Formato que a API local pode retornar: lista de palavras */
interface ApiWordItem {
  word: string;
  description: string;
  useCase?: string;
}

function isWordArray(arr: unknown): arr is ApiWordItem[] {
  return (
    Array.isArray(arr) &&
    arr.length > 0 &&
    arr.every(
      (x) =>
        x &&
        typeof x === "object" &&
        "word" in x &&
        "description" in x &&
        typeof (x as ApiWordItem).word === "string" &&
        typeof (x as ApiWordItem).description === "string"
    )
  );
}

const FAVORITES_KEY = "stitch-favorites";

function loadFavorites(): Message[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites: Message[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [favorites, setFavorites] = useState<Message[]>(loadFavorites);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // URL da API: .env (VITE_ASK_API_URL). Só usa proxy em dev quando for localhost:3000.
  const envUrl = import.meta.env.VITE_ASK_API_URL?.trim() ?? "";
  const defaultUrl = "https://adrianorabello.com/ask";
  const baseApiUrl =  defaultUrl || envUrl;
  const apiUrl =
    import.meta.env.DEV && baseApiUrl.includes("localhost:3000")
      ? "/api/ask"
      : baseApiUrl;
  const wordsUrl = import.meta.env.VITE_WORDS_API_URL?.trim() || apiUrl;

 
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const parseAndSet = (data: unknown) => {
        const obj = data as Record<string, unknown>;
        const rawArray = Array.isArray(data) ? data : obj?.words ?? obj?.answer;
        if (!isWordArray(rawArray)) return;
        const newMsgs: Message[] = rawArray.map((item) => ({
          id: crypto.randomUUID(),
          question: item.word,
          answer: item.description,
          useCase: item.useCase,
          isFavorite: false,
          timestamp: Date.now(),
        }));
        setMessages(newMsgs);
      };
      try {
        let res = await fetch(wordsUrl, { method: "GET" });
        if (cancelled) return;
        if (!res.ok) {
          res = await fetch(wordsUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          });
        }
        if (cancelled || !res.ok) return;
        const contentType = res.headers.get("content-type");
        if (!contentType?.includes("application/json")) return;
        const data: unknown = await res.json();
        if (cancelled) return;
        parseAndSet(data);
      } catch {
        // API pode não suportar GET ou estar offline
      } finally {
        if (!cancelled) setIsLoadingInitial(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [wordsUrl]);

  const ask = useCallback(async (question: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        const text = await res.text();
        const isRateLimit = res.status === 429 || res.status === 503;
        if (isRateLimit) {
          throw new Error("RATE_LIMIT");
        }
        let detail = `Erro ${res.status}`;
        try {
          const json = JSON.parse(text);
          detail = json.message || json.error || detail;
        } catch {
          if (text.length < 200) detail = text || detail;
        }
        throw new Error(detail);
      }

      const contentType = res.headers.get("content-type");
      let data: unknown;
      if (contentType?.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { answer: text || "Resposta em texto." };
      }

      const obj = data as Record<string, unknown>;
      const rawArray = Array.isArray(data) ? data : obj?.words ?? obj?.answer;
      if (isWordArray(rawArray)) {
        const newMsgs: Message[] = rawArray.map((item) => ({
          id: crypto.randomUUID(),
          question: item.word,
          answer: item.description,
          useCase: item.useCase,
          isFavorite: false,
          timestamp: Date.now(),
        }));
        setMessages((prev) => [...prev, ...newMsgs]);
        return newMsgs[0];
      }

      const answer =
        typeof data === "string"
          ? data
          : obj?.answer ?? obj?.response ?? obj?.message ?? JSON.stringify(data);

      const msg: Message = {
        id: crypto.randomUUID(),
        question,
        answer: String(answer),
        isFavorite: false,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, msg]);
      return msg;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro desconhecido";
      const isRateLimit = message === "RATE_LIMIT";
      const isNetwork =
        message === "Failed to fetch" ||
        message.includes("NetworkError") ||
        message.includes("CORS");
      let answer: string;
      if (isRateLimit) {
        answer =
          "A API está limitando requisições no momento. Por favor, aguarde alguns instantes antes de tentar novamente. 🌺";
      } else if (isNetwork) {
        answer =
          "Ohana! Não consegui conectar (rede ou CORS). Usa uma API na mesma origem ou configura um proxy. 🌺";
      } else {
        answer = `Erro: ${message}. Tenta de novo! 🌺`;
      }
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        question,
        answer,
        isFavorite: false,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      return errorMsg;
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  const toggleFavorite = useCallback((id: string) => {
    setMessages((prev) => {
      const updated = prev.map((m) =>
        m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
      );
      const newFavs = updated.filter((m) => m.isFavorite);
      // Also include existing favorites not in current session
      setFavorites((oldFavs) => {
        const sessionFavIds = new Set(updated.map((m) => m.id));
        const keptOldFavs = oldFavs.filter((f) => !sessionFavIds.has(f.id));
        const allFavs = [...keptOldFavs, ...newFavs];
        saveFavorites(allFavs);
        return allFavs;
      });
      return updated;
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      saveFavorites(updated);
      return updated;
    });
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isFavorite: false } : m))
    );
  }, []);

  return {
    messages,
    favorites,
    isLoading,
    isLoadingInitial,
    ask,
    toggleFavorite,
    removeFavorite,
  };
}
