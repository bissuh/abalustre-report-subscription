import { h, render } from 'preact';
import { App } from './App';
import loader from './loader';
import { Configurations } from './models';

const defaultConfig: Configurations = {
  container: 'subscription',
  buttonColor: '#0050b3',
};

loader(window, defaultConfig, window.document.currentScript, (el, config) =>
  render(h(App, { ...config }), el)
);
