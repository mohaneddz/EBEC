import { faqData } from "@/data/faq";
import { generateFAQSchema } from "@/utils/faqSchema";
import { Accordion } from "@/components/others/Accordion";

export default function FrequentQuestions() {
    const faqSchema = generateFAQSchema(faqData);


    return (
        <div className="h-full pt-16 overflow-hidden">
            <div className="text-center mb-4">
                <h1 className="text-2xl sm:text-5xl text-secondary-dark mb-8 font-black">
                    Frequently Asked Questions
                </h1>
                <p className="text-lg text-black/80">
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
