"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Inquiry() {
  const [books, setBooks] = useState<any[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [phone, setPhone] = useState("+26");

  const formatPhoneNumber = (value: string) => {
    // Extract all digits from the input
    let digits = value.replace(/\D/g, "");
    
    // Ensure the number always starts with 26
    if (!digits.startsWith("26")) {
      // If user pastes a number without 26 (like 097...), append it after 26.
      // The replace handles edge cases where they backspaced part of the prefix.
      digits = "26" + digits.replace(/^2?6?/, ""); 
    }

    // Limit to typical Zambian number length (260 + 9 digits = 12 digits total)
    digits = digits.slice(0, 12);

    // Group into clusters of 3
    const match = digits.match(/.{1,3}/g);
    if (match) {
      return "+" + match.join(" ");
    }
    return "+26";
  };

  
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const titleFromQuery = searchParams.get('title');
    if (titleFromQuery) {
      setSelectedTitle(titleFromQuery);
    }

    // Fetch published books for the picker
    fetch('/api/books')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBooks(data);
        }
      })
      .catch(err => console.error("Failed to fetch books", err));
  }, []);



  const [type, setType] = useState<"school" | "individual">("school");
  const [successMsg, setSuccessMsg] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    const fd = new FormData(e.currentTarget);
    const data = {
      inquirerType: type,
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      organizationName: fd.get("organizationName") as string,
      titlesOfInterest: fd.get("titlesOfInterest") as string,
      quantityInterest: fd.get("quantityInterest") as string,
      message: fd.get("message") as string,
    };

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const json = await res.json();
      if (res.ok) {
        setSuccessMsg("Inquiry submitted successfully. We will be in touch soon!");
      } else {
        alert(json.error || "Failed to submit inquiry.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while submitting.");
    } finally {
      setIsPending(false);
    }
  };

  if (successMsg) {
    return (
      <div className="max-w-xl py-12">
        <h1 className="text-4xl font-serif text-primary mb-6">Thank You</h1>
        <p className="text-lg text-muted-foreground">{successMsg}</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-4xl font-serif text-primary mb-8">Inquiry</h1>
      
      <div className="flex gap-2 mb-12 p-1 bg-muted/30 rounded-full w-fit">
        <button 
          type="button"
          onClick={() => setType("school")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${type === 'school' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          School / Institution
        </button>
        <button 
          type="button"
          onClick={() => setType("individual")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${type === 'individual' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Individual
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {type === "school" && (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Organization Name *</label>
            <Input name="organizationName" required />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Contact Name *</label>
          <Input name="name" required />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Email Address *</label>
          <Input name="email" type="email" required />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Phone Number</label>
          <Input 
            name="phone" 
            value={phone}
            onChange={(e) => {
              setPhone(formatPhoneNumber(e.target.value));
            }}
            placeholder="+260 900 000 000"
            maxLength={16} // + plus 12 digits plus 3 spaces
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Title of Interest</label>
          <select 
            name="titlesOfInterest"
            value={selectedTitle}
            onChange={(e) => setSelectedTitle(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select a title from our catalogue...</option>
            {books.map(book => (
              <option key={book.id} value={book.title}>{book.title}</option>
            ))}
          </select>
        </div>

        {type === "school" && (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Quantity Estimate</label>
            <Input 
              type="number" 
              name="quantityInterest" 
              min="1" 
              placeholder="e.g., 50" 
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Additional Message</label>
          <Textarea name="message" className="min-h-[120px]" />
        </div>

        <Button type="submit" size="lg" className="rounded-none w-fit mt-4" disabled={isPending}>
          {isPending ? "Sending..." : "Submit Inquiry"}
        </Button>
      </form>
    </div>
  );
}
