export type EventCard = {
  title: string;
  description: string;
  src: string;
  ctaText?: string;
  ctaLink?: string;
  content?: string | (() => React.ReactNode);
};