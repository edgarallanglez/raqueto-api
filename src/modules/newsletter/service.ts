import { MedusaService } from "@medusajs/framework/utils"
import NewsletterSubscription from "./models/subscription"

/**
 * Newsletter Module Service
 * 
 * Automatically provides CRUD operations:
 * - createNewsletterSubscriptions
 * - updateNewsletterSubscriptions
 * - retrieveNewsletterSubscription
 * - listNewsletterSubscriptions
 * - listAndCountNewsletterSubscriptions
 * - deleteNewsletterSubscriptions
 */
class NewsletterModuleService extends MedusaService({
  NewsletterSubscription,
}) {
  /**
   * Subscribe an email to the newsletter
   */
  async subscribe(email: string, options?: {
    source?: string
    preferences?: Record<string, any>
    metadata?: Record<string, any>
  }) {
    // Check if email already exists
    const [existing] = await this.listNewsletterSubscriptions({
      email,
    })

    if (existing) {
      // If unsubscribed, reactivate
      if (existing.status === "unsubscribed") {
        return await this.updateNewsletterSubscriptions(existing.id, {
          status: "active",
          ...options,
        })
      }
      // Already subscribed
      return existing
    }

    // Create new subscription
    return await this.createNewsletterSubscriptions({
      email,
      status: "active",
      ...options,
    })
  }

  /**
   * Unsubscribe an email
   */
  async unsubscribe(email: string) {
    const [subscription] = await this.listNewsletterSubscriptions({
      email,
    })

    if (!subscription) {
      throw new Error("Email not found in newsletter list")
    }

    return await this.updateNewsletterSubscriptions(subscription.id, {
      status: "unsubscribed",
    })
  }

  /**
   * Get subscription by email
   */
  async retrieveByEmail(email: string) {
    const [subscription] = await this.listNewsletterSubscriptions({
      email,
    })

    return subscription
  }

  /**
   * Link subscription to customer when they register
   */
  async linkToCustomer(email: string, customerId: string) {
    const subscription = await this.retrieveByEmail(email)

    if (!subscription) {
      return null
    }

    return await this.updateNewsletterSubscriptions(subscription.id, {
      customer_id: customerId,
    })
  }
}

export default NewsletterModuleService

