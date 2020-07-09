import { h, render } from 'preact';
import { App } from './App';
import loader from './loader';
import { Configurations } from './models';

const defaultConfig: Configurations = {};

loader(window, defaultConfig, window.document.currentScript, (el, config) =>
  render(h(App, { ...config }), el)
);
