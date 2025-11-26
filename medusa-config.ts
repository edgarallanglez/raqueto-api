import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import dns from "dns";

loadEnv(process.env.NODE_ENV || 'development', process.cwd())
const commonRedisOptions = {
  // 1. Force IPv4: Critical for Cloud Run to avoid IPv6 timeouts
  dnsLookup: (hostname, cb) => dns.lookup(hostname, { family: 4 }, cb),

  // 2. REMOVE the explicit 'tls' object. 
  // Since you use 'rediss://' in the URL, ioredis automatically handles TLS and SNI.
  // Adding it manually often causes conflicts or double-wrapping.
  
  // 3. Connection Settings
  connectTimeout: 10000, // Reduced to 10s. If it takes longer, fail fast and retry.
  
  // 4. KeepAlive is tricky in Cloud Run. 
  // We set it, but we rely more on retry strategies.
  keepAlive: 10000, 
  
  // 5. CRITICAL FIX: Disable maxRetriesPerRequest
  // Medusa requires this to be null so ioredis queues commands during a reconnection
  // instead of failing them immediately when the socket resets.
  maxRetriesPerRequest: null,

  // 6. Reconnection Strategy
  enableReadyCheck: true,
  enableOfflineQueue: true,
  lazyConnect: true, // Changed to true to prevent startup hangs
  
  retryStrategy(times: number) {
    // Retry immediately first, then back off
    const delay = Math.min(times * 50, 2000);
    return delay;
  },

  // 7. Aggressive Reconnect on Error
  reconnectOnError(err: Error) {
    const targetErrors = ['READONLY', 'ETIMEDOUT', 'ECONNRESET', 'ENOTFOUND', 'ECONNREFUSED']
    if (targetErrors.some(targetError => err.message.includes(targetError))) {
      return true
    }
    return false
  },
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
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
