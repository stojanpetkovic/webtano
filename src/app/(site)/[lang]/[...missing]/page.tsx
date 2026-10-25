import { notFound } from 'next/navigation';

// Unknown addresses in either language get the site's 404 in that language.
export default function Missing() {
  notFound();
}
