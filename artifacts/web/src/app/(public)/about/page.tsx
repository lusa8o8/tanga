import React from "react";

export const revalidate = 86400; // ISR

export default function About() {
  return (
    <div className="max-w-3xl flex flex-col gap-16">
      <div>
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-8">About Taanga-Taanga Publishers Limited</h1>
        <div className="text-lg text-muted-foreground leading-relaxed space-y-6">
          <span className="text-muted block mb-4">— placeholder copy —</span>
          <p>
            Taanga-Taanga Publishers Limited is an independent press dedicated to the preservation,
            celebration, and continued vitality of the Kiikaonde and Tonga/Chitonga languages.
          </p>
          <p>
            Founded with the belief that a language must be read to truly live, we work
            with local authors, educators, and historians to produce high-quality literature,
            educational materials, and cultural records. Our catalog spans from essential
            grammar texts to vibrant folktale collections.
          </p>
        </div>
      </div>

      <section className="border-t border-border pt-12">
        <h2 className="font-sans text-xs font-semibold tracking-widest uppercase mb-12 text-muted-foreground">
          Contact Directory
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="font-serif text-xl mb-4 text-primary">Sales & Bulk Orders</h3>
            <div className="text-muted-foreground text-sm flex flex-col gap-2">
              <p>sales@taanga-taanga.com</p>
              <p>+260 97 123 4567</p>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-xl mb-4 text-primary">General Inquiries</h3>
            <div className="text-muted-foreground text-sm flex flex-col gap-2">
              <p>hello@taanga-taanga.com</p>
              <p>PO Box 31000<br/>Lusaka, Zambia</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
