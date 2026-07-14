import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const revalidate = 86400; // ISR

export default function BulkOrders() {
  return (
    <div className="max-w-3xl flex flex-col gap-12">
      <div>
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Bulk Orders</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          <span className="text-muted">— placeholder copy —</span><br/>
          We supply schools, libraries, and language programs across Zambia and internationally. 
          Discounted rates are available for institutional orders of 20 copies or more per title.
        </p>
      </div>

      <section className="border-t border-border pt-12">
        <h2 className="font-sans text-xs font-semibold tracking-widest uppercase mb-8 text-muted-foreground">
          How It Works
        </h2>
        
        <div className="flex flex-col gap-8">
          <div className="flex gap-6">
            <div className="font-serif text-2xl text-muted-foreground">1</div>
            <div>
              <h3 className="font-medium text-lg mb-2">Submit an Inquiry</h3>
              <p className="text-muted-foreground">Fill out our inquiry form with your institution details and titles of interest.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="font-serif text-2xl text-muted-foreground">2</div>
            <div>
              <h3 className="font-medium text-lg mb-2">Receive Quote & Terms</h3>
              <p className="text-muted-foreground">We will provide a formal quotation including shipping estimates within 48 hours.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="font-serif text-2xl text-muted-foreground">3</div>
            <div>
              <h3 className="font-medium text-lg mb-2">Confirm Order & Delivery</h3>
              <p className="text-muted-foreground">Once payment terms are confirmed, we process and dispatch your order.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border py-8 my-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm">
          <div className="text-muted-foreground">Minimum Order</div>
          <div>20 units (mixed titles permitted)</div>
          
          <div className="text-muted-foreground">Fulfillment Time</div>
          <div>2-3 weeks (domestic), 4-6 weeks (international)</div>
          
          <div className="text-muted-foreground">Payment Terms</div>
          <div>30 days Net for approved institutions</div>
        </div>
      </section>

      <div>
        <Button asChild size="lg" className="rounded-none">
          <Link href="/inquiry">Start an Inquiry</Link>
        </Button>
      </div>
    </div>
  );
}
