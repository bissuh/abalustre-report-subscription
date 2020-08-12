import { h, render } from 'preact';
import { SubscriptionApp } from './SubscriptionApp';
import { PerformanceApp } from './PerformanceApp';
import loader from './loader';
import { Configurations } from './models';

const defaultConfig: Configurations = {
  buttonColor: '#0050b3',
  language: 'en',
};

loader(
  window,
  defaultConfig,
  window.document.currentScript,
  (el, config, component) => {
    switch (component) {
      case 'initPerformance':
        render(h(PerformanceApp, { ...config }), el);
        break;

      case 'initSubscription':
        render(h(SubscriptionApp, { ...config }), el);
        break;

      default:
        break;
    }
  }
);
