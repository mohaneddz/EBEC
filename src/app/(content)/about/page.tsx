import { Accordion } from "@/components/others/Accordion";
import { faqData } from "@/data/faq";
import { generateFAQSchema } from "@/utils/faqSchema";

const Faq = () => {
    const faqSchema = generateFAQSchema(faqData);

  return (
    <div className="h-full pt-16 overflow-hidden bg-gradient-to-b from-primary-light to-primary-dark">
      <div className="text-center mb-4">
        <h1 className="text-2xl sm:text-5xl text-secondary-dark mb-8 font-black">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-white/80">
          <b><u>Everything</u></b> you need to know about EBEC
        </p>
      </div>

      <div className="space-y-6">
        <Accordion accordionData={faqData} />
      </div>

      {/* JSON-LD for crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
};

export default Faq;
