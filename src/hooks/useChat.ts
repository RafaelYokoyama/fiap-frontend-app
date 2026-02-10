import { useState, useCallback } from "react";

interface Message {
  id: string;
  question: string;
  answer: string;
  isFavorite: boolean;
  timestamp: number;
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

  const ask = useCallback(async (question: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("https://adrianorabello.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) throw new Error(`Erro ${res.status}`);

      const data = await res.json();
      const answer = typeof data === "string" ? data : data.answer || data.response || data.message || JSON.stringify(data);

      const msg: Message = {
        id: crypto.randomUUID(),
        question,
        answer,
        isFavorite: false,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, msg]);
      return msg;
    } catch (err) {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        question,
        answer: "Ohana! Não consegui conectar agora. Tenta de novo! 🌺",
        isFavorite: false,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      return errorMsg;
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  return { messages, favorites, isLoading, ask, toggleFavorite, removeFavorite };
}
