import { DOMHelper } from '../helpers';

export const Button = ({
  text,
  variant = 'primary',
  asLink = false,
  attrs,
}) => {
  attrs = DOMHelper.parseAttributes(attrs);

  const tag = !asLink ? 'button' : 'a';

  return `<${tag} class="btn btn--${variant}"${attrs}>${text}</button>`;
};
