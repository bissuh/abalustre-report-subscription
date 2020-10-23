import { h, render } from 'preact';
import { MonthlyReportButton } from './MonthlyReportButton';
import { MonthlyReportSearch } from './MonthlyReportSearch';
import { SubscriptionApp } from './SubscriptionApp';
import { PerformanceApp } from './PerformanceApp';
import { PoolDescription } from './PoolDescription';
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

      case 'poolDescription':
        render(h(PoolDescription, { ...config }), el);
        break;

      case 'monthlyReportButton':
        render(h(MonthlyReportButton, { ...config }), el);
        break;

      case 'monthlyReportSearch':
        render(h(MonthlyReportSearch, { ...config }), el);
        break;

      default:
        break;
    }
  }
);
