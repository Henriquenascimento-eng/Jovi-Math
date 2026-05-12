// ==========================================================
// JOVI Math - script.js
// Código organizado em módulos simples
// ==========================================================

'use strict';

// ==========================================================
// Helpers
// ==========================================================

// Atalho para pegar elemento
const $ = (selector) => document.querySelector(selector);

// Atalho para pegar vários elementos
const $$ = (selector) => document.querySelectorAll(selector);

// Deixa a primeira letra maiúscula
function formatarNome(nome) {
  if (!nome) return '';

  nome = nome.trim();

  return nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
}

// Validação simples de e-mail
function emailValido(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

// ==========================================================
// Relógio
// ==========================================================

function iniciarRelogio() {
  const relogio = $('#status-time');

  if (!relogio) return;

  function atualizarHora() {
    const agora = new Date();

    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');

    relogio.textContent = `${horas}:${minutos}`;
  }

  atualizarHora();

  setInterval(atualizarHora, 60000);
}

// ==========================================================
// Login
// ==========================================================

function mostrarErro(inputId, erroId, mensagem = '') {
  const input = $(`#${inputId}`);
  const erro = $(`#${erroId}`);

  if (!input || !erro) return;

  if (mensagem) {
    input.classList.add('error');
    erro.textContent = mensagem;
  } else {
    input.classList.remove('error');
    erro.textContent = '';
  }
}

function fazerLogin(event) {
  event.preventDefault();

  const email = $('#email').value;
  const senha = $('#password').value;
  const usuario = $('#username').value;

  let temErro = false;

  // Validação do e-mail
  if (!email.trim()) {
    mostrarErro('email', 'email-error', 'Digite seu e-mail.');
    temErro = true;

  } else if (!emailValido(email)) {
    mostrarErro('email', 'email-error', 'E-mail inválido.');
    temErro = true;

  } else {
    mostrarErro('email', 'email-error');
  }

  // Validação da senha
  if (!senha.trim()) {
    mostrarErro('password', 'password-error', 'Digite sua senha.');
    temErro = true;

  } else if (senha.length < 4) {
    mostrarErro('password', 'password-error', 'Senha muito curta.');
    temErro = true;

  } else {
    mostrarErro('password', 'password-error');
  }

  // Se tiver erro, para aqui
  if (temErro) {
    alert('⚠️ Corrija os campos antes de continuar.');
    return;
  }

  // Salva nome do usuário
  const nome =
    formatarNome(usuario) ||
    formatarNome(email.split('@')[0]);

  localStorage.setItem('jovi_user_name', nome);

  // Vai para a home
  window.location.href = 'index.html';
}

// Mostrar / esconder senha
function iniciarToggleSenha() {
  const botao = $('#toggle-password');
  const inputSenha = $('#password');

  if (!botao || !inputSenha) return;

  botao.addEventListener('click', () => {

    if (inputSenha.type === 'password') {
      inputSenha.type = 'text';
      botao.setAttribute('aria-label', 'Ocultar senha');

    } else {
      inputSenha.type = 'password';
      botao.setAttribute('aria-label', 'Mostrar senha');
    }
  });
}

function iniciarLogin() {
  const form = $('#login-form');

  if (!form) return;

  form.addEventListener('submit', fazerLogin);

  iniciarToggleSenha();
}

// ==========================================================
// Saudação
// ==========================================================

function iniciarSaudacao() {
  const texto = $('#greeting-text');

  if (!texto) return;

  const nomeSalvo = localStorage.getItem('jovi_user_name');

  if (nomeSalvo) {
    texto.textContent =
      `Olá, ${formatarNome(nomeSalvo)}, bem-vindo ao JOVI Math!`;

  } else {
    texto.textContent = 'Bem-vindo ao JOVI Math! 📐';
  }
}

// ==========================================================
// Modos da câmera
// ==========================================================

function iniciarCamera() {

  const botoesModo = $$('[data-mode]');
  const viewfinder = $('#camera-viewfinder');
  const overlay = $('#scanner-overlay');
  const card = $('#equation-card');
  const titulo = $('#camera-mode-title');

  if (!botoesModo.length) return;

  const nomes = {
    video: 'VÍDEO',
    photo: 'FOTO',
    math: 'MATH',
    portrait: 'RETRATO'
  };

  function ativarModo(modo) {

    botoesModo.forEach((botao) => {

      const ativo = botao.dataset.mode === modo;

      botao.setAttribute('aria-selected', ativo);
    });

    if (titulo) {
      titulo.textContent = nomes[modo];
    }

    const modoMath = modo === 'math';

    viewfinder?.classList.toggle('math-mode', modoMath);
    overlay?.classList.toggle('active', modoMath);
    card?.classList.toggle('active', modoMath);
  }

  botoesModo.forEach((botao) => {

    botao.addEventListener('click', () => {

      const modo = botao.dataset.mode;

      ativarModo(modo);
    });
  });

  ativarModo('photo');
}

// ==========================================================
// Bottom Sheet
// ==========================================================

function iniciarBottomSheet() {

  const sheet = $('#bottom-sheet');
  const botaoCaptura = $('#btn-capture');
  const botaoFechar = $('#btn-close-sheet');
  const overlay = $('#sheet-overlay');
  const novoScan = $('#btn-new-scan');
  const viewfinder = $('#camera-viewfinder');

  if (!sheet) return;

  function abrirSheet() {

    // Só abre no modo math
    if (!viewfinder.classList.contains('math-mode')) return;

    sheet.classList.add('show');
    sheet.setAttribute('aria-hidden', 'false');

    setTimeout(() => {
      botaoFechar.focus();
    }, 400);
  }

  function fecharSheet() {
    sheet.classList.remove('show');
    sheet.setAttribute('aria-hidden', 'true');

    botaoCaptura.focus();
  }

  botaoCaptura?.addEventListener('click', abrirSheet);
  botaoFechar?.addEventListener('click', fecharSheet);
  overlay?.addEventListener('click', fecharSheet);
  novoScan?.addEventListener('click', fecharSheet);

  document.addEventListener('keydown', (event) => {

    if (
      event.key === 'Escape' &&
      sheet.classList.contains('show')
    ) {
      fecharSheet();
    }
  });
}

// ==========================================================
// Botão copiar
// ==========================================================

function iniciarBotaoCopiar() {

  const botao = $('#btn-copy');

  if (!botao) return;

  botao.addEventListener('click', () => {

    const resolucao = `
JOVI Math — Resolução de x² − 5x + 6 = 0

Passo 1:
a = 1
b = -5
c = 6

Passo 2:
Δ = b² - 4ac
Δ = 25 - 24
Δ = 1

Passo 3:
x = (-b ± √Δ) / 2a

Passo 4:
x1 = 3
x2 = 2

Resultado:
S = {2, 3}
`;

    if (navigator.clipboard) {

      navigator.clipboard.writeText(resolucao)
        .then(() => {
          alert('✅ Solução copiada!');
        })
        .catch(() => {
          alert('Erro ao copiar.');
        });

    } else {

      alert(resolucao);
    }
  });
}

// ==========================================================
// Configurações
// ==========================================================

function iniciarConfiguracoes() {

  const botao = $('#btn-settings');
  const saudacao = $('#greeting-text');

  if (!botao) return;

  botao.addEventListener('click', () => {

    const nome = prompt('Qual é o seu nome?');

    if (nome === null) return;

    if (!nome.trim()) {
      alert('⚠️ Digite um nome válido.');
      return;
    }

    const nomeFormatado = formatarNome(nome);

    localStorage.setItem('jovi_user_name', nomeFormatado);

    if (saudacao) {
      saudacao.textContent =
        `Olá, ${nomeFormatado}, bem-vindo ao JOVI Math!`;
    }

    alert(`✅ Nome atualizado para ${nomeFormatado}`);
  });
}

// ==========================================================
// Slideshow
// ==========================================================

function iniciarSlideshow() {

  const track = $('#slideshow-track');
  const prev = $('#btn-prev');
  const next = $('#btn-next');
  const dotsContainer = $('#slideshow-dots');
  const contador = $('#slideshow-counter');

  if (!track) return;

  const slides = Array.from($$('.slide', track));

  let slideAtual = 0;

  function mudarSlide(indice) {

    if (indice < 0) indice = 0;
    if (indice >= slides.length) indice = slides.length - 1;

    slides.forEach((slide, i) => {

      slide.style.transform =
        `translateX(${(i - indice) * 100}%)`;
    });

    const dots = $$('.dot', dotsContainer);

    dots.forEach((dot, i) => {

      const ativo = i === indice;

      dot.classList.toggle('active', ativo);
      dot.setAttribute('aria-selected', ativo);
    });

    if (contador) {
      contador.textContent =
        `Passo ${indice + 1} de ${slides.length}`;
    }

    prev.disabled = indice === 0;
    next.disabled = indice === slides.length - 1;

    slideAtual = indice;
  }

  prev?.addEventListener('click', () => {
    mudarSlide(slideAtual - 1);
  });

  next?.addEventListener('click', () => {
    mudarSlide(slideAtual + 1);
  });

  const dots = $$('.dot', dotsContainer);

  dots.forEach((dot) => {

    dot.addEventListener('click', () => {

      const indice = Number(dot.dataset.index);

      mudarSlide(indice);
    });
  });

  // Swipe no celular
  let inicioTouch = 0;

  track.addEventListener('touchstart', (event) => {
    inicioTouch = event.touches[0].clientX;
  });

  track.addEventListener('touchend', (event) => {

    const fimTouch = event.changedTouches[0].clientX;

    const distancia = inicioTouch - fimTouch;

    if (Math.abs(distancia) > 40) {

      if (distancia > 0) {
        mudarSlide(slideAtual + 1);
      } else {
        mudarSlide(slideAtual - 1);
      }
    }
  });

  // Teclado
  document.addEventListener('keydown', (event) => {

    if (event.key === 'ArrowLeft') {
      mudarSlide(slideAtual - 1);
    }

    if (event.key === 'ArrowRight') {
      mudarSlide(slideAtual + 1);
    }
  });

  mudarSlide(0);
}

// ==========================================================
// Inicialização geral
// ==========================================================

function iniciarApp() {

  iniciarRelogio();

  const pagina = window.location.pathname.toLowerCase();

  // Página login
  if (pagina.includes('login')) {
    iniciarLogin();
    return;
  }

  // Página principal
  if (
    pagina.includes('index') ||
    pagina === '/' ||
    pagina.endsWith('/')
  ) {

    iniciarSaudacao();
    iniciarCamera();
    iniciarBottomSheet();
    iniciarBotaoCopiar();
    iniciarConfiguracoes();

    return;
  }

  // Página sobre
  if (pagina.includes('sobre')) {
    iniciarSlideshow();
  }
}

// Espera carregar HTML
document.addEventListener('DOMContentLoaded', iniciarApp);