(() => {
  const history = document.querySelector('[data-edition-history]');
  if (!history) return;
  fetch('/editions.json', {cache: 'no-store'})
    .then(response => { if (!response.ok) throw new Error('History unavailable'); return response.json(); })
    .then(data => {
      if (!Array.isArray(data.editions)) return;
      const entries = data.editions.filter(entry => typeof entry.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(entry.date) && typeof entry.path === 'string' && /^[a-zA-Z0-9/_-]+\.html$/.test(entry.path))
        .sort((a, b) => b.date.localeCompare(a.date));
      if (!entries.length) return;
      const list = document.createElement('div');
      for (const entry of entries) {
        const paragraph = document.createElement('p');
        const link = document.createElement('a');
        link.href = '/' + entry.path.replace(/^\/+/, '');
        link.textContent = entry.date.split('-').reverse().join('/') + ' · ' + (entry.title || (entry.type === 'weekly' ? 'Resumo semanal' : 'Edição diária'));
        if (location.pathname === link.getAttribute('href')) {
          link.setAttribute('aria-current', 'page');
          link.textContent += ' (você está aqui)';
        }
        paragraph.append(link);
        list.append(paragraph);
      }
      history.replaceChildren(...list.children);
    }).catch(() => { /* Keep the static links and latest-edition shortcut. */ });
})();