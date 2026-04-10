import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import User from '#models/user'
import Brand from '#models/brand'
import SocialPlatform from '#models/social_platform'
import Post from '#models/post'

export default class MainSeeder extends BaseSeeder {
  async run() {
    // ------------------------------------------------------------------ User
    const user = await User.create({
      username: 'demouser',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@smcc.dev',
      password: 'Password1!',
      isDeleted: false,
    })

    // ---------------------------------------------------------------- Brands
    const brand1 = await Brand.create({
      userId: user.id,
      name: 'Acme Corp',
      description: 'Corporate solutions brand focused on B2B.',
      toneOfVoice: 'professional',
      primaryColor: '#1E40AF',
    })

    const brand2 = await Brand.create({
      userId: user.id,
      name: 'Funky Threads',
      description: 'Fashion-forward streetwear brand for Gen Z.',
      toneOfVoice: 'witty',
      primaryColor: '#D97706',
    })

    // ----------------------------------------------------------- Platforms
    const linkedinPlatform = await SocialPlatform.create({
      brandId: brand1.id,
      platform: 'linkedin',
      isActive: true,
    })

    await SocialPlatform.create({
      brandId: brand1.id,
      platform: 'twitter',
      isActive: true,
    })

    const igPlatform = await SocialPlatform.create({
      brandId: brand2.id,
      platform: 'instagram',
      isActive: true,
    })

    await SocialPlatform.create({
      brandId: brand2.id,
      platform: 'tiktok',
      isActive: true,
    })

    // --------------------------------------------------------------- Posts
    await Post.create({
      brandId: brand1.id,
      platformId: linkedinPlatform.id,
      userId: user.id,
      title: 'Q2 Product Announcement',
      content:
        "Excited to share our Q2 product lineup. Our team has been working tirelessly to bring you enterprise-grade solutions that will redefine your workflow. Stay tuned for the full reveal — this one's big. #ProductLaunch #B2B",
      status: 'scheduled',
      isAiGenerated: false,
      scheduledAt: DateTime.now().plus({ days: 7 }),
    })

    await Post.create({
      brandId: brand1.id,
      platformId: linkedinPlatform.id,
      userId: user.id,
      title: 'Hiring: Senior Engineers',
      content:
        "We're growing! Acme Corp is looking for senior software engineers who love building scalable systems. Remote-friendly, competitive comp, and great culture. DM us or apply via the link. #Hiring #TechJobs",
      status: 'draft',
      isAiGenerated: false,
    })

    await Post.create({
      brandId: brand2.id,
      platformId: igPlatform.id,
      userId: user.id,
      title: 'Spring Style Drop 🌸',
      content:
        "Who said spring couldn't be EXTRA? 🌸✨ Our new collection just landed and it's giving everything. Tap the link in bio to shop before your fave pieces sell out. #FunkyThreads #SpringDrop #OOTD",
      status: 'draft',
      isAiGenerated: true,
    })

    await Post.create({
      brandId: brand2.id,
      platformId: igPlatform.id,
      userId: user.id,
      title: 'Weekend Outfit Inspo',
      content:
        "Weekend mode: activated. 🛋️☕ Tag someone you'd steal this fit from! 👀 #FunkyThreads #WeekendVibes #StreetStyle",
      status: 'published',
      isAiGenerated: true,
      publishedAt: DateTime.now().minus({ days: 2 }),
    })
  }
}
