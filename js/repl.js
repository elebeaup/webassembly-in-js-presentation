import FakeTerminal from './fakeTerminal.js';

const getPropertiesNames = (obj) => {
  let properties = new Set();
  let currentObj = Array.isArray(obj) || ArrayBuffer.isView(obj) ? Object.getPrototypeOf(obj) : obj;
  do {
    Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item));
  } while ((currentObj = Object.getPrototypeOf(currentObj)));

  return Array.from(properties);
};

const longestCommonStartingSubstring = (strings = []) => {
  if (strings.length === 0) return '';

  const orderedStrings = strings.sort();
  const smallestString = orderedStrings[0];
  const largestString = orderedStrings[orderedStrings.length - 1];
  const maxLength = smallestString.length;

  let i = 0;
  while (i < maxLength && smallestString.charAt(i) === largestString.charAt(i)) i++;
  return smallestString.substring(0, i);
};

const stringify = (obj) => {
  if (typeof obj === 'function') {
    return obj.toString().replace(/^function/, 'f');
  } else if (Array.isArray(obj) || ArrayBuffer.isView(obj)) {
    const values = Array.from(obj.slice(0, 100).map((value) => stringify(value)));

    if (values.length !== obj.length) {
      values.push('...');
    }

    return `(${obj.length}) : [ ${values.join(', ')} ]`;
  } else if (typeof obj === 'object') {
    const propertyNames = Object.getOwnPropertyNames(obj);
    const properties = propertyNames.slice(0, 5).map((property) => {
      const value = obj[property];
      const propertyType = typeof value;

      const propertyTypeStringify =
        propertyType === 'object'
          ? `${value?.constructor?.name ?? '{...}'}`
          : propertyType === 'function'
          ? 'f'
          : value;
      return `${property} : ${propertyTypeStringify}`;
    });

    if (properties.length !== propertyNames.length) {
      properties.push('...');
    }

    return `${obj?.constructor?.name ?? ''} {${properties.join(', ')}}`;
  } else {
    return obj;
  }
};

class Repl {
  constructor(context) {
    this.context = context;
    this.write = this.write.bind(this);
    this._completeHandler = this._completeHandler.bind(this);
  }

  start() {
    const fakeTerminal = new FakeTerminal();
    this.fakeTerminal = fakeTerminal;

    fakeTerminal.onInputEntered = async (input) => {
      const result = new Function(`return (${input})`).bind(this.context)();
      return stringify(result);
    };

    fakeTerminal.registerCompleteHandler(this._completeHandler);
  }

  write(str) {
    this.fakeTerminal.print(`\n${str}`);
  }

  _completeHandler(input) {
    const pointPosition = input.lastIndexOf('.');
    const startExpressionMatcher = input.match(/[^[a-z0-9\.]/gi);
    const startExpression = startExpressionMatcher ? input.lastIndexOf(startExpressionMatcher[startExpressionMatcher.length - 1]) : -1;
    let scope = window;
    let tokens = pointPosition === -1 ? [] : input.substring(startExpression + 1, pointPosition).split('.');
    const lastFragment = pointPosition === -1 ? input.substring(startExpression + 1) : input.substr(pointPosition + 1);

    if (tokens[0] === 'this' || tokens[0] === 'window') {
      if (tokens[0] === 'this') {
        scope = this.context;
      }

      tokens = tokens.slice(1);
    }

    const result = tokens.reduce((accumulator, currentValue) => accumulator[currentValue], scope);

    const candidates = getPropertiesNames(result).filter((propertyName) => propertyName.startsWith(lastFragment));
    const candidate = longestCommonStartingSubstring(candidates).substr(lastFragment.length);

    return candidate;
  }
}

export default Repl;
