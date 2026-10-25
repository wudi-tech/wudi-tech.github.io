(() => {
  'use strict';
  const body = document.body;
  body.classList.add('js');
  const languageLinks = document.querySelectorAll('[data-language].language-link');
  const storeLanguage = lang => { try { localStorage.setItem('portfolio-language', lang); } catch { /* The site remains usable without storage. */ } };
  for (const link of languageLinks) link.addEventListener('click', () => storeLanguage(link.dataset.language));
  // Remember the preference on entry at the bare homepage. Explicit deep links keep their language.
  if (location.pathname === '/' || location.pathname === '/index.html') {
    try { if (localStorage.getItem('portfolio-language') === 'en') location.replace('/en/' + location.hash); } catch { /* Storage may be disabled. */ }
  }
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  if (toggle && nav) {
    toggle.hidden = false;
    const closeMenu = () => { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
    const desktop = matchMedia('(min-width: 761px)');
    desktop.addEventListener('change', closeMenu);
  }
  const filters = document.querySelector('.project-filters');
  if (filters) {
    filters.hidden = false;
    const rows = [...document.querySelectorAll('.repository-row')];
    for (const button of filters.querySelectorAll('button')) button.addEventListener('click', () => {
      const category = button.dataset.filter;
      for (const other of filters.querySelectorAll('button')) other.setAttribute('aria-pressed', String(other === button));
      let count = 0;
      for (const row of rows) { row.hidden = category !== 'all' && row.dataset.category !== category; if (!row.hidden) count++; }
      document.querySelector('#result-count').textContent = String(count);
      document.querySelector('#no-results').hidden = count > 0;
    });
  }
})();
