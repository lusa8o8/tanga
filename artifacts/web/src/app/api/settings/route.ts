import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const doc = await adminDb.collection('settings').doc('global').get();
    if (!doc.exists) {
      // Return default empty structure if it doesn't exist yet
      return NextResponse.json({
        contact: { salesEmail: "", generalEmail: "", phone: "", address: "3 Green Lane Kabulonga, P.O. Box 31981, Lusaka" },
        story: { quote: "", paragraph1: "", paragraph2: "" },
        hero: { watermark: "", headline: "", subHeadline: "" },
        bulkOrders: { introText: "", minimumOrder: "", fulfillmentTime: "", paymentTerms: "" }
      });
    }
    return NextResponse.json(doc.data());
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await adminDb.collection('settings').doc('global').set(data, { merge: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
