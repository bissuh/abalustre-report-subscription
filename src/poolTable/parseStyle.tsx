import { Style } from '../models';

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

export default (style: Style | undefined) => {
  const styles: Record<string, { [key: string]: number | string }> = {};

  function searchObject(obj?: object | Style, key?: string) {
    for (const property in obj) {
      if (isObject(obj[property])) {
        searchObject(obj[property], `${key || ''}${key ? '-' : ''}${property}`);

        if (!hasObject(obj[property])) {
          if (key) {
            styles[`${key}-${property}`] = obj[property];
          }
        }
      } else {
      }
    }
  }

  searchObject(style);

  return (selector: string) => {
    if (styles[`${selector}-self`]) return styles[`${selector}-self`];

    return styles[selector];
  };
};
