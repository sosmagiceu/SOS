// /assets/js/footer.js
(async function initFooter() {
  const mount = document.getElementById("footer-mount");
  if (!mount) return;

  function injectFallbackFooter() {
    mount.innerHTML = `
<footer class="footer" id="siteFooter">
  <div class="footer-content">
    <div class="footer-info-grid" role="contentinfo" aria-label="Company information">
      <div class="footer-info-item"><strong>Van der Velde Beheer B.V.</strong></div>
      <div class="footer-info-item">Address: Noord Spuidijk 2, 3247LB Dirksland, Netherlands</div>
      <div class="footer-info-item">Chamber of Commerce (KvK): 24327349</div>

      <div class="footer-info-item">VAT Number (BTW): NL810301076B01</div>
      <div class="footer-info-item">Support: <a href="mailto:support@sosmagic.eu">support@sosmagic.eu</a></div>
      <div class="footer-info-item">Website: <a href="https://sosmagic.eu" rel="noopener">sosmagic.eu</a></div>
    </div>

    <div class="footer-copyright">
      © <span id="footerYear"></span> Van der Velde Beheer B.V.
    </div>
  </div>
</footer>

    `;
  }

  try {
    const res = await fetch("/partials/footer.html", { cache: "no-store" });
    const html = await res.text();
    if (html && html.includes("siteFooter")) {
      mount.innerHTML = html;
    } else {
      injectFallbackFooter();
    }
  } catch {
    injectFallbackFooter();
  }

  const yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
