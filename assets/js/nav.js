// nav.js
import { qsAll } from "./utils.js";

export function wireNavActive(){
  const page = document.body.dataset.page;
  qsAll("[data-nav]").forEach(a => {
    if (a.dataset.nav === page) a.classList.add("is-active");
  });
}
