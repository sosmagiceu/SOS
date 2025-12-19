// topbar-menu.js
export function initTopbarMenu(){
  const drawer = document.getElementById("topbarDrawer");
  const overlay = document.querySelector("[data-drawer-overlay]");
  const hamBtn = document.querySelector(".hamburger-btn");
  const closeBtn = document.querySelector(".drawer-close");

  const langBtn = document.querySelector(".lang-btn");
  const langMenu = document.getElementById("langMenu");

  function setExpanded(btn, expanded){
    if(!btn) return;
    btn.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  function openDrawer(){
    if(!drawer || !overlay) return;
    drawer.hidden = false;
    overlay.hidden = false;
    setExpanded(hamBtn, true);
    document.body.classList.add("drawer-open");
  }

  function closeDrawer(){
    if(!drawer || !overlay) return;
    drawer.hidden = true;
    overlay.hidden = true;
    setExpanded(hamBtn, false);
    document.body.classList.remove("drawer-open");
  }

  function toggleDrawer(){
    if(!drawer) return;
    drawer.hidden ? openDrawer() : closeDrawer();
  }

  // Language dropdown
  function openLang(){
    if(!langMenu) return;
    langMenu.hidden = false;
    setExpanded(langBtn, true);
  }
  function closeLang(){
    if(!langMenu) return;
    langMenu.hidden = true;
    setExpanded(langBtn, false);
  }
  function toggleLang(){
    if(!langMenu) return;
    langMenu.hidden ? openLang() : closeLang();
  }

  hamBtn?.addEventListener("click", ()=>{
    closeLang();
    toggleDrawer();
  });

  closeBtn?.addEventListener("click", closeDrawer);
  overlay?.addEventListener("click", closeDrawer);

  // Close drawer on ESC
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape"){
      closeDrawer();
      closeLang();
    }
  });

  // Close language menu on outside click
  document.addEventListener("click", (e)=>{
    const t = e.target;
    if(langBtn && langMenu){
      const inLang = langBtn.contains(t) || langMenu.contains(t);
      if(!inLang) closeLang();
    }
  });

  langBtn?.addEventListener("click", (e)=>{
    e.stopPropagation();
    closeDrawer();
    toggleLang();
  });

  // For later: wire language change
  langMenu?.addEventListener("click", (e)=>{
    const btn = e.target.closest(".lang-option");
    if(!btn) return;
    // currently only English
    langMenu.querySelectorAll(".lang-option").forEach(b=>b.classList.remove("is-active"));
    btn.classList.add("is-active");
    closeLang();
  });
}
