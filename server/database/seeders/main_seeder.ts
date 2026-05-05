import { BaseSeeder } from '@adonisjs/lucid/seeders';
import User from '#models/user';
import Brand from '#models/brand';
import SocialPlatform from '#models/social_platform';
import Post from '#models/post';
import BrandMember from '#models/brand_member';

export default class MainSeeder extends BaseSeeder {
  async run() {
    // ------------------------------------------------------------------ User
    const user = await User.create({
      username: 'jude1',
      firstName: 'Jude',
      lastName: 'Laurel',
      email: 'jude.laurel@dev.com',
      password: 'P@ssw0rd123!',
      isDeleted: false,
    });

    // ---------------------------------------------------------------- Brands
    const brand1 = await Brand.create({
      name: 'Acme Corp',
      description: 'Corporate solutions brand focused on B2B.',
      toneOfVoice: 'professional',
      primaryColor: '#1E40AF',
    });

    await BrandMember.create({
      brandId: brand1.id,
      userId: user.id,
      role: 'owner',
    });

    const brand2 = await Brand.create({
      name: 'Funky Threads',
      description: 'Fashion-forward streetwear brand for Gen Z.',
      toneOfVoice: 'witty',
      primaryColor: '#D97706',
    });

    await BrandMember.create({
      brandId: brand2.id,
      userId: user.id,
      role: 'owner',
    });

    const extraBrands = [
      {
        name: 'Nova Digital',
        description: 'Digital marketing agency for startups and scale-ups.',
        toneOfVoice: 'professional' as const,
        primaryColor: '#7C3AED',
      },
      {
        name: 'The Green Table',
        description:
          'Plant-based restaurant chain promoting sustainable eating.',
        toneOfVoice: 'casual' as const,
        primaryColor: '#16A34A',
      },
      {
        name: 'Ironclad Fitness',
        description: 'Performance fitness brand for serious athletes.',
        toneOfVoice: 'formal' as const,
        primaryColor: '#DC2626',
      },
      {
        name: 'Pixel & Co.',
        description: 'Creative studio specialising in UI/UX and branding.',
        toneOfVoice: 'witty' as const,
        primaryColor: '#DB2777',
      },
      {
        name: 'SkyRoute Travel',
        description: 'Budget travel platform connecting adventurers worldwide.',
        toneOfVoice: 'casual' as const,
        primaryColor: '#0284C7',
      },
      {
        name: 'Zenith Finance',
        description:
          'Wealth management and fintech solutions for professionals.',
        toneOfVoice: 'formal' as const,
        primaryColor: '#0F766E',
      },
      {
        name: 'Bloom Beauty',
        description: 'Cruelty-free cosmetics and skincare brand.',
        toneOfVoice: 'casual' as const,
        primaryColor: '#EC4899',
      },
      {
        name: 'ByteForge Labs',
        description: 'Open-source developer tools and cloud infrastructure.',
        toneOfVoice: 'professional' as const,
        primaryColor: '#4F46E5',
      },
      {
        name: 'Urban Roast',
        description: 'Specialty coffee roastery with a community-first ethos.',
        toneOfVoice: 'witty' as const,
        primaryColor: '#92400E',
      },
      {
        name: 'Harvest Home',
        description: 'Organic grocery delivery direct from local farms.',
        toneOfVoice: 'casual' as const,
        primaryColor: '#65A30D',
      },
      {
        name: 'Meridian Law',
        description: 'Boutique legal firm focused on tech and IP law.',
        toneOfVoice: 'formal' as const,
        primaryColor: '#1D4ED8',
      },
      {
        name: 'Apex Motorsport',
        description: 'Performance parts and racing lifestyle brand.',
        toneOfVoice: 'witty' as const,
        primaryColor: '#B91C1C',
      },
      {
        name: 'CloudNest SaaS',
        description: 'All-in-one project management platform for remote teams.',
        toneOfVoice: 'professional' as const,
        primaryColor: '#0E7490',
      },
    ];

    for (const brandData of extraBrands) {
      const brand = await Brand.create(brandData);
      await BrandMember.create({
        brandId: brand.id,
        userId: user.id,
        role: 'owner',
      });
    }

    // ----------------------------------------------------------- Platforms
    await SocialPlatform.create({
      platform: 'linkedin',
      isActive: false,
    });

    await SocialPlatform.create({
      platform: 'twitter',
      isActive: false,
    });

    await SocialPlatform.create({
      platform: 'mastodon',
      isActive: true,
    });

    await SocialPlatform.create({
      platform: 'instagram',
      isActive: false,
    });

    // --------------------------------------------------------------- Posts
    await Post.create({
      brandId: brand1.id,
      title: 'Q2 Product Announcement',
      content:
        "Excited to share our Q2 product lineup. Our team has been working tirelessly to bring you enterprise-grade solutions that will redefine your workflow. Stay tuned for the full reveal — this one's big. #ProductLaunch #B2B",
      state: 'draft',
      isAiGenerated: false,
      createdBy: user.id,
    });

    await Post.create({
      brandId: brand1.id,
      title: 'Hiring: Senior Engineers',
      content:
        "We're growing! Acme Corp is looking for senior software engineers who love building scalable systems. Remote-friendly, competitive comp, and great culture. DM us or apply via the link. #Hiring #TechJobs",
      state: 'draft',
      isAiGenerated: false,
      createdBy: user.id,
    });

    await Post.create({
      brandId: brand2.id,
      title: 'Spring Style Drop 🌸',
      content:
        "Who said spring couldn't be EXTRA? 🌸✨ Our new collection just landed and it's giving everything. Tap the link in bio to shop before your fave pieces sell out. #FunkyThreads #SpringDrop #OOTD",
      state: 'draft',
      isAiGenerated: true,
      createdBy: user.id,
    });

    await Post.create({
      brandId: brand2.id,
      title: 'Weekend Outfit Inspo',
      content:
        "Weekend mode: activated. 🛋️☕ Tag someone you'd steal this fit from! 👀 #FunkyThreads #WeekendVibes #StreetStyle",
      state: 'draft',
      isAiGenerated: true,
      createdBy: user.id,
    });
  }
}
