// Serbian versions of the posts, under the same slug as the English ones.
// Dates, category and sources stay the same; only the text is translated.
import type { Post } from '../types';
import { post as aiMode } from './ai-mode-local-search';
import { post as callTracking } from './call-tracking-contractors';
import { post as googleAds } from './google-ads-tree-services';
import { post as businessProfile } from './google-business-profile-tree-service';
import { post as lsaMove } from './local-services-ads-google-ads';
import { post as spamUpdate } from './spam-update-september-2026';
import { post as speedToLead } from './speed-to-lead';
import { post as treeWebsite } from './tree-service-website';
import { post as websiteSpeed } from './website-speed';

const all: Post[] = [aiMode, callTracking, googleAds, businessProfile, lsaMove, spamUpdate, speedToLead, treeWebsite, websiteSpeed];

export const postsSr: Record<string, Post> = Object.fromEntries(all.map((p) => [p.slug, p]));
