"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqItems } from "@/lib/config";
import { SectionHeading } from "@/components/ui/section-heading";

const lede = "Got questions? We've got answers.";

export function FAQSection() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="container-wide grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading align="left" title="Frequently Asked Questions" lede={lede} />
        </div>

        <div className="reveal lg:col-span-7">
          <Accordion type="single" collapsible className="w-full border-t border-border">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="py-5 text-left font-heading text-lg font-semibold hover:no-underline hover:text-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="mt-8 text-muted-foreground">
            Still have questions?{" "}
            <a href="/contact" className="font-medium text-primary underline-offset-4 hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
