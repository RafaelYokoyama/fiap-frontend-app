# Integrantes do Grupo

| RM       | NOME                 |
| -------- | -------------------- |
| RM364993 | Fábio Ivo Silva      |
| RM362550 | Rafael Gava Yokoyama |

# StitchAsk – Estudo de Vocabulário

Projeto front-end educacional para estudo e expansão de vocabulário. Consome uma API REST para exibir palavras, definições e exemplos de uso, com interface moderna (tema Stitch), busca em tempo real, favoritos e síntese de voz.

---

## 1. Visão Geral

### Propósito

**StitchAsk** é uma aplicação web de perguntas e respostas / vocabulário: o usuário faz perguntas, vê palavras com definição e exemplo de uso, pode favoritar, buscar e ouvir o texto em voz alta. A API pode retornar uma lista no formato `{ word, description, useCase }`.

### Público-alvo

- Estudantes que desejam ampliar vocabulário
- Projetos que precisem de exemplo de SPA React + Vite consumindo API com tratamento de loading, erro e CORS (proxy em dev)

### Funcionalidades

- Perguntas e respostas via API
- Lista de palavras com **word**, **description** e **useCase**
- Busca por pergunta, resposta ou exemplo
- Favoritos (persistidos em `localStorage`)
- Texto em voz alta (Web Speech API)
- Carregamento inicial da lista via GET na API
- Proxy em dev para API em `localhost:3000` (evitar CORS)

---

## 2. Stack

| Categoria    | Tecnologia       | Uso no projeto                  |
| ------------ | ---------------- | ------------------------------- |
| Front-end    | React 18         | UI e estado                     |
| Front-end    | TypeScript       | Tipagem (`.ts` / `.tsx`)        |
| Build        | Vite 5           | Dev server, build, HMR          |
| Estilo       | Tailwind CSS 3   | Estilização e tema              |
| Componentes  | Radix UI         | Accordion, dialog, select, etc. |
| Componentes  | shadcn/ui        | Button, Card, Input, Skeleton   |
| Ícones       | Lucide React     | Ícones                          |
| Roteamento   | React Router DOM | Rotas (Index, NotFound)         |
| Formulários  | React Hook Form  | Formulários                     |
| Notificações | Sonner           | Toasts                          |
| Testes       | Vitest           | Testes unitários                |
| Pacotes      | npm / pnpm       | Gerenciador de pacotes          |

---

## 3. Estrutura de Pastas

```
speak-your-mind-main/
├── public/                 # Assets estáticos
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── assets/             # Imagens e recursos (ex.: stitch-hero.png)
│   ├── components/         # Componentes da aplicação
│   │   ├── ui/             # Componentes shadcn/ui (button, card, dialog, etc.)
│   │   ├── WordCard.tsx    # Card de palavra/pergunta
│   │   ├── SkeletonCard.tsx
│   │   ├── FavoritesList.tsx
│   │   ├── MessageBubble.tsx
│   │   └── NavLink.tsx
│   ├── hooks/
│   │   ├── useChat.ts      # Estado das mensagens, API (GET/POST), favoritos
│   │   ├── useSpeech.ts    # Síntese de voz
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Index.tsx       # Página principal (perguntas, busca, favoritos)
│   │   └── NotFound.tsx
│   ├── test/               # Testes (Vitest)
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css           # Estilos globais e Tailwind
│   └── vite-env.d.ts       # Tipos (ex.: ImportMetaEnv)
├── .env                    # Variáveis de ambiente (VITE_ASK_API_URL)
├── index.html
├── vite.config.ts          # Porta 8080, proxy /api → localhost:3000
├── tailwind.config.ts
├── package.json
└── README.md
```

### Responsabilidade das pastas

- **`src/pages`**: páginas (Index = lista de perguntas/respostas e formulário; NotFound).
- **`src/components`**: componentes reutilizáveis; `ui/` = biblioteca shadcn.
- **`src/hooks`**: lógica reutilizável (useChat = API e favoritos; useSpeech = voz).
- **`src/lib`**: utilitários (ex.: `cn` para classes).
- **`src/assets`**: imagens e recursos estáticos.

---

## 4. Pré-requisitos

- **Node.js**: 18.x ou 20.x
- **npm**, **yarn** ou **pnpm**
- **Git**

Não é necessário rodar backend localmente; a aplicação usa a API no Render. Para testar com backend local na porta 3000, use o proxy (ver variáveis de ambiente).

---

## 5. Como rodar localmente

### Passo a passo

1. **Clonar o repositório**

   ```bash
   git clone https://github.com/RafaelYokoyama/fiap-frontend-app
   cd fiap-frontend-app
   ```

2. **Instalar dependências**

   ```bash
   pnpm install
   # ou: npm install | yarn install
   ```

3. **Variáveis de ambiente (opcional)**

   Crie um arquivo `.env` na raiz se quiser outra URL da API (veja seção 6). O projeto já tem fallback para a API no Render.

4. **Iniciar o servidor de desenvolvimento**

   ```bash
   pnpm dev
   # ou: npm run dev | yarn dev
   ```

5. **Acessar no navegador**
   - URL local: **http://localhost:8080** (porta configurada no `vite.config.ts`)

### URLs do projeto

| Ambiente    | URL                                             |
| ----------- | ----------------------------------------------- |
| API (BFF)   | `https://fiap-backend-bff-app.onrender.com/ask` |
| App (local) | `http://localhost:8080`                         |

### Build para produção

```bash
pnpm run build
# ou: npm run build | yarn build
```

A saída fica em `dist/`. Pré-visualizar:

```bash
pnpm run preview
# ou: npx vite preview
```

---

## 6. Variáveis de ambiente

| Variável             | Obrigatória | Descrição                                                                                                          |
| -------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------ |
| `VITE_ASK_API_URL`   | Não         | URL do endpoint da API (GET lista inicial, POST pergunta). Padrão: `https://fiap-backend-bff-app.onrender.com/ask` |
| `VITE_WORDS_API_URL` | Não         | URL só para carregar a lista inicial (GET). Se não definida, usa `VITE_ASK_API_URL`.                               |

**Exemplo de `.env` na raiz:**

```env
VITE_ASK_API_URL=https://fiap-backend-bff-app.onrender.com/ask
```

Para usar **backend local** na porta 3000 sem CORS, não defina `VITE_ASK_API_URL` (ou use `http://localhost:3000/ask`). Em desenvolvimento o código usa o proxy: requisições para `/api/ask` são encaminhadas para `http://localhost:3000/ask`.

No Vite, só variáveis com prefixo `VITE_` são expostas ao cliente (`import.meta.env.VITE_...`).

---

## 7. API

- **GET** (lista inicial): retorno esperado é um array no formato:

  ```json
  [
    {
      "word": "Enhance",
      "description": "To improve the quality, value, or extent of something.",
      "useCase": "The new software update will enhance the user experience."
    }
  ]
  ```

  Ou o array dentro de `words` ou `answer` no JSON.

- **POST** (pergunta): body `{ "question": "texto" }`. Pode retornar o mesmo formato de array acima ou um objeto com `answer` / `response` / `message`.

---

## 8. Deploy

O projeto é uma **SPA estática**. Build: `pnpm run build`; publicar o conteúdo da pasta `dist/`.

### Sugestões de hospedagem

- **Vercel** / **Netlify** / **Render (Static Site)**: conectar o repositório, comando de build `pnpm run build`, diretório público `dist`.
- **GitHub Pages**: configurar `base` no `vite.config.ts` se o app rodar em um subpath.

No painel do serviço, configurar `VITE_ASK_API_URL` (e opcionalmente `VITE_WORDS_API_URL`) se a API de produção for outra.

---

## 9. Scripts

| Script       | Comando               | Descrição                         |
| ------------ | --------------------- | --------------------------------- |
| Dev          | `pnpm dev`            | Servidor em http://localhost:8080 |
| Build        | `pnpm run build`      | Gera `dist/`                      |
| Preview      | `pnpm run preview`    | Pré-visualiza o build             |
| Lint         | `pnpm run lint`       | ESLint                            |
| Testes       | `pnpm run test`       | Vitest (run)                      |
| Testes watch | `pnpm run test:watch` | Vitest em modo watch              |

## 📄 Relatório em PDF

## 10. Boas práticas

🔗 [Relatório Final – Front-end Engineering (PDF)](metricas-lighthouse.pdf)
