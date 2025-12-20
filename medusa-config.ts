import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import dns from "dns";

loadEnv(process.env.NODE_ENV || 'development', process.cwd())
const commonRedisOptions = {
  // 1. Force IPv4: Critical for Cloud Run to avoid IPv6 timeouts
  dnsLookup: (hostname, cb) => dns.lookup(hostname, { family: 4 }, cb),

  // 2. Connection Settings - More lenient timeouts
  connectTimeout: 10000, // 10s for initial connection
  
  // 3. KeepAlive - Prevent idle connection drops
  keepAlive: 30000, // Send keepalive every 30s
  
  // 4. CRITICAL: Disable maxRetriesPerRequest for Medusa compatibility
  // Allows ioredis to queue commands during reconnection instead of failing
  maxRetriesPerRequest: null,

  // 5. Connection Pool & Retry Settings
  enableReadyCheck: true,
  enableOfflineQueue: true,
  lazyConnect: true, // Lazy connect to avoid blocking startup
  autoResubscribe: true,
  autoResendUnfulfilledCommands: true,
  
  // 6. Retry Strategy - Exponential backoff with reasonable limits
  retryStrategy(times: number) {
    if (times > 10) {
      return null; // Stop after 10 attempts
    }
    // 100ms, 200ms, 400ms, 800ms, max 2s
    const delay = Math.min(times * 100, 2000);
    return delay;
  },

  // 7. Reconnect on specific errors
  reconnectOnError(err: Error) {
    const targetErrors = ['READONLY', 'ETIMEDOUT', 'ECONNRESET', 'ENOTFOUND', 'ECONNREFUSED']
    if (targetErrors.some(targetError => err.message.includes(targetError))) {
      return 1; // Just reconnect, don't retry command
    }
    return false
  },
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    // Redis options for session storage (follows official MedusaJS pattern)
    redisOptions: commonRedisOptions,
    workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server",
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL
  },
  modules: [
    // Brand Module (Custom)
    {
      resolve: "./src/modules/brand",
      options: {},
      definition: {
        isQueryable: true,
      },
    },
    // Newsletter Module (Custom)
    {
      resolve: "./src/modules/newsletter",
      options: {},
      definition: {
        isQueryable: true,
      },
    },
    {
      resolve: "@medusajs/medusa/caching",
      options: {
        providers: [
          {
            id: "caching-redis",
            resolve: "@medusajs/caching-redis",
            options: {
              redisUrl: process.env.REDIS_URL,
              redisOptions: commonRedisOptions,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: { 
        redisUrl: process.env.REDIS_URL,
        redisOptions: commonRedisOptions,
      },
    },
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: {
        redis: {
          url: process.env.REDIS_URL,
          options: commonRedisOptions,
        },
      },
    },
    {
      resolve: "@medusajs/medusa/locking",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/locking-redis",
            id: "locking-redis",
            is_default: true,
            options: {
              redisUrl: process.env.REDIS_URL,
              redisOptions: commonRedisOptions,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/analytics",
      options: {
        providers: [
          {
            resolve: "@medusajs/analytics-posthog",
            id: "posthog",
            options: {
              posthogEventsKey: process.env.POSTHOG_EVENTS_API_KEY,
              posthogHost: process.env.POSTHOG_HOST,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_SECRET_API_KEY,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "./src/modules/resend",
            id: "resend",
            options: {
              channels: ["email"],
              api_key: process.env.RESEND_API_KEY,
              from: process.env.RESEND_FROM_EMAIL,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
            },
          },
        ],
      },
    },
  ],
  featureFlags: {
    caching: true,
  },
})
