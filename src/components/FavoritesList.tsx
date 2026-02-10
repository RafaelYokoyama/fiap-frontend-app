import { Heart, Volume2, Trash2 } from "lucide-react";

interface FavoriteItem {
  id: string;
  question: string;
  answer: string;
  timestamp: number;
}

interface FavoritesListProps {
  favorites: FavoriteItem[];
  onRemove: (id: string) => void;
  onSpeak: (text: string, id: string) => void;
  speakingId: string | null;
}

const FavoritesList = ({ favorites, onRemove, onSpeak, speakingId }: FavoritesListProps) => {
  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Heart className="mb-3 h-10 w-10 opacity-30" />
        <p className="font-display text-lg">Nenhum favorito ainda!</p>
        <p className="text-sm">Clica no ❤️ pra salvar respostas</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {favorites.map((fav) => (
        <div
          key={fav.id}
          className="animate-slide-up rounded-xl bg-card p-4 shadow-card"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            {fav.question}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-card-foreground">
            {fav.answer}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => onSpeak(fav.answer, fav.id)}
              className="rounded-full p-1.5 transition-all hover:bg-muted"
            >
              <Volume2
                className={`h-4 w-4 ${
                  speakingId === fav.id ? "text-primary animate-pulse" : "text-muted-foreground"
                }`}
              />
            </button>
            <button
              onClick={() => onRemove(fav.id)}
              className="rounded-full p-1.5 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FavoritesList;
