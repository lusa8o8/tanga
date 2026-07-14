import * as admin from 'firebase-admin';

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
admin.initializeApp({ projectId: 'taanga-taanga-dev' });

const db = admin.firestore();

async function seedSettings() {
  const settingsRef = db.collection('settings').doc('global');
  await settingsRef.set({
    contact: {
      salesEmail: "sales@taanga-taanga.com",
      generalEmail: "hello@taanga-taanga.com",
      phone: "+260 97 123 4567",
      address: "PO Box 31000, Lusaka, Zambia"
    },
    story: {
      quote: "Language is the soul of a people. Without our written word, our history is a fading echo.",
      paragraph1: "Taanga-Taanga Publishers Ltd. was founded with a singular, unwavering mission: to safeguard the Kiikaonde language through high-quality, accessible literature. In an era of global homogenization, we serve as the stewards of regional identity, providing a platform for local authors to capture the nuances of our culture, traditions, and linguistics.",
      paragraph2: "From complex grammatical studies to vibrant collections of folklore and modern narratives, our catalog is a testament to the intellectual richness of the Kiikaonde-speaking community. We are more than just a publisher; we are a cultural archive in motion."
    },
    hero: {
      watermark: "Heritage / Language",
      headline: "Preserving Heritage, One Page at a Time.",
      subHeadline: "Publishing books in Kiikaonde and Tonga that preserve language, culture, and history for future generations."
    },
    bulkOrders: {
      introText: "We supply schools, libraries, and language programs across Zambia and internationally. Discounted rates are available for institutional orders of 20 copies or more per title.",
      minimumOrder: "20 units (mixed titles permitted)",
      fulfillmentTime: "2-3 weeks (domestic), 4-6 weeks (international)",
      paymentTerms: "30 days Net for approved institutions"
    }
  });
  console.log("Settings seeded successfully.");
}

seedSettings().catch(console.error);
