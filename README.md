# 📐 JOVI Math — Sprint 2: Web Development

> **Funcionalidade nativa de câmera** impulsionada por IA (Gemini) para resolução passo a passo de equações matemáticas.

---

## 👥 Equipe — Grupo F.D.P.

| Nome | RM | Função |
|---|---|---|
| Andrey Luigi | RM569575 | 
| Henrique da Silva | RM569137 | 
| Gabriel Juarez | RM563680 | 
| Nicolas Marçal | RM565982 |

**Instituição:** FIAP — Faculdade de Informática e Administração Paulista  
**Disciplina:** Web Development  
**Sprint:** Sprint 2 — JavaScript  
**Data de entrega:** 15 de maio de 2026

---

## 🎯 Sobre o Projeto

O **JOVI Math** simula uma funcionalidade nativa de câmera de smartphone que usa OCR para ler equações matemáticas de cadernos e retorna um *Bottom Sheet* com a resolução passo a passo, gerada pela IA Gemini.

**Público-alvo:** Lucas, estudante universitário de engenharia que precisa entender o *porquê* da resolução, não apenas a resposta final.

---

## 📁 Estrutura de Arquivos

```
jovi-math/
├── login.html      → Página de autenticação (formulário com validação JS)
├── index.html      → Simulador da câmera com Bottom Sheet
├── sobre.html      → Página "Sobre" com carrossel/slideshow
├── equipe.html     → Apresentação da equipe
├── style.css       → Estilos globais (Dark Mode + Glassmorphism)
├── script.js       → Toda a lógica JS (Vanilla, zero frameworks)
└── README.md       → Este arquivo
```

---

## ✅ Requisitos da Rubrica Atendidos

| Critério | Implementação | Arquivo |
|---|---|---|
| **Vanilla JS** (zero frameworks) | Zero React/Vue/jQuery | `script.js` |
| **Manipulação de DOM e Eventos** | `querySelector` + `addEventListener` em todas as abas e modais | `script.js` |
| **Validação de formulários e login** | Verificação de e-mail vazio, formato e senha mínima | `login.html` + `script.js` |
| **localStorage** | Salva e recupera o nome do usuário entre páginas | `script.js` |
| **alert()** | Erros de login e confirmação de cópia | `script.js` |
| **prompt()** | Botão ⚙️ de configurações pergunta o nome do usuário | `script.js` |
| **Slideshow de imagens** | 5 slides com botões Prev/Next, dots e swipe | `sobre.html` + `script.js` |
| **Manipulação de Strings** | `capitalizeName()`, Template Literals, injeção no DOM | `script.js` |
| **Template Literals** | Usados em saudações, títulos e transformações CSS | `script.js` |
| **Comentários explicativos** | Todos os módulos documentados com JSDoc | `script.js` |
| **let e const** | `const` para funções e referências, `let` para estado mutável | `script.js` |
| **README.md** | Este arquivo com RMs e instruções | `README.md` |

---

## 🚀 Como Rodar o Projeto

### Opção 1 — Abrir diretamente (mais simples)

1. Faça o download do `.zip` ou clone o repositório
2. Abra o arquivo `login.html` em qualquer navegador moderno
3. Navegue pelas páginas pelo menu inferior

> ⚠️ Sem servidor local, o `localStorage` pode não funcionar em alguns navegadores com `file://`. Use a Opção 2 se isso ocorrer.

### Opção 2 — Servidor local com VS Code

1. Instale a extensão **Live Server** no VS Code
2. Clique com botão direito em `login.html` → **Open with Live Server**
3. O navegador abrirá em `http://127.0.0.1:5500/login.html`

### Opção 3 — Servidor local com Python (sem instalar nada extra)

```bash
# Python 3
cd jovi-math
python -m http.server 5500
```

Acesse: `http://localhost:5500/login.html`

### Credenciais de Demo

```
E-mail: lucas@fiap.com.br
Senha:  qualquer coisa (mínimo 4 caracteres)
Nome:   Lucas (opcional — personaliza a saudação)
```

---

## 🔄 Fluxo de Uso

```
login.html  →  [validação JS]  →  index.html  →  [modo MATH]  →  Bottom Sheet
```

1. **Login** — preenche e-mail e senha; JS valida e salva o nome no `localStorage`
2. **Câmera** — arraste o menu inferior até o modo **MATH**; o scanner e a equação aparecem
3. **Resolver** — clique no botão azul para abrir o Bottom Sheet com a resolução passo a passo
4. **Copiar** — clique em "Copiar Solução" e confirme via `alert()`
5. **Configurações** — clique no ⚙️ para um `prompt()` que atualiza seu nome
6. **Sobre** — acesse pela nav inferior para ver o carrossel interativo de 5 passos

---

## 🛠️ Stack Técnica

- **HTML5** semântico (`<main>`, `<section>`, `<article>`, `<nav>`, `aria-*`)
- **CSS3** — Flexbox, CSS Custom Properties, `backdrop-filter`, `@keyframes`
- **JavaScript ES6+** — `const`/`let`, Arrow Functions, Template Literals, Destructuring, `async/await`
- **APIs nativas** — `localStorage`, `navigator.clipboard`, `prompt()`, `alert()`

---

## 📦 Repositório no GitHub

> **Organização:** [github.com/grupo-fdp-fiap](https://github.com)  
> O repositório deve ter **no mínimo 10 commits** (um por integrante + iterações de código).

---

## 📄 Licença

Projeto acadêmico — FIAP 2026. Todos os direitos reservados ao Grupo F.D.P.
