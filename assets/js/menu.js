import { qsAll } from "./utils.js";
export function wireMenuActive(){
  const page=document.body.dataset.page;
  qsAll("[data-nav]").forEach(a=>a.classList.toggle("is-active", a.dataset.nav===page));
}
