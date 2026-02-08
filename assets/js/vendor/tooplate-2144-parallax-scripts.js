
// PATCH: Touch-safe button interaction (mobile/tablet)
// This blocks card-level navigation on touch and allows only the button.

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".feature-card-3d").forEach(card => {
    // Kill touch + synthetic click at card level
    ["touchstart","touchend","click"].forEach(evt => {
      card.addEventListener(evt, e => {
        if (e.target.closest(".guide-btn")) return;
        e.preventDefault();
        e.stopImmediatePropagation();
      }, { passive:false, capture:true });
    });
  });
});
