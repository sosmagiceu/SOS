import { wireMenuActive } from "./menu.js";
import { initCarousels } from "./carousel.js";
import { initTopbarMenu } from "./topbar-menu.js";
document.addEventListener("DOMContentLoaded", ()=>{
  wireMenuActive();
  initCarousels();
  initTopbarMenu();
});
