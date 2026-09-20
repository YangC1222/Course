const focusButton = document.querySelector('#focusToggle');
focusButton?.addEventListener('click', () => {
  const active = document.body.classList.toggle('focus-mode');
  focusButton.setAttribute('aria-pressed', String(active));
  focusButton.textContent = active ? '退出专注' : '专注阅读';
});

document.querySelectorAll('.mobile-nav nav a').forEach(link => {
  link.addEventListener('click', () => {
    link.closest('details')?.removeAttribute('open');
  });
});

const chapterLinks = [...document.querySelectorAll('.progress-list a')];
const chapters = [...document.querySelectorAll('.chapter')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    chapterLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${visible.target.id}`;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-20% 0px -60% 0px', threshold: [0, .2, .5] });
  chapters.forEach(chapter => observer.observe(chapter));
}

const slideReader = document.querySelector('#slideReader');
if (slideReader && Array.isArray(window.slideNotes)) {
  let currentChapter = '';
  const fragment = document.createDocumentFragment();

  window.slideNotes.forEach(note => {
    if (note.ch !== currentChapter) {
      currentChapter = note.ch;
      const divider = document.createElement('div');
      divider.className = 'slide-chapter-divider';
      divider.innerHTML = `<span>${currentChapter}</span><i></i>`;
      fragment.appendChild(divider);
    }

    const page = document.createElement('article');
    page.className = 'slide-page';
    page.id = `slide-page-${note.p}`;
    const imageNumber = String(note.p).padStart(2, '0');
    const example = note.example
      ? `<div class="slide-example"><strong>补充示例</strong><p>${note.example}</p></div>`
      : '';
    page.innerHTML = `
      <a class="slide-image-link" href="slides/page-${imageNumber}.jpg" target="_blank" rel="noopener" aria-label="查看第 ${note.p} 页幻灯片大图">
        <img src="slides/page-${imageNumber}.jpg" loading="lazy" decoding="async" alt="MathBasics 第 ${note.p} 页：${note.title}">
        <span>点击查看大图</span>
      </a>
      <div class="slide-analysis">
        <div class="slide-meta"><span>PDF ${imageNumber} / 59</span><em>${note.kind}</em></div>
        <h3>${note.title}</h3>
        <div class="analysis-block"><strong>本页内容</strong><p>${note.summary}</p></div>
        <div class="analysis-block key"><strong>理解与分析</strong><p>${note.analysis}</p></div>
        ${example}
      </div>`;
    fragment.appendChild(page);
  });

  slideReader.appendChild(fragment);
  if (location.hash.startsWith('#slide-page-')) {
    setTimeout(() => document.querySelector(location.hash)?.scrollIntoView(), 0);
  }
}
