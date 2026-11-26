/* Static map panel: layer visibility, opacity, selection, and filtering. */
(() => {
  const panel = document.querySelector('#map-panel .pm-app');
  if (!panel) return;

  const eye = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.1 12a10.8 10.8 0 0 1 19.8 0 10.8 10.8 0 0 1-19.8 0"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  const eyeOff = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.7 5.1A10.7 10.7 0 0 1 21.9 11.8a10.7 10.7 0 0 1-1.4 2.5"></path><path d="M14.1 14.2a3 3 0 0 1-4.2-4.2"></path><path d="M17.5 17.5A10.8 10.8 0 0 1 2.1 11.8a10.8 10.8 0 0 1 4.4-5.1"></path><path d="m2 2 20 20"></path></svg>`;

  const cards = [...panel.querySelectorAll('.pm-layer[data-layer]')];
  const cardsForSearch = [...panel.querySelectorAll('.pm-layer')];

  function imageFor(name) {
    return panel.querySelector(`.pm-map-img[data-map-layer="${name}"]`);
  }

  function syncVisibility(card, visible) {
    card.dataset.visible = String(visible);
    card.classList.toggle('is-hidden', !visible);
    const button = card.querySelector('.pm-eye');
    if (button) {
      button.innerHTML = visible ? eye : eyeOff;
      button.title = visible ? 'Hide layer' : 'Show layer';
      button.setAttribute('aria-label', visible ? 'Hide layer' : 'Show layer');
      button.setAttribute('aria-pressed', String(visible));
    }
    const image = imageFor(card.dataset.layer);
    if (image) image.style.display = visible ? '' : 'none';
  }

  function syncOpacity(card) {
    const slider = card.querySelector('.pm-opacity input');
    const output = card.querySelector('.pm-opacity output');
    const image = imageFor(card.dataset.layer);
    if (!slider) return;
    const value = Number(slider.value);
    if (output) output.textContent = (value / 100).toFixed(2);
    if (image) image.style.opacity = String(value / 100);
  }

  function select(card) {
    cards.forEach((item) => item.classList.toggle('is-selected', item === card));
  }

  cards.forEach((card) => {
    const visible = card.dataset.visible !== 'false';
    syncVisibility(card, visible);
    syncOpacity(card);

    card.querySelector('.pm-eye')?.addEventListener('click', (event) => {
      event.stopPropagation();
      syncVisibility(card, card.dataset.visible === 'false');
    });

    card.querySelector('.pm-opacity input')?.addEventListener('input', () => syncOpacity(card));

    card.addEventListener('click', (event) => {
      if (event.target.closest('button, input, output')) return;
      select(card);
    });
  });

  panel.querySelector('[data-map-show]')?.addEventListener('click', () => {
    cards.forEach((card) => syncVisibility(card, true));
  });

  panel.querySelector('[data-map-hide]')?.addEventListener('click', () => {
    cards.forEach((card) => syncVisibility(card, false));
  });

  const search = panel.querySelector('.pm-search input');
  search?.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    cardsForSearch.forEach((card) => {
      card.hidden = Boolean(query) && !card.textContent.toLowerCase().includes(query);
    });
  });
})();
