/* Static app preview: real app shell, three example analyses, and a Data tab. */
(() => {
  const parentRoot = (() => {
    try {
      return window.parent !== window ? window.parent.document.documentElement : null;
    } catch (e) {
      return null;
    }
  })();

  function setTheme(theme) {
    if (!theme) return;
    document.documentElement.dataset.theme = theme;
    const toggle = document.querySelector('#theme-toggle');
    if (toggle) {
      const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
      toggle.title = label;
      toggle.setAttribute('aria-label', label);
    }
  }

  if (parentRoot) {
    setTheme(parentRoot.dataset.theme);
    new MutationObserver(() => setTheme(parentRoot.dataset.theme)).observe(parentRoot, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
  } else {
    let stored = null;
    try {
      stored = localStorage.getItem('si-theme');
    } catch (e) {}
    setTheme(stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  }

  window.addEventListener('message', (event) => {
    if (event.data?.type === 'si-theme') setTheme(event.data.theme);
  });

  const tabContent = document.querySelector('#tab-content');
  if (!tabContent) return;

  const cellsPane = tabContent.querySelector(':scope > div');
  const cells = [...cellsPane.querySelectorAll(':scope > .cell')];
  const promptTemplate = cells[0];
  const responseTemplate = cells[1];
  const tabButtons = [...document.querySelectorAll('.tabbar button')];
  const cellsButton = tabButtons[0];
  const dataButton = tabButtons[1];
  const toolbar = document.querySelector('.panel-toolbar');

  const floodPrompt = 'How much new water appeared in the Tulare Lake basin between June 2022 and June 2023?';
  const firstPrompt = promptTemplate.querySelector('textarea');
  if (firstPrompt) {
    firstPrompt.value = floodPrompt;
    firstPrompt.style.height = '78px';
  }

  const examples = [
    {
      prompt: 'Find high-resolution satellite imagery of the Long Beach port area, run building detection, and mark the large buildings.',
      response: `
        <p><strong>15 large buildings</strong> mapped across four blocks in Long Beach.</p>
        <p>The detector found 15 structures above the size threshold. The largest footprint covers <strong>2.1 hectares</strong>; boxes were written to <code>results/buildings.geojson</code>.</p>
        <h3>What the run produced</h3>
        <table>
          <thead><tr><th>Layer</th><th>Content</th></tr></thead>
          <tbody>
            <tr><td>Source</td><td>Google satellite z18, 2025</td></tr>
            <tr><td>Detections</td><td>15 building footprints</td></tr>
          </tbody>
        </table>`,
    },
    {
      prompt: 'Map surface cover over the Denver airport with the local land-cover model.',
      response: `
        <p><strong>4 surface classes</strong> across 92.4% of the scene: pavement, roofs, vegetation, and dry ground.</p>
        <p>The model separated the apron, terminal roofs, and surrounding grass from a single aerial image. The class masks are in <code>results/surface_cover.tif</code>.</p>
        <h3>What the run produced</h3>
        <table>
          <thead><tr><th>Layer</th><th>Content</th></tr></thead>
          <tbody>
            <tr><td>Source</td><td>USDA NAIP 2023 aerial</td></tr>
            <tr><td>Classification</td><td>4 classes, 92.4% coverage</td></tr>
          </tbody>
        </table>`,
    },
  ];

  let counter = 2;
  for (const example of examples) {
    const prompt = promptTemplate.cloneNode(true);
    const response = responseTemplate.cloneNode(true);
    const id = `preview-${counter}`;
    prompt.dataset.cellId = `${id}-prompt`;
    response.dataset.cellId = `${id}-response`;
    const promptInput = prompt.querySelector('textarea');
    if (promptInput) {
      promptInput.value = example.prompt;
      promptInput.style.height = '78px';
    }
    const promptCounter = prompt.querySelector('.cell-header .counter');
    if (promptCounter) promptCounter.textContent = `In[${counter}]`;
    const promptOut = prompt.querySelector('.cell-out .counter');
    if (promptOut) promptOut.textContent = `Out[${counter}]`;
    const responseCounter = response.querySelector('.cell-out .counter');
    if (responseCounter) responseCounter.textContent = `Out[${counter}]`;
    const markdown = response.querySelector('.markdown');
    if (markdown) markdown.innerHTML = example.response;
    cellsPane.append(prompt, response);
    counter += 1;
  }

  if (cellsButton) {
    const count = cellsButton.querySelector('.tab-count');
    if (count) count.textContent = String(cells.length + examples.length * 2);
  }

  cellsPane.dataset.pane = 'cells';
  cellsButton?.setAttribute('data-tab', 'cells');
  dataButton?.setAttribute('data-tab', 'data');

  const dataPane = document.createElement('div');
  dataPane.dataset.pane = 'data';
  dataPane.hidden = true;
  dataPane.innerHTML = `
    <div class="data-tab">
      <div class="import-row">
        <input type="text" placeholder="Workspace path or URL" aria-label="Workspace path or URL">
        <button type="button">Add</button>
      </div>
      <div class="drop-zone" role="button" tabindex="0" aria-label="Drop files to import">
        <span class="icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4"></path><path d="m7 9 5-5 5 5"></path><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"></path></svg>
        </span>
        <span><strong>Drop files</strong> or click to browse</span>
      </div>
      <div class="data-heading">
        <div class="data-heading-copy">
          <span class="data-heading-label">flood-demo</span>
          <span class="data-count">2 layers</span>
        </div>
        <button class="data-refresh" type="button" title="Refresh" aria-label="Refresh files">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 0 0-14-5l-3 4"></path><path d="M4 4v6h6"></path><path d="M4 13a8 8 0 0 0 14 5l3-4"></path><path d="M20 20v-6h-6"></path></svg>
        </button>
      </div>
      <p class="data-note">Files live in the workspace you chose. The map reads them in place.</p>
      <ul class="file-tree">
        <li class="tree-dir">
          <details open>
            <summary>
              <span class="tree-chevron">›</span>
              <span class="icon tree-icon kind-folder" aria-hidden="true"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg></span>
              <span>data/</span>
            </summary>
            <ul class="file-tree">
              <li><div class="preview-file"><span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg></span><span>sentinel2_before.tif</span><span class="preview-file-size">48 MB</span></div></li>
              <li><div class="preview-file"><span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg></span><span>sentinel2_after.tif</span><span class="preview-file-size">51 MB</span></div></li>
            </ul>
          </details>
        </li>
        <li class="tree-dir">
          <details open>
            <summary>
              <span class="tree-chevron">›</span>
              <span class="icon tree-icon kind-folder" aria-hidden="true"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg></span>
              <span>results/</span>
            </summary>
            <ul class="file-tree">
              <li><div class="preview-file"><span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path></svg></span><span>flood_extent.tif</span><span class="preview-file-size">2.3 MB</span></div></li>
              <li><div class="preview-file"><span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path></svg></span><span>stats.json</span><span class="preview-file-size">4 KB</span></div></li>
            </ul>
          </details>
        </li>
      </ul>
    </div>`;
  tabContent.append(dataPane);

  function showTab(name) {
    const data = name === 'data';
    cellsButton?.classList.toggle('active', !data);
    dataButton?.classList.toggle('active', data);
    cellsButton?.setAttribute('aria-selected', String(!data));
    dataButton?.setAttribute('aria-selected', String(data));
    cellsPane.hidden = data;
    dataPane.hidden = !data;
    if (toolbar) toolbar.hidden = data;
  }

  cellsButton?.addEventListener('click', () => showTab('cells'));
  dataButton?.addEventListener('click', () => showTab('data'));

  // Every other control is intentionally inert in this static preview.
  document.querySelectorAll('button:not([data-tab]):not(.tabbar button)').forEach((button) => {
    if (button.closest('.cell') || button.closest('.data-tab')) return;
    button.addEventListener('click', (event) => event.preventDefault());
  });
})();
