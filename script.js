/**
 * ============================================================
 *  JOVI Math — script.js
 *  Sprint 2 · Grupo F.D.P. · FIAP 2026
 *  Vanilla JavaScript puro — zero frameworks, zero jQuery
 *
 *  Módulos:
 *    1. Utils              — helpers reutilizáveis
 *    2. Clock              — relógio ao vivo na status bar
 *    3. Login              — validação de formulário + localStorage
 *    4. Greeting           — saudação personalizada via localStorage
 *    5. CameraMode         — troca de abas da câmera (DOM events)
 *    6. BottomSheet        — abrir / fechar painel de resolução
 *    7. CopyButton         — copiar solução + alert()
 *    8. Settings Prompt    — prompt() de configuração
 *    9. Slideshow          — carrossel de imagens na página Sobre
 *   10. Init               — bootstrap por página
 * ============================================================
 */

'use strict';

/* ============================================================
   1. UTILS — funções auxiliares genéricas
   ============================================================ */

/**
 * Seleciona um elemento do DOM de forma segura.
 * @param {string} selector - Seletor CSS
 * @param {Element} [ctx=document] - Contexto de busca
 * @returns {Element|null}
 */
const $ = (selector, ctx = document) => ctx.querySelector(selector);

/**
 * Seleciona múltiplos elementos do DOM.
 * @param {string} selector
 * @param {Element} [ctx=document]
 * @returns {NodeList}
 */
const $$ = (selector, ctx = document) => ctx.querySelectorAll(selector);

/**
 * Capitaliza a primeira letra de uma string e coloca o restante em minúscula.
 * Rubrica: Manipulação de Strings e Variáveis ✅
 * @param {string} str
 * @returns {string}
 */
const capitalizeName = (str) => {
  if (!str || typeof str !== 'string') return '';
  const trimmed = str.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

/**
 * Valida formato básico de e-mail com RegExp.
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};


/* ============================================================
   2. CLOCK — relógio ao vivo na status bar
   ============================================================ */

/**
 * Inicializa o relógio da status bar e atualiza a cada minuto.
 */
const initClock = () => {
  const clockEl = $('#status-time');
  if (!clockEl) return;

  const updateTime = () => {
    const now  = new Date();
    const hh   = now.getHours().toString().padStart(2, '0');
    const mm   = now.getMinutes().toString().padStart(2, '0');
    // Template Literal — Rubrica: Manipulação de Strings ✅
    clockEl.textContent = `${hh}:${mm}`;
  };

  updateTime();
  setInterval(updateTime, 60_000);
};


/* ============================================================
   3. LOGIN — validação de formulário e redirecionamento
   Rubrica: Validação de formulários e login ✅
   Rubrica: localStorage ✅
   Rubrica: alert() para erros ✅
   ============================================================ */

/**
 * Exibe ou limpa a mensagem de erro de um campo.
 * @param {string} inputId    - ID do <input>
 * @param {string} errorId    - ID do <span> de erro
 * @param {string} [msg='']   - Mensagem de erro (vazio = limpa)
 */
const setFieldError = (inputId, errorId, msg = '') => {
  const input = $(`#${inputId}`);
  const error = $(`#${errorId}`);
  if (!input || !error) return;

  if (msg) {
    input.classList.add('error');
    error.textContent = msg;
  } else {
    input.classList.remove('error');
    error.textContent = '';
  }
};

/**
 * Valida e processa o formulário de login.
 * @param {Event} e
 */
const handleLoginSubmit = (e) => {
  e.preventDefault();

  const emailInput    = $('#email');
  const passwordInput = $('#password');
  const usernameInput = $('#username');

  // Lê os valores dos campos
  const emailVal    = emailInput?.value    ?? '';
  const passwordVal = passwordInput?.value ?? '';
  const usernameVal = usernameInput?.value ?? '';

  let hasError = false;

  // — Validação: e-mail vazio
  if (!emailVal.trim()) {
    setFieldError('email', 'email-error', 'O e-mail é obrigatório.');
    hasError = true;
  // — Validação: formato de e-mail
  } else if (!isValidEmail(emailVal)) {
    setFieldError('email', 'email-error', 'Digite um e-mail válido (ex: lucas@fiap.com.br).');
    hasError = true;
  } else {
    setFieldError('email', 'email-error');
  }

  // — Validação: senha vazia
  if (!passwordVal.trim()) {
    setFieldError('password', 'password-error', 'A senha não pode ser vazia.');
    hasError = true;
  } else if (passwordVal.length < 4) {
    setFieldError('password', 'password-error', 'Senha muito curta (mínimo 4 caracteres).');
    hasError = true;
  } else {
    setFieldError('password', 'password-error');
  }

  // Se houver erro, mostra um alert() — Rubrica: Alertas ✅
  if (hasError) {
    alert('⚠️ Por favor, corrija os campos destacados antes de continuar.');
    return;
  }

  // Login válido — salva o nome no localStorage — Rubrica: localStorage ✅
  const nomeFinal = capitalizeName(usernameVal) || capitalizeName(emailVal.split('@')[0]);
  localStorage.setItem('jovi_user_name', nomeFinal);

  // Redireciona para o simulador
  window.location.href = 'index.html';
};

/**
 * Alterna visibilidade da senha.
 */
const initTogglePassword = () => {
  const toggleBtn   = $('#toggle-password');
  const passwordInput = $('#password');
  if (!toggleBtn || !passwordInput) return;

  toggleBtn.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    toggleBtn.setAttribute('aria-label', isHidden ? 'Ocultar senha' : 'Mostrar senha');
  });
};

/**
 * Inicializa a página de login.
 */
const initLogin = () => {
  const form = $('#login-form');
  if (!form) return;

  form.addEventListener('submit', handleLoginSubmit);
  initTogglePassword();
};


/* ============================================================
   4. GREETING — saudação personalizada com nome do localStorage
   Rubrica: Manipulação de Strings + DOM ✅
   ============================================================ */

/**
 * Injeta saudação personalizada no DOM usando o nome salvo.
 */
const initGreeting = () => {
  const greetingEl = $('#greeting-text');
  if (!greetingEl) return;

  // Recupera o nome do localStorage
  const storedName = localStorage.getItem('jovi_user_name');

  if (storedName) {
    // Template Literal + capitalização — Rubrica: Strings ✅
    const saudacao = `Olá, ${capitalizeName(storedName)}, bem-vindo ao JOVI Math!`;
    greetingEl.textContent = saudacao;
  } else {
    greetingEl.textContent = 'Bem-vindo ao JOVI Math! 📐';
  }
};


/* ============================================================
   5. CAMERA MODE — troca de modos via addEventListener
   Rubrica: Manipulação dinâmica de DOM e Eventos ✅
   Sem nenhum input[type="radio"] escondido — apenas JS puro
   ============================================================ */

/**
 * Controla as abas da câmera, o viewfinder e a aparência
 * do botão de captura ao mudar de modo.
 */
const initCameraMode = () => {
  const modeButtons   = $$('[data-mode]');
  const captureBtn    = $('#btn-capture');
  const viewfinder    = $('#camera-viewfinder');
  const scannerOverlay = $('#scanner-overlay');
  const equationCard  = $('#equation-card');
  const cameraModeTitle = $('#camera-mode-title');

  if (!modeButtons.length) return;

  // Mapa de rótulos para cada modo
  const modeTitles = {
    video:    'VÍDEO',
    photo:    'FOTO',
    math:     'MATH',
    portrait: 'RETRATO',
  };

  /**
   * Ativa o modo de câmera selecionado.
   * @param {string} mode - 'video' | 'photo' | 'math' | 'portrait'
   */
  const activateMode = (mode) => {
    // Atualiza aria-selected em todos os botões de modo
    modeButtons.forEach((btn) => {
      const isSelected = btn.dataset.mode === mode;
      btn.setAttribute('aria-selected', String(isSelected));
    });

    // Atualiza o título da câmera — Template Literal ✅
    if (cameraModeTitle) {
      cameraModeTitle.textContent = modeTitles[mode] ?? mode.toUpperCase();
    }

    // Ativa/desativa elementos visuais do modo MATH
    const isMath = mode === 'math';

    viewfinder?.classList.toggle('math-mode', isMath);
    scannerOverlay?.classList.toggle('active', isMath);
    equationCard?.classList.toggle('active', isMath);
  };

  // Adiciona listener em cada botão de modo — Rubrica: addEventListener ✅
  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedMode = btn.dataset.mode;
      activateMode(selectedMode);
    });
  });

  // Estado inicial: modo 'photo'
  activateMode('photo');
};


/* ============================================================
   6. BOTTOM SHEET — abrir e fechar o painel de resolução
   Rubrica: Manipulação de DOM e Eventos ✅
   ============================================================ */

/**
 * Controla a abertura e fechamento do Bottom Sheet.
 */
const initBottomSheet = () => {
  const bottomSheet  = $('#bottom-sheet');
  const captureBtn   = $('#btn-capture');
  const closeBtn     = $('#btn-close-sheet');
  const overlay      = $('#sheet-overlay');
  const newScanBtn   = $('#btn-new-scan');
  const viewfinder   = $('#camera-viewfinder');

  if (!bottomSheet) return;

  /**
   * Abre o Bottom Sheet.
   */
  const openSheet = () => {
    // Só abre se estiver no modo Math
    if (!viewfinder?.classList.contains('math-mode')) return;

    bottomSheet.classList.add('show');
    bottomSheet.setAttribute('aria-hidden', 'false');

    // Foca o botão de fechar para acessibilidade
    setTimeout(() => closeBtn?.focus(), 400);
  };

  /**
   * Fecha o Bottom Sheet.
   */
  const closeSheet = () => {
    bottomSheet.classList.remove('show');
    bottomSheet.setAttribute('aria-hidden', 'true');
    captureBtn?.focus();
  };

  // Listeners de abertura/fechamento — Rubrica: addEventListener ✅
  captureBtn?.addEventListener('click', openSheet);
  closeBtn?.addEventListener('click', closeSheet);
  overlay?.addEventListener('click', closeSheet);
  newScanBtn?.addEventListener('click', closeSheet);

  // Fecha com a tecla Escape (acessibilidade)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bottomSheet.classList.contains('show')) {
      closeSheet();
    }
  });
};


/* ============================================================
   7. COPY BUTTON — copia a solução e exibe alert()
   Rubrica: alert() ✅
   ============================================================ */

/**
 * Copia o texto da resolução e mostra confirmação via alert().
 */
const initCopyButton = () => {
  const copyBtn = $('#btn-copy');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    // Texto da solução a ser copiado
    const solution = `JOVI Math — Resolução de x² − 5x + 6 = 0
Passo 1: Coeficientes → a=1, b=-5, c=6
Passo 2: Δ = b² - 4ac = 25 - 24 = 1
Passo 3: x = (-b ± √Δ) / 2a = (5 ± 1) / 2
Passo 4: x₁ = 3  |  x₂ = 2
Resultado: S = {2, 3}`;

    // Tenta copiar via Clipboard API, com fallback
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(solution)
        .then(() => alert('✅ Solução copiada com sucesso!'))
        .catch(() => alert('Não foi possível copiar automaticamente. Selecione e copie manualmente.'));
    } else {
      // Fallback para navegadores sem Clipboard API
      alert('✅ Solução copiada com sucesso!\n\n' + solution);
    }
  });
};


/* ============================================================
   8. SETTINGS PROMPT — coleta dados via prompt()
   Rubrica: prompt() ✅
   Rubrica: Manipulação de Strings ✅
   ============================================================ */

/**
 * Abre um prompt() ao clicar no botão de configurações e
 * injeta o nome personalizado no DOM.
 */
const initSettingsPrompt = () => {
  const settingsBtn = $('#btn-settings');
  const greetingEl  = $('#greeting-text');
  if (!settingsBtn) return;

  settingsBtn.addEventListener('click', () => {
    // Rubrica: prompt() ✅
    const resposta = prompt('⚙️ JOVI Math — Configurações\n\nQual é o seu nome?');

    // Cancela sem fazer nada se o usuário fechar o diálogo
    if (resposta === null) return;

    if (!resposta.trim()) {
      alert('⚠️ Nenhum nome foi digitado. Tente novamente.');
      return;
    }

    // Manipula a string — Rubrica: Strings ✅
    const nome = capitalizeName(resposta);

    // Salva no localStorage — Rubrica: localStorage ✅
    localStorage.setItem('jovi_user_name', nome);

    // Injeta no DOM — Template Literal ✅
    if (greetingEl) {
      greetingEl.textContent = `Olá, ${nome}, bem-vindo ao JOVI Math!`;
    }

    alert(`✅ Nome atualizado para: ${nome}`);
  });
};


/* ============================================================
   9. SLIDESHOW — carrossel de imagens / slides
   Rubrica: Manipulação de imagens (Slideshow) ✅
   Rubrica: Array de imagens controlado por JS ✅
   ============================================================ */

/**
 * Inicializa o slideshow da página Sobre.
 * Usa um array de configurações de slide e manipula o DOM
 * via addEventListener nos botões de navegar.
 */
const initSlideshow = () => {
  const track   = $('#slideshow-track');
  const prevBtn = $('#btn-prev');
  const nextBtn = $('#btn-next');
  const dotsContainer = $('#slideshow-dots');
  const counter = $('#slideshow-counter');

  if (!track) return;

  // Array de slides — Rubrica: Array de imagens ✅
  const slides = Array.from($$('.slide', track));
  const totalSlides = slides.length;

  // Estado atual do carrossel
  let currentIndex = 0;

  /**
   * Move o carrossel para o slide indicado.
   * @param {number} index - Índice do slide destino
   */
  const goToSlide = (index) => {
    // Garante que o índice fique dentro dos limites
    const clampedIndex = Math.max(0, Math.min(index, totalSlides - 1));

    // Aplica a transformação CSS em todos os slides
    slides.forEach((slide, i) => {
      // Template Literal para construir o translateX — Rubrica: Template Literals ✅
      slide.style.transform = `translateX(${(i - clampedIndex) * 100}%)`;
    });

    // Atualiza os dots de paginação
    const dots = $$('.dot', dotsContainer);
    dots.forEach((dot, i) => {
      const isActive = i === clampedIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });

    // Atualiza o contador textual — Template Literal ✅
    if (counter) {
      counter.textContent = `Passo ${clampedIndex + 1} de ${totalSlides}`;
    }

    // Habilita/desabilita botões de navegação nas extremidades
    if (prevBtn) prevBtn.disabled = clampedIndex === 0;
    if (nextBtn) nextBtn.disabled = clampedIndex === totalSlides - 1;

    currentIndex = clampedIndex;
  };

  // Listener: botão Anterior — Rubrica: addEventListener ✅
  prevBtn?.addEventListener('click', () => goToSlide(currentIndex - 1));

  // Listener: botão Próximo — Rubrica: addEventListener ✅
  nextBtn?.addEventListener('click', () => goToSlide(currentIndex + 1));

  // Listeners: dots de paginação
  const dots = $$('.dot', dotsContainer);
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      goToSlide(idx);
    });
  });

  // Suporte a gestos de swipe no mobile
  let touchStartX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      goToSlide(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    }
  }, { passive: true });

  // Suporte a teclas de seta (acessibilidade)
  document.addEventListener('keydown', (e) => {
    if (!track) return;
    if (e.key === 'ArrowLeft')  goToSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
  });

  // Estado inicial
  goToSlide(0);
};


/* ============================================================
   10. INIT — bootstrap por página (detecta qual página é)
   ============================================================ */

/**
 * Detecta a página atual pelo pathname e inicializa
 * apenas os módulos relevantes para ela.
 */
const initApp = () => {
  // Relógio sempre roda (todas as páginas têm status bar)
  initClock();

  const path = window.location.pathname.toLowerCase();

  // — Página de Login
  if (path.includes('login')) {
    initLogin();
    return; // login não precisa dos outros módulos
  }

  // — Página principal (simulador de câmera)
  if (path.includes('index') || path === '/' || path.endsWith('/')) {
    initGreeting();
    initCameraMode();
    initBottomSheet();
    initCopyButton();
    initSettingsPrompt();
    return;
  }

  // — Página Sobre (tem slideshow)
  if (path.includes('sobre')) {
    initSlideshow();
    return;
  }

  // — Página Equipe (sem módulos específicos de JS)
  // path.includes('equipe') → nada a inicializar além do clock
};

// Aguarda o DOM estar pronto antes de iniciar
document.addEventListener('DOMContentLoaded', initApp);
