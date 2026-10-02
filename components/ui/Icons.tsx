import type { SVGProps } from "react";
const base = { width: "1em", height: "1em", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true } as const;

export const PlayIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z" /></svg>
);
export const CartIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M2 3h3l.4 2H21l-2.2 8.2a2 2 0 0 1-1.9 1.5H8.3L8.7 17H19v2H7.2l-.4-1.7L4.2 5H2V3Zm6 17a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm9 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" /></svg>
);
export const GiftIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M12 7c-.6-2.5-2-4-3.8-4A2.7 2.7 0 0 0 8.3 8.4H4a1 1 0 0 0-1 1V12h8V7.6L12 7Zm0 0c.6-2.5 2-4 3.8-4a2.7 2.7 0 0 1-.1 5.4H20a1 1 0 0 1 1 1V12h-8V7.6L12 7ZM4 13.5h7V21H5.5A1.5 1.5 0 0 1 4 19.5v-6Zm9 0h7v6a1.5 1.5 0 0 1-1.5 1.5H13v-7.5Z" /></svg>
);
export const ClipboardIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M9 2h6a1 1 0 0 1 1 1v1h2.5A1.5 1.5 0 0 1 20 5.5v15a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 20.5v-15A1.5 1.5 0 0 1 5.5 4H8V3a1 1 0 0 1 1-1Zm1 2v1.5h4V4h-4Zm5.7 7.3-1.4-1.4-3.8 3.8-1.8-1.8-1.4 1.4 3.2 3.2 5.2-5.2Z" /></svg>
);
export const BackIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M4 11h12.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H4v-2Z" /></svg>
);
export const StarIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden {...p}><path fill="currentColor" d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8L12 2.5Z" /></svg>
);
export const CloseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5Z" /></svg>
);
