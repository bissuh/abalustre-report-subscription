import { show } from "./views/form";
import { renderButton } from "./views/button";

function app(window) {
  // set default configurations
  let configurations = {};
  let globalObject = window[window["AbalustreReportWidget"]];
  let queue = globalObject.q;

  if (queue) {
    for (var i = 0; i < queue.length; i++) {
      if (queue[i][0].toLowerCase() == "init") {
        configurations = extendObject(configurations, queue[i][1]);
        renderButton(configurations);
      }
    }
  }

  globalObject.configurations = configurations;
}

function extendObject(a, b) {
  for (var key in b) if (b.hasOwnProperty(key)) a[key] = b[key];
  return a;
}

app(window);
