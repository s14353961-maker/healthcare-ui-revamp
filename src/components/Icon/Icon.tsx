import type { SVGProps } from 'react';

const paths = {
  check: 'M5 12.5l4.5 4.5L19 7.5',
  alert: 'M12 8v5m0 3.5v.01M10.3 3.9L2.6 17.5A2 2 0 004.3 20.5h15.4a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z',
  chevronDown: 'M6 9l6 6 6-6',
  table: 'M3 5h18v14H3zM3 10h18M3 15h18M9 5v14',
  cards: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  clock: 'M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  pin: 'M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0',
  file: 'M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h6',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z',
  info: 'M12 11v6M12 7.5v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
} as const;

export type IconName = keyof typeof paths;

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

/** Decorative by default (aria-hidden). Pass `aria-label` + `role="img"` when it carries meaning. */
export function Icon({ name, size = 18, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={rest['aria-label'] ? undefined : true}
      focusable="false"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}
