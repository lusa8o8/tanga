import React from "react";

export const metadata = {
  title: "Terms of Service | Taanga-Taanga Publishers Limited",
};

export default function TermsOfService() {
  return (
    <div className="max-w-3xl flex flex-col gap-12">
      <div>
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Terms of Service</h1>
        <p className="text-sm text-muted-foreground uppercase tracking-widest">Last Updated: July 2026</p>
      </div>

      <div className="prose prose-stone dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing and using the website of Taanga-Taanga Publishers Limited ("we," "us," or "our"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">2. Intellectual Property Rights</h2>
          <p className="text-muted-foreground leading-relaxed">
            All content published and made available on our site is the property of Taanga-Taanga Publishers Limited and the site's creators. This includes, but is not limited to images, text, logos, documents, downloadable files and anything that contributes to the composition of our site. 
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">3. Bulk Orders and Purchasing</h2>
          <p className="text-muted-foreground leading-relaxed">
            When you make an inquiry for a bulk order, you are not legally bound to a purchase until a formal quotation is accepted and terms of payment are agreed upon in writing. We reserve the right to refuse or cancel any order at any time for reasons including but not limited to: product availability, errors in the description or price of the product, or error in your order.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">4. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            Taanga-Taanga Publishers Limited and our directors, officers, agents, employees, subsidiaries, and affiliates will not be liable for any actions, claims, losses, damages, liabilities and expenses including legal fees from your use of the site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">5. Modifications</h2>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right to modify these Terms at any time. We will always post the most current version on our site. By continuing to use the site after changes become effective, you agree to be bound by the revised terms.
          </p>
        </section>
      </div>
    </div>
  );
}
