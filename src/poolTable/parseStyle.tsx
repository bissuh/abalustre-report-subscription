import { Style } from '../models';

interface Styles {
  custom: Record<string, { [key: string]: number | string }>;
  init: Record<string, { [key: string]: number | string }>;
}

function isObject(obj: any) {
  return typeof obj === 'object';
}

function hasObject(obj: object) {
  for (const property in obj) {
    if (obj[property] instanceof Object) {
      return true;
    }
  }

  return false;
}

export default (style: Style | undefined, defaultStyle: Style | undefined) => {
  const styles: Styles = {
    custom: {},
    init: {},
  };

  function searchObject(type: string, obj?: object | Style, key?: string) {
    for (const property in obj) {
      if (isObject(obj[property])) {
        searchObject(
          type,
          obj[property],
          `${key || ''}${key ? '-' : ''}${property}`
        );

        if (!hasObject(obj[property])) {
          if (key) {
            styles[type][`${key}-${property}`] = obj[property];
          }
        }
      }
    }
  }

  searchObject('custom', style);
  searchObject('init', defaultStyle);

  return (selector: string) => {
    const style1 =
      styles['init'][`${selector}-self`] ?? styles['init'][selector];
    const style2 =
      styles['custom'][`${selector}-self`] ?? styles['custom'][selector];

    return { ...style1, ...style2 };
  };
};
