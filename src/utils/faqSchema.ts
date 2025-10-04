import { FAQItem } from "@/types/about";

interface SchemaAnswer {
  "@type": "Answer";
  text: string;
}

interface SchemaQuestion {
  "@type": "Question";
  name: string;
  acceptedAnswer: SchemaAnswer;
}

interface FAQPageSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: SchemaQuestion[];
}

export const generateFAQSchema = (faqData: FAQItem[]): FAQPageSchema => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqData.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});
