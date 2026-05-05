import redis from '@adonisjs/redis/services/main';

export const CacheTTL = {
  brands: 300,
  posts: 300,
  schedules: 120,
  socialAccounts: 300,
  members: 300,
} as const;

export const CacheKey = {
  brands: (userId: number) => `cache:brands:u:${userId}`,
  posts: (brandId: number, userId: number) =>
    `cache:posts:b:${brandId}:u:${userId}`,
  schedules: (brandId: number) => `cache:schedules:b:${brandId}`,
  schedulesUser: (userId: number) => `cache:schedules:u:${userId}`,
  socialAccounts: (userId: number) => `cache:social:u:${userId}`,
  members: (brandId: number, userId: number) =>
    `cache:members:b:${brandId}:u:${userId}`,
};

export default class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key);
      if (!cached) return null;
      return JSON.parse(cached) as T;
    } catch {
      return null;
    }
  }

  static async set(
    key: string,
    data: unknown,
    ttl: number = 300,
  ): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(data));
    } catch {
      // Redis unavailable — proceed without caching
    }
  }

  static async invalidate(...patterns: string[]): Promise<void> {
    try {
      for (const pattern of patterns) {
        if (pattern.includes('*')) {
          const keys = await redis.keys(pattern);
          if (keys.length > 0) {
            await redis.del(...(keys as [string, ...string[]]));
          }
        } else {
          await redis.del(pattern);
        }
      }
    } catch {
      // Redis unavailable — proceed without invalidation
    }
  }
}
