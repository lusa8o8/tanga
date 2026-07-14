import React from "react";

export const metadata = {
  title: "Privacy Policy | Taanga-Taanga Publishers Limited",
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl flex flex-col gap-12">
      <div>
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground uppercase tracking-widest">Last Updated: July 2026</p>
      </div>

      <div className="prose prose-stone dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">1. Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed">
            We collect information you provide directly to us when you submit an inquiry, place a bulk order, or contact us. This may include your name, email address, phone number, organization name, and any other information you choose to provide in your messages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">2. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Respond to your inquiries and fulfill bulk order requests.</li>
            <li>Communicate with you about products, services, and educational materials.</li>
            <li>Maintain and improve our website and customer service.</li>
            <li>Comply with our legal and financial obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">3. Information Sharing</h2>
          <p className="text-muted-foreground leading-relaxed">
            We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners and trusted affiliates.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">4. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, transaction information, and data stored on our site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">5. Contacting Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at:
            <br /><br />
            <strong>Taanga-Taanga Publishers Limited</strong><br />
            hello@taanga-taanga.com<br />
            PO Box 31000<br />
            Lusaka, Zambia
          </p>
        </section>
      </div>
    </div>
  );
}
