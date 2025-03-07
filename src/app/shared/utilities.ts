import { Injectable } from '@angular/core';

@Injectable()
export class Utilities {
  public static readonly captionAndMessageSeparator = ':';
  public static readonly notFoundMessageCaption = 'Not Found';
  public static readonly notFoundMessageDetail = 'The target resource cannot be found';

  public static getQueryParamsFromString(paramString: string) {
    const params: Record<string, string | undefined> = {};

    for (const param of paramString.split('&')) {
      const keyValue = Utilities.splitInTwo(param, '=');
      params[keyValue.firstPart] = keyValue.secondPart;
    }
    return params;
  }

  public static splitInTwo(text: string, separator: string, splitFromEnd = false): { firstPart: string, secondPart: string | undefined } {
    let separatorIndex = -1;

    if (separator !== '') {
      if (!splitFromEnd)
        separatorIndex = text.indexOf(separator);
      else
        separatorIndex = text.lastIndexOf(separator);
    }

    if (separatorIndex === -1) {
      return { firstPart: text, secondPart: undefined };
    }

    const part1 = text.substring(0, separatorIndex).trim();
    const part2 = text.substring(separatorIndex + 1).trim();

    return { firstPart: part1, secondPart: part2 };
  }

  public static stringify(value: unknown, depth = 3): string {
    const worker = (value: unknown, depth: number, padding = ''): string => {
      if (value === null || value === undefined) {
        return '';
      }

      if (typeof value === 'object') {
        const objectobject = '[object Object]';

        const result = value.toString();
        if (result !== objectobject)
          return result;

        const keyValuePairs = [];
        let tab = `\n${padding}`;

        for (const key in value) {
          if (Object.prototype.hasOwnProperty.call(value, key)) {
            const keyEntry = value[key as keyof object];

            if (typeof keyEntry !== 'function') {
              const keyValue = depth > 0 ? worker(keyEntry, depth - 1, padding + ' ') : String(keyEntry);
              keyValuePairs.push(`${tab}${key}: ${keyValue === objectobject ? '...' : keyValue}`);
              tab = padding;
            }
          }
        }

        return keyValuePairs.join('\n');
      }

      return String(value);
    }

    return worker(value, depth); //.replace(/^\s+/, '');
  }

  public static JsonTryParse(value: string) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  public static TestIsObjectEmpty(obj: object) {
    for (const prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }

    return true;
  }

  public static TestIsUndefined(value: unknown) {
    return typeof value === 'undefined';
  }

  public static TestIsString(value: unknown) {
    return typeof value === 'string';
  }

  public static capitalizeFirstLetter(text: string) {
    if (text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    } else {
      return text;
    }
  }

  public static toTitleCase(text: string) {
    return text.replace(/\w\S*/g, (subString) => {
      return subString.charAt(0).toUpperCase() + subString.substring(1).toLowerCase();
    });
  }

  public static toLowerCase(item: string | string[]) {
    if (Array.isArray(item)) {
      const loweredArray: string[] = [];

      for (let i = 0; i < item.length; i++) {
        loweredArray[i] = item[i].toLowerCase();
      }

      return loweredArray;
    } else {
      return item.toLowerCase();
    }
  }


  public static baseUrl() {
    let base = '';

    if (window.location.origin) {
      base = window.location.origin;
    } else {
      base = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }

    return base.replace(/\/$/, '');
  }

  public static searchArray(searchTerm: string, caseSensitive: boolean, ...values: unknown[]) {
    if (!searchTerm) {
      return true;
    }

    let filter = searchTerm.trim();
    let data = values.join();

    if (!caseSensitive) {
      filter = filter.toLowerCase();
      data = data.toLowerCase();
    }

    return data.indexOf(filter) !== -1;
  }

  public static testIsAbsoluteUrl(url: string) {
    const r = new RegExp('^(?:[a-z]+:)?//', 'i');
    return r.test(url);
  }

  public static convertToAbsoluteUrl(url: string) {
    return Utilities.testIsAbsoluteUrl(url) ? url : '//' + url;
  }

  public static debounce(fn: (...params: unknown[]) => unknown, delay: number, immediate?: boolean) {
    let timer: ReturnType<typeof setTimeout> | undefined;

    return function (this: unknown, ...args: unknown[]) {
      if (timer === undefined && immediate) {
        fn.apply(this, args);
      }

      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
      return timer;
    }
  }
}
