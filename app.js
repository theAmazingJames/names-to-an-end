'use strict';
const progress = document.querySelector('.progress');
let ticking = false;
function updateProgress() {
  const distance = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${distance > 0 ? Math.min(100, scrollY / distance * 100) : 0}%`;
  ticking = false;
}
addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; }
}, { passive: true });
addEventListener('resize', updateProgress);
updateProgress();
const share = document.getElementById('share');
const status = document.getElementById('share-status');
share.hidden = false;
share.addEventListener('click', async () => {
  const local = location.protocol === 'file:' || ['localhost', '127.0.0.1', '::1', '[::1]'].includes(location.hostname);
  if (local) {
    status.textContent = 'This is a local preview. A shareable link will be available after publishing.';
    return;
  }
  const url = new URL(location.href); url.hash = '';
  try {
    if (navigator.share) {
      await navigator.share({ title: 'NAMES to an End', text: 'A speculative fiction about names, intelligence, and a future that writes its own beginning.', url: url.href });
      status.textContent = 'Share options opened.';
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url.href);
      status.textContent = 'Link copied. Send it to someone curious.';
    } else { status.textContent = `Copy the address from your browser to share this story: ${url.href}`; }
  } catch (error) {
    status.textContent = error.name === 'AbortError' ? '' : 'Sharing is unavailable here. Copy the address from your browser.';
  }
});
