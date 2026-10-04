import type { TbpIconName } from '../../shared/ui/tbp-icon/tbp-icon.types';

export interface SocialLink {
  name: string;
  href: string;
  icon: TbpIconName;
}

// Réseaux sociaux (sans paramètres de suivi), EDB section 11.
export const SOCIAL_LINKS: SocialLink[] = [
  { name: 'Instagram', href: 'https://www.instagram.com/teambaraia.promotion', icon: 'instagram' },
  { name: 'YouTube', href: 'https://youtube.com/@teambaraiapromotion', icon: 'youtube' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@teambaraia.promotion', icon: 'tiktok' },
  { name: 'Kick', href: 'https://kick.com/teambaraiapromotion', icon: 'kick' },
];
