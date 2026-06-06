/* ============================================================
   js/nav.js — Controle de Navegação Mobile
   Responsabilidade: Abrir/fechar a sidebar em telas pequenas
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const toggle   = document.getElementById('menuToggle');

  /**
   * Abre o menu lateral e o overlay escuro.
   */
  function abrirMenu() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    toggle.textContent = '✕';
  }

  /**
   * Fecha o menu lateral e remove o overlay.
   */
  function fecharMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    toggle.textContent = '☰';
  }

  // Clique no botão hambúrguer
  toggle?.addEventListener('click', () => {
    sidebar.classList.contains('open') ? fecharMenu() : abrirMenu();
  });

  // Clique no overlay fecha o menu
  overlay?.addEventListener('click', fecharMenu);

  // Fecha o menu ao clicar em qualquer link da navegação (UX mobile)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', fecharMenu);
  });
});
