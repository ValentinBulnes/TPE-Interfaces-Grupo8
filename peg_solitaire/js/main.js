import { PegSolitaireController } from "./controller.js";

window.onload = () => {
  const canvas = document.getElementById("game");
  new PegSolitaireController(canvas);
};
