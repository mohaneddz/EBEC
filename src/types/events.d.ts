export type EventCard = {
  title: string;
  description: string;
  src: string;
  ctaText?: string;
  ctaLink?: string;
  content?: string | (() => React.ReactNode);
  event_date: string;
};

export type EventRow = {
  id: number | string;
  name?: string | null;
  pictures?: string[] | null;
  description?: string | null;
  brief?: string | null;
  date?: string | null;
};