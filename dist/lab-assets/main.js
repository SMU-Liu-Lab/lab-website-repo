'use strict';
(() => {
  const data = window.LIU_LAB;
  if (!data) return;
  const el = (tag, className, value) => { const node = document.createElement(tag); if (className) node.className = className; if (value) node.textContent = value; return node; };
  const external = (node, url) => { node.href = url; node.target = '_blank'; node.rel = 'noopener noreferrer'; return node; };
  data.resources.forEach((r, index) => {
    const quick = external(el('a', '', r.name), r.url);
    quick.setAttribute('aria-label', `${r.name}（新窗口）`);
    document.querySelector('#quick-links').append(quick);
    const card = external(el('a', `resource-card ${r.color}`), r.url);
    card.setAttribute('aria-label', `打开 ${r.name}：${r.subtitle}（新窗口）`);
    const top = el('div', 'card-top'); top.append(el('span', 'resource-code', r.code), el('span', 'category', r.category));
    const title = el('h3', '', r.name);
    const bottom = el('div', 'card-bottom'); bottom.append(el('span', '', r.note), el('span', 'card-arrow', '↗'));
    card.append(top, title, el('p', 'resource-subtitle', r.subtitle), el('p', 'resource-description', r.description), bottom);
    document.querySelector('#resource-grid').append(card);
  });
  data.publications.forEach(p => {
    const article = el('article', 'publication');
    const year = el('div', 'publication-year', String(p.year));
    const body = el('div', 'publication-body');
    const journal = el('p', 'publication-journal', p.journal);
    const heading = el('h3'); heading.append(external(el('a', '', p.title), `https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/`));
    body.append(journal, heading, el('p', 'publication-topic', p.topic));
    const links = el('div', 'publication-links'); links.append(external(el('a', '', 'PubMed ↗'), `https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/`));
    if (p.doi) links.append(external(el('a', '', 'DOI ↗'), `https://doi.org/${p.doi}`));
    body.append(el('p', 'publication-id', `PMID ${p.pmid}`)); article.append(year, body, links);
    document.querySelector('#publication-list').append(article);
  });
  if (!data.publications.length) document.querySelector('#publications').hidden = true;
  if (data.members.length) {
    document.querySelector('#members').replaceChildren();
    data.members.forEach(m => { const card = el('article', 'member'); card.append(el('h3', '', m.name), el('p', '', m.role), el('p', '', m.description)); document.querySelector('#members').append(card); });
  }
  if (data.assets.hero) { document.querySelector('.hero').classList.add('has-image'); document.querySelector('.hero').style.setProperty('--hero-image', `url("${new URL(data.assets.hero, document.baseURI).href}")`); document.querySelector('.hero-caption').hidden = false; }
  if (data.assets.portrait) { document.querySelector('#pi-portrait').src = data.assets.portrait; document.querySelector('#portrait-wrap').hidden = false; }
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
  menu.addEventListener('click', () => { const opened = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(opened)); nav.classList.toggle('is-open', opened); });
  nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
  document.addEventListener('click', e => { if (!e.target.closest('.header-inner')) closeMenu(); });
  document.querySelector('#copyright-year').textContent = String(new Date().getFullYear());
})();
