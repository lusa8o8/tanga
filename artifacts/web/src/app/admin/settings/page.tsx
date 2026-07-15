"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SiteSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (section: string, field: string, value: string) => {
    setSettings((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setMessage("Settings saved successfully.");
      } else {
        setMessage("Failed to save settings.");
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred while saving.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) return <div>Loading settings...</div>;
  if (!settings) return <div>Error loading settings.</div>;

  return (
    <div className="max-w-4xl flex flex-col gap-12 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif text-primary mb-2">Site Settings</h1>
          <p className="text-muted-foreground text-lg">Manage global content and copy across the public website.</p>
        </div>
      </div>

      {/* Global Contact Details */}
      <section className="bg-card border border-border p-8">
        <h2 className="font-serif text-2xl text-primary mb-6">Global Contact Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Sales Email</label>
            <Input 
              value={settings.contact?.salesEmail || ""} 
              onChange={e => handleChange('contact', 'salesEmail', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">General Email</label>
            <Input 
              value={settings.contact?.generalEmail || ""} 
              onChange={e => handleChange('contact', 'generalEmail', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Phone Number</label>
            <Input 
              value={settings.contact?.phone || ""} 
              onChange={e => handleChange('contact', 'phone', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Physical/Postal Address</label>
            <Input 
              value={settings.contact?.address || ""} 
              onChange={e => handleChange('contact', 'address', e.target.value)} 
            />
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-card border border-border p-8">
        <h2 className="font-serif text-2xl text-primary mb-6">"Our Story" Content</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">The Pull Quote</label>
            <Textarea 
              value={settings.story?.quote || ""} 
              onChange={e => handleChange('story', 'quote', e.target.value)} 
              className="font-serif italic"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Paragraph 1</label>
            <Textarea 
              value={settings.story?.paragraph1 || ""} 
              onChange={e => handleChange('story', 'paragraph1', e.target.value)} 
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Paragraph 2</label>
            <Textarea 
              value={settings.story?.paragraph2 || ""} 
              onChange={e => handleChange('story', 'paragraph2', e.target.value)} 
              className="min-h-[100px]"
            />
          </div>
        </div>
      </section>

      {/* Homepage Hero */}
      <section className="bg-card border border-border p-8">
        <h2 className="font-serif text-2xl text-primary mb-6">Homepage Hero</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Background Watermark</label>
            <Input 
              value={settings.hero?.watermark || ""} 
              onChange={e => handleChange('hero', 'watermark', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Main Headline</label>
            <Input 
              value={settings.hero?.headline || ""} 
              onChange={e => handleChange('hero', 'headline', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Sub-headline Description</label>
            <Textarea 
              value={settings.hero?.subHeadline || ""} 
              onChange={e => handleChange('hero', 'subHeadline', e.target.value)} 
            />
          </div>
        </div>
      </section>

      {/* Bulk Orders Terms */}
      <section className="bg-card border border-border p-8">
        <h2 className="font-serif text-2xl text-primary mb-6">Bulk Orders Terms</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Introductory Paragraph</label>
            <Textarea 
              value={settings.bulkOrders?.introText || ""} 
              onChange={e => handleChange('bulkOrders', 'introText', e.target.value)} 
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Minimum Order Threshold</label>
            <Input 
              value={settings.bulkOrders?.minimumOrder || ""} 
              onChange={e => handleChange('bulkOrders', 'minimumOrder', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Fulfillment Times</label>
            <Input 
              value={settings.bulkOrders?.fulfillmentTime || ""} 
              onChange={e => handleChange('bulkOrders', 'fulfillmentTime', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Payment Terms</label>
            <Input 
              value={settings.bulkOrders?.paymentTerms || ""} 
              onChange={e => handleChange('bulkOrders', 'paymentTerms', e.target.value)} 
            />
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 w-full bg-background border-t border-border p-4 z-50">
        <div className="max-w-7xl mx-auto flex items-center gap-6 justify-end px-6 md:px-12">
          {message && <span className="text-sm font-medium text-primary">{message}</span>}
          <Button size="lg" className="rounded-none px-8" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}
