import html from "./form.html";
import "./form.css";

let elements = [];
let body;

export function show() {
  let temporary = document.createElement("div");
  temporary.innerHTML = html;
  temporary
    .getElementsByClassName("js-widget-overlay")[0]
    .addEventListener("click", close);

  body = document.getElementsByTagName("body")[0];
  while (temporary.children.length > 0) {
    elements.push(temporary.children[0]);
    body.appendChild(temporary.children[0]);
  }
}

export function close() {
  while (elements.length > 0) {
    elements.pop().remove();
  }
  body.removeEventListener("click", close);
}
