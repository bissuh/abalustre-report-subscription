import { Configurations } from './models';

type MethodNames = 'init';
export const DEFAULT_NAME = '_aba';

interface LoaderObject {
  q: (MethodNames | {})[];
}

export default (
  win: Window,
  defaultConfig: Configurations,
  scriptElement: Element | null,
  render: (
    element: HTMLElement,
    config: Configurations,
    component: string
  ) => void
) => {
  const instanceName =
    scriptElement?.attributes.getNamedItem('id')?.value ?? DEFAULT_NAME;
  const loaderObject: LoaderObject = win[instanceName];

  if (!loaderObject || !loaderObject.q) {
    throw new Error(
      `Widget didn't find LoaderObject for instance [${instanceName}]. The loading script was either modified, no call to 'init' method was done  or there is no conflicting object defined in \`window.${instanceName}\`.`
    );
  }

  if (win[`loaded-${instanceName}`]) {
    throw new Error(
      `Widget with name [${instanceName}] was already loaded. This means you have multiple instances with same identifier (e.g. '${DEFAULT_NAME}')`
    );
  }

  for (let i = 0; i < loaderObject.q.length; i++) {
    const item = loaderObject.q[i];
    const methodName = item[0];
    if (i === 0 && methodName !== 'init') {
      throw new Error(
        `Failed to start Widget [${instanceName}]. 'Init' must be called before other methods.`
      );
    } else if (i !== 0 && methodName === 'init') {
      continue;
    }

    const loadedObject = Object.assign(defaultConfig, item[1]);

    switch (methodName) {
      case 'initSubscription':
        if (loadedObject.container) {
          const wrappingElement = win.document.getElementById(
            loadedObject.container
          );

          if (wrappingElement !== null) {
            wrappingElement.setAttribute('id', `${instanceName}-subscription`);
            render(wrappingElement, loadedObject, methodName);
          }
        }

        win[`loaded-${instanceName}`] = true;
        break;

      case 'initPerformance':
        if (loadedObject.container) {
          const wrappingElement = win.document.getElementById(
            loadedObject.container
          );

          if (wrappingElement !== null) {
            wrappingElement.setAttribute('id', `${instanceName}-performance`);
            render(wrappingElement, loadedObject, methodName);
          }
        }

        win[`loaded-${instanceName}`] = true;
        break;

      default:
        console.warn(`Unsupported method [${methodName}]`, item[1]);
    }
  }

  win[instanceName] = (method: MethodNames, ...args: any[]) => {
    switch (method) {
      default:
        console.warn(`Unsupported method [${method}]`, args);
    }
  };
};
