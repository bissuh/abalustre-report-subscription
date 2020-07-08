import { show } from "./form";

export function renderButton({ container }) {
  var button = document.createElement("button");
  button.innerHTML = "Receber relatórios e cotas";
  button.setAttribute("class", "subscribe-button");
  button.onclick = show;

  let containerElem = document.getElementById(container);
  containerElem.appendChild(button);
}
