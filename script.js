const focusButton = document.querySelector('#focusToggle');
focusButton?.addEventListener('click', () => {
  const active = document.body.classList.toggle('focus-mode');
  focusButton.setAttribute('aria-pressed', String(active));
  focusButton.textContent = active ? '退出专注' : '专注阅读';
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
