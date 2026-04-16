import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Brand from '#models/brand'
import SocialPlatform from '#models/social_platform'
import Post from '#models/post'
import BrandMember from '#models/brand_member'

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
    })

    // ---------------------------------------------------------------- Brands
    const brand1 = await Brand.create({
      name: 'Acme Corp',
      description: 'Corporate solutions brand focused on B2B.',
      toneOfVoice: 'professional',
      primaryColor: '#1E40AF',
    })

    await BrandMember.create({
      brandId: brand1.id,
      userId: user.id,
      role: 'owner'
    })

    const brand2 = await Brand.create({
      name: 'Funky Threads',
      description: 'Fashion-forward streetwear brand for Gen Z.',
      toneOfVoice: 'witty',
      primaryColor: '#D97706',
    })

    await BrandMember.create({
      brandId: brand2.id,
      userId: user.id,
      role: 'owner'
    })

    // ----------------------------------------------------------- Platforms
    await SocialPlatform.create({
      platform: 'linkedin',
      isActive: false,
    })

    await SocialPlatform.create({
      platform: 'twitter',
      isActive: false,
    })

    await SocialPlatform.create({
      platform: 'mastodon',
      isActive: true,
    })

    await SocialPlatform.create({
      platform: 'instagram',
      isActive: false,
    })

    // --------------------------------------------------------------- Posts
    await Post.create({
      brandId: brand1.id,
      title: 'Q2 Product Announcement',
      content:
        "Excited to share our Q2 product lineup. Our team has been working tirelessly to bring you enterprise-grade solutions that will redefine your workflow. Stay tuned for the full reveal — this one's big. #ProductLaunch #B2B",
      state: 'draft',
      isAiGenerated: false,
      createdBy: user.id
    })

    await Post.create({
      brandId: brand1.id,
      title: 'Hiring: Senior Engineers',
      content:
        "We're growing! Acme Corp is looking for senior software engineers who love building scalable systems. Remote-friendly, competitive comp, and great culture. DM us or apply via the link. #Hiring #TechJobs",
      state: 'draft',
      isAiGenerated: false,
      createdBy: user.id
    })

    await Post.create({
      brandId: brand2.id,
      title: 'Spring Style Drop 🌸',
      content:
        "Who said spring couldn't be EXTRA? 🌸✨ Our new collection just landed and it's giving everything. Tap the link in bio to shop before your fave pieces sell out. #FunkyThreads #SpringDrop #OOTD",
      state: 'draft',
      isAiGenerated: true,
      createdBy: user.id
    })

    await Post.create({
      brandId: brand2.id,
      title: 'Weekend Outfit Inspo',
      content:
        "Weekend mode: activated. 🛋️☕ Tag someone you'd steal this fit from! 👀 #FunkyThreads #WeekendVibes #StreetStyle",
      state: 'draft',
      isAiGenerated: true,
      createdBy: user.id
    })
  }
}
