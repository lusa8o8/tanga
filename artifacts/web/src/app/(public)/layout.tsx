import { PublicLayout } from "@/components/layout/PublicLayout";
import { adminDb } from "@/lib/firebase-admin";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const doc = await adminDb.collection('settings').doc('global').get();
  const settings = doc.data() || {};
  
  return <PublicLayout settings={settings}>{children}</PublicLayout>;
}
