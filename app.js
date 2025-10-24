// ---- Mobile Menu Toggle ----
const nav = document.querySelector('header .nav');
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('site-nav');
const links = [...document.querySelectorAll('.nav-link')];

function toggleMenu(force) {
  const open = force ?? !nav.classList.contains('open');
  nav.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}

menuBtn.addEventListener('click', () => toggleMenu());
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') toggleMenu(false);
});
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target)) toggleMenu(false);
});
links.forEach(a => a.addEventListener('click', () => toggleMenu(false)));

window.addEventListener('resize', () => {
  if (window.innerWidth > 820) toggleMenu(false);
});

// ---- Sticky Shadow on Scroll ----
const header = document.querySelector('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
document.addEventListener('scroll', onScroll);
onScroll();

// ---- Smooth Scroll + Active Link Highlight ----
function smoothScrollTo(target) {
  const el = document.querySelector(target);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 64; // offset for sticky header
  window.scrollTo({ top: y, behavior: 'smooth' });
}
links.forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      history.pushState(null, '', href);
      smoothScrollTo(href);
    }
  });
});

// Highlight current section link while scrolling
const sections = links
  .map(a => a.getAttribute('href'))
  .filter(h => h && h.startsWith('#'))
  .map(h => document.querySelector(h))
  .filter(Boolean);

const obs = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  const id = '#' + visible.target.id;
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
}, { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.2, 0.5, 0.75] });

sections.forEach(s => obs.observe(s));

// Optional: style for active link (lightweight)
const style = document.createElement('style');
style.textContent = `
  .links a.active { outline: 2px solid rgba(255,255,255,.6); outline-offset: 2px; }
`;
document.head.appendChild(style);

// ---- Accessibility niceties ----
menu.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && window.innerWidth <= 820) {
    // keep focus trapped in menu
    const focusables = menu.querySelectorAll('a, button');
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
