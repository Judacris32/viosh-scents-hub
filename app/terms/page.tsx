import { terms } from '@/content/pages';
import { pageMeta } from '@/lib/seo';
import { LegalPage } from '@/components/ui/LegalPage';

export const metadata = pageMeta({ title: 'Terms of sale', description: 'The terms that apply when you buy from Viosh Scents Hub.', path: '/terms' });

export default function TermsPage() {
  return <LegalPage kicker="Terms of sale" title="Terms of *sale*" intro="The terms that apply when you buy from Viosh Scents Hub." sections={terms} updated="[DATE]" />;
}
