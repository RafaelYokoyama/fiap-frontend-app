import { useState, useRef } from 'react'
import { Send, Search, Bell, Heart, Loader2, BookOpen } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { useSpeech } from '@/hooks/useSpeech'
import WordCard from '@/components/WordCard'
import SkeletonCard from '@/components/SkeletonCard'
import stitchImg from '@/assets/stitch-hero.png'

const Index = () => {
  const [input, setInput] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const {
    messages,
    favorites,
    isLoading,
    isLoadingInitial,
    ask,
    toggleFavorite,
    removeFavorite
  } = useChat()
  const { speak, stop, isSpeaking, speakingId } = useSpeech()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const q = input.trim()
    if (!q || isLoading) return
    setInput('')
    await ask(q)
    inputRef.current?.focus()
  }

  const filteredMessages = searchFilter
    ? messages.filter(
        (m) =>
          m.question.toLowerCase().includes(searchFilter.toLowerCase()) ||
          m.answer.toLowerCase().includes(searchFilter.toLowerCase()) ||
          (m.useCase?.toLowerCase().includes(searchFilter.toLowerCase()) ?? false)
      )
    : messages

  return (
    <div className='min-h-screen bg-background'>
      <header className='sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-primary/10'>
        <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
              <span className='material-icons text-primary-foreground text-lg'>
                auto_stories
              </span>
            </div>
            <span className='text-xl font-bold tracking-tight text-primary'>
              StitchAsk
            </span>
          </div>

          <div className='hidden md:flex flex-1 max-w-md mx-8'>
            <div className='relative w-full'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <input
                className='w-full bg-secondary border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary/50 text-sm outline-none'
                placeholder='Buscar perguntas e respostas...'
                type='text'
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <button className='p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors'>
              <Bell className='h-5 w-5' />
            </button>
            <div className='flex items-center gap-2 pl-4 border-l border-border'>
              <img
                src={stitchImg}
                alt='Stitch'
                className='w-8 h-8 rounded-full object-cover border-2 border-primary/20'
              />
              <span className='text-sm font-medium hidden lg:block'>
                Stitch
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-6 py-8'>
        <section className='mb-10 p-8 md:p-12 bg-primary/10 rounded-xl border border-primary/20 relative overflow-hidden'>
          <div className='relative z-10 max-w-2xl'>
            <h1 className='text-3xl md:text-4xl font-bold text-foreground mb-2'>
              Aloha, Learner! 🌺
            </h1>
            <p className='text-lg text-muted-foreground'>
              Faça perguntas e expanda seu conhecimento. Você já fez{' '}
              <strong className='text-primary'>{messages.length}</strong>{' '}
              perguntas!
            </p>
            <form onSubmit={handleSubmit} className='mt-6 flex gap-3'>
              <input
                ref={inputRef}
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Pergunte qualquer coisa...'
                disabled={isLoading}
                className='flex-1 bg-card border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 outline-none disabled:opacity-50'
              />
              <button
                type='submit'
                disabled={isLoading || !input.trim()}
                className='bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-40 flex items-center gap-2'
              >
                {isLoading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Send className='h-4 w-4' />
                )}
                Perguntar
              </button>
            </form>
          </div>
          <div className='absolute right-[-5%] top-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl' />
          <div className='absolute right-8 bottom-2 hidden lg:block'>
            <img
              src={stitchImg}
              alt=''
              className='h-32 w-32 object-contain opacity-20'
            />
          </div>
        </section>
        {favorites.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-lg font-bold text-foreground mb-4 flex items-center gap-2'>
              <Heart className='h-5 w-5 text-primary fill-primary' />
              Favoritos ({favorites.length})
            </h2>
            <div className='flex gap-4 overflow-x-auto pb-2'>
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  className='min-w-[250px] max-w-[300px] bg-card p-4 rounded-xl border border-primary/20 shadow-sm shrink-0'
                >
                  <p className='text-xs font-bold uppercase tracking-wide text-primary truncate'>
                    {fav.question}
                  </p>
                  <p className='mt-1 text-sm text-muted-foreground line-clamp-2'>
                    {fav.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='mb-6'>
          <h2 className='text-2xl font-bold text-foreground'>Suas Perguntas</h2>
          <p className='text-muted-foreground'>
            Explore suas perguntas e respostas recentes.
          </p>
        </div>

        {filteredMessages.length === 0 && !isLoading && !isLoadingInitial ? (
          <div className='bg-card/50 p-12 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center'>
            <div className='w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4'>
              <BookOpen className='h-8 w-8 text-muted-foreground' />
            </div>
            <h3 className='text-muted-foreground font-medium text-lg'>
              Nenhuma pergunta ainda
            </h3>
            <p className='text-sm text-muted-foreground mt-2'>
              Use o campo acima para fazer sua primeira pergunta!
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {(isLoadingInitial ? [] : filteredMessages).map((msg) => (
              <WordCard
                key={msg.id}
                id={msg.id}
                question={msg.question}
                answer={msg.answer}
                useCase={msg.useCase}
                isFavorite={msg.isFavorite}
                onToggleFavorite={toggleFavorite}
                onSpeak={speak}
                isCurrentlySpeaking={speakingId === msg.id}
              />
            ))}
            {(isLoading || isLoadingInitial) && (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            )}
          </div>
        )}
      </main>
      <footer className='mt-20 border-t border-border bg-card py-12'>
        <div className='max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-6 h-6 bg-primary rounded flex items-center justify-center'>
                <span className='material-icons text-primary-foreground text-[14px]'>
                  auto_stories
                </span>
              </div>
              <span className='text-lg font-bold tracking-tight text-foreground'>
                StitchAsk
              </span>
            </div>
            <p className='text-muted-foreground max-w-sm text-sm leading-relaxed'>
              Seu assistente de perguntas e respostas com Stitch. Ohana
              significa família! 🌺
            </p>
          </div>
          <div>
            <h4 className='font-bold mb-4 text-sm uppercase tracking-wider text-foreground'>
              Recursos
            </h4>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>Perguntas e Respostas</li>
              <li>Favoritos</li>
              <li>Texto em Voz Alta</li>
            </ul>
          </div>
          <div>
            <h4 className='font-bold mb-4 text-sm uppercase tracking-wider text-foreground'>
              Sobre
            </h4>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>API: adrianorabello.com/ask</li>
              <li>Stitch Theme 💙</li>
            </ul>
          </div>
        </div>
        <div className='max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-border text-center text-xs text-muted-foreground'>
          © 2026 StitchAsk. Ohana! 🌺
        </div>
      </footer>
    </div>
  )
}

export default Index
