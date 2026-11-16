import { privacy } from '@/content/pages';
import { pageMeta } from '@/lib/seo';
import { LegalPage } from '@/components/ui/LegalPage';

export const metadata = pageMeta({ title: 'Privacy policy', description: 'What we collect, why we collect it and how we keep it safe.', path: '/privacy' });

export default function PrivacyPage() {
  return <LegalPage kicker="Privacy policy" title="Your *privacy* matters" intro="What we collect, why we collect it and how we keep it safe." sections={privacy} updated="[DATE]" />;
}
