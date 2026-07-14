import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.name || !data.email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Save to Firestore
    const docRef = await adminDb.collection('inquiries').add({
      ...data,
      status: 'new',
      createdAt: new Date().toISOString(),
    });

    // Internal notification email
    const internalEmail = {
      from: process.env.RESEND_FROM_EMAIL || 'Acme <onboarding@resend.dev>',
      to: ['sales@taanga-taanga.com'],
      subject: `New ${data.inquirerType === 'school' ? 'Institutional' : 'Individual'} Inquiry from ${data.name}`,
      text: `New inquiry received (ID: ${docRef.id}):\n
Type: ${data.inquirerType}
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'N/A'}
Organization: ${data.organizationName || 'N/A'}
Titles of Interest: ${data.titlesOfInterest || 'N/A'}
Quantity: ${data.quantityInterest || 'N/A'}
Message: ${data.message || 'N/A'}

View in admin: https://taanga-taanga.com/admin/inquiries`
    };

    // Auto-reply
    const autoReplyEmail = {
      from: process.env.RESEND_FROM_EMAIL || 'Acme <onboarding@resend.dev>',
      to: [data.email],
      subject: 'We received your inquiry — Taanga-Taanga Publishers Limited',
      text: `Hi ${data.name},\n\nThank you for reaching out to Taanga-Taanga Publishers Limited. We have received your inquiry and will get back to you within 48 hours.\n\nBest regards,\nThe Taanga-Taanga Team`
    };

    if (process.env.RESEND_API_KEY) {
      await resend.batch.send([internalEmail, autoReplyEmail]);
    } else {
      console.log('[Inquiry] RESEND_API_KEY not set. Would have sent:', internalEmail.subject);
    }

    return NextResponse.json({ status: 'success', id: docRef.id });
  } catch (error) {
    console.error('Error handling inquiry:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
