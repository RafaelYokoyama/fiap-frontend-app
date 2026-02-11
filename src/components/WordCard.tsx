import { Heart, Volume2, VolumeX, ArrowRight, BookOpen, MessageSquare } from "lucide-react";

interface WordCardProps {
  id: string;
  question: string;
  answer: string;
  useCase?: string;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSpeak: (text: string, id: string) => void;
  isCurrentlySpeaking: boolean;
  mastery?: number;
}

const WordCard = ({
  id,
  question,
  answer,
  useCase,
  isFavorite,
  onToggleFavorite,
  onSpeak,
  isCurrentlySpeaking,
  mastery = Math.floor(Math.random() * 100),
}: WordCardProps) => {
  const fullText = useCase ? `${answer}\n\nExemplo: ${useCase}` : answer;
  return (
    <div className="group bg-card p-6 rounded-xl shadow-sm border border-transparent card-hover flex flex-col animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-foreground tracking-tight line-clamp-2 flex-1 pr-2">
          {question}
        </h2>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onSpeak(fullText, id)}
            className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
            aria-label={isCurrentlySpeaking ? "Parar" : "Ouvir"}
          >
            {isCurrentlySpeaking ? (
              <VolumeX className="h-5 w-5 text-primary animate-pulse" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => onToggleFavorite(id)}
            className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
            aria-label={isFavorite ? "Remover favorito" : "Favoritar"}
          >
            <Heart
              className={`h-5 w-5 transition-all ${
                isFavorite ? "fill-primary text-primary" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div className="space-y-4 flex-grow">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <BookOpen className="h-3.5 w-3.5" />
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-70">Resposta</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed text-sm line-clamp-4">
            {fullText}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString("pt-BR")}
        </span>
        <button
          onClick={() => onSpeak(fullText, id)}
          className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
        >
          Ouvir <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default WordCard;
