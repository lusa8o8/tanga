import React from "react";
import { adminDb } from "@/lib/firebase-admin";

export const revalidate = 3600; // ISR: 1 hour

async function getSettings() {
  const doc = await adminDb.collection('settings').doc('global').get();
  return doc.data() || {};
}

export default async function About() {
  const settings = await getSettings();
  const story = settings.story || {};
  const contact = settings.contact || {};
  return (
    <div className="flex flex-col gap-24">
      <section>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-4 flex flex-col">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Our Story</h1>
            <span className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground/80">
              A Legacy of Language
            </span>
          </div>
          
          <div className="md:col-span-8 md:col-start-6 max-w-2xl border-l border-border pl-6 md:pl-10">
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p className="font-serif italic text-lg text-primary">
                "{story.quote || "Language is the soul of a people. Without our written word, our history is a fading echo."}"
              </p>
              <p>
                {story.paragraph1 || "Taanga-Taanga Publishers Ltd. was founded with a singular, unwavering mission: to safeguard the Kiikaonde language through high-quality, accessible literature. In an era of global homogenization, we serve as the stewards of regional identity, providing a platform for local authors to capture the nuances of our culture, traditions, and linguistics."}
              </p>
              <p>
                {story.paragraph2 || "From complex grammatical studies to vibrant collections of folklore and modern narratives, our catalog is a testament to the intellectual richness of the Kiikaonde-speaking community. We are more than just a publisher; we are a cultural archive in motion."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border pt-16">
        <h2 className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase mb-16 text-muted-foreground/80">
          Contact Directory
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="font-serif text-xl mb-4 text-primary">Sales & Bulk Orders</h3>
            <div className="text-muted-foreground text-sm flex flex-col gap-2">
              <p>{contact.salesEmail || "sales@taanga-taanga.com"}</p>
              <p>{contact.phone || "+260 97 123 4567"}</p>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-xl mb-4 text-primary">General Inquiries</h3>
            <div className="text-muted-foreground text-sm flex flex-col gap-2">
              <p>{contact.generalEmail || "hello@taanga-taanga.com"}</p>
              <p>{contact.address || "3 Green Lane Kabulonga, P.O. Box 31981, Lusaka"}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
