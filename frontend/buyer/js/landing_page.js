// ── Login Modal ──
const loginModal  = document.getElementById('loginModal');
const modalClose  = document.getElementById('modalClose');
const profileIcon = document.querySelector('.nav-icons svg:first-child');

profileIcon.addEventListener('click', () => {
  loginModal.classList.add('open');
  document.body.style.overflow = 'hidden';
});
modalClose.addEventListener('click', closeModal);
loginModal.addEventListener('click', (e) => {
  if (e.target === loginModal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
function closeModal() {
  loginModal.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Navbar scroll effect ──
const navbar = document.querySelector('nav');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

// ── Hero carousel ──
const track   = document.getElementById('heroTrack');
const slides  = Array.from(track.querySelectorAll('.hero-slide'));
const prevBtn = document.getElementById('heroPrev');
const nextBtn = document.getElementById('heroNext');
const total   = slides.length;
let current   = 0;
let animating = false;

// Init: park all slides off-screen right, activate first
slides.forEach((slide, i) => {
  slide.style.transition = 'none';
  slide.style.transform  = i === 0 ? 'translateX(0%)' : 'translateX(100%)';
});
slides[0].classList.add('active');

function goTo(next, direction) {
  if (animating || next === current) return;
  animating = true;

  const outgoing = slides[current];
  const incoming = slides[next];

  // Snap incoming off-screen instantly (no transition)
  incoming.style.transition = 'none';
  incoming.style.transform  = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';

  // Commit the snap with a forced reflow
  incoming.getBoundingClientRect();

  // Slide both panels simultaneously
  const duration = '0.45s';
  const easing   = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

  incoming.style.transition = `transform ${duration} ${easing}`;
  incoming.style.transform  = 'translateX(0%)';

  outgoing.style.transition = `transform ${duration} ${easing}`;
  outgoing.style.transform  = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';

  incoming.classList.add('active');
  outgoing.classList.remove('active');
  current = next;

  // Unlock after transition ends, then park all non-active slides
  incoming.addEventListener('transitionend', () => {
    animating = false;
    slides.forEach((slide, i) => {
      if (i !== current) {
        slide.style.transition = 'none';
        slide.style.transform  = 'translateX(100%)';
      }
    });
  }, { once: true });
}

prevBtn.addEventListener('click', () => goTo((current - 1 + total) % total, 'prev'));
nextBtn.addEventListener('click', () => goTo((current + 1) % total, 'next'));

// Auto-advance every 5s, pause on hover
let autoplay = setInterval(() => goTo((current + 1) % total, 'next'), 5000);
track.addEventListener('mouseenter', () => clearInterval(autoplay));
track.addEventListener('mouseleave', () => {
  autoplay = setInterval(() => goTo((current + 1) % total, 'next'), 5000);
});

// ── Drag to scroll (New Arrivals) ──
const row = document.getElementById('newArrivalsRow');
let isDragging = false;
let startX, scrollLeft;

row.addEventListener('mousedown', (e) => {
  isDragging = true;
  row.classList.add('dragging');
  startX     = e.pageX - row.offsetLeft;
  scrollLeft = row.scrollLeft;
});
row.addEventListener('mouseleave', () => {
  isDragging = false;
  row.classList.remove('dragging');
});
row.addEventListener('mouseup', () => {
  isDragging = false;
  row.classList.remove('dragging');
});
row.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x    = e.pageX - row.offsetLeft;
  const walk = (x - startX) * 1.5;
  row.scrollLeft = scrollLeft - walk;
});

// Touch support
let touchStartX, touchScrollLeft;
row.addEventListener('touchstart', (e) => {
  touchStartX     = e.touches[0].pageX - row.offsetLeft;
  touchScrollLeft = row.scrollLeft;
});
row.addEventListener('touchmove', (e) => {
  const x    = e.touches[0].pageX - row.offsetLeft;
  const walk = (x - touchStartX) * 1.5;
  row.scrollLeft = touchScrollLeft - walk;
});
