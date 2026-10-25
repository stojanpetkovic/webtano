import { PageEnter } from '@/components/site/PageEnter';

export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <PageEnter>{children}</PageEnter>;
}
