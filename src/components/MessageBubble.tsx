import { Heart, Volume2, VolumeX } from 'lucide-react'

interface MessageBubbleProps {
  question: string
  answer: string
  isFavorite: boolean
  id: string
  onToggleFavorite: (id: string) => void
  onSpeak: (text: string, id: string) => void
  isSpeaking: boolean
  isCurrentlySpeaking: boolean
}

const MessageBubble = ({
  question,
  answer,
  isFavorite,
  id,
  onToggleFavorite,
  onSpeak,
  isSpeaking,
  isCurrentlySpeaking
}: MessageBubbleProps) => {
  return (
    <div className='animate-slide-up space-y-2'>
      <div className='flex justify-end'>
        <div className='max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-foreground'>
          <p className='text-sm font-semibold'>{question}</p>
        </div>
      </div>

      <div className='flex justify-start'>
        <div className='max-w-[80%] rounded-2xl rounded-bl-md bg-card px-4 py-3 shadow-card'>
          <p className='text-sm leading-relaxed text-card-foreground'>
            {answer}
          </p>
          <div className='mt-2 flex items-center gap-2'>
            <button
              onClick={() => onToggleFavorite(id)}
              className='group rounded-full p-1.5 transition-all hover:bg-muted'
              aria-label={isFavorite ? 'Remover favorito' : 'Favoritar'}
            >
              <Heart
                className={`h-4 w-4 transition-all ${
                  isFavorite
                    ? 'fill-accent text-accent scale-110'
                    : 'text-muted-foreground group-hover:text-accent'
                }`}
              />
            </button>
            <button
              onClick={() => onSpeak(answer, id)}
              className='group rounded-full p-1.5 transition-all hover:bg-muted'
              aria-label={isCurrentlySpeaking ? 'Parar' : 'Ouvir'}
            >
              {isCurrentlySpeaking ? (
                <VolumeX className='h-4 w-4 text-primary animate-pulse' />
              ) : (
                <Volume2 className='h-4 w-4 text-muted-foreground group-hover:text-primary' />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
