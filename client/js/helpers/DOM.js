export const parseAttributes = (attrs) => {
  if (!attrs || attrs.length === 0) return '';

  const parsedAttrs = Object.keys(attrs).reduce((result, attr) => {
    const value = attrs[attr];

    if (value != null) {
      return (result += `${attr}="${value}"`);
    }

    return (result += `${attr}`);
  }, '');

  return parsedAttrs ? ` ${parsedAttrs}` : '';
};
