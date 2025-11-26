import { model } from "@medusajs/framework/utils"

/**
 * Newsletter Subscription Data Model
 * 
 * Stores email subscriptions for marketing/newsletter purposes
 * Does not require customer account creation
 */
const NewsletterSubscription = model
  .define("newsletter_subscription", {
    id: model.id().primaryKey(),
    
    // Email address (required)
    email: model.text(),
    
    // Optional: link to customer if they eventually register
    customer_id: model.text().nullable(),
    
    // Status: active, unsubscribed, bounced
    status: model.enum(["active", "unsubscribed", "bounced"]).default("active"),
    
    // Subscription source (homepage, checkout, popup, etc.)
    source: model.text().nullable(),
    
    // Preferences: what they want to receive
    preferences: model.json().nullable(),
    
    // Metadata for additional info
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      // Prevent duplicate email subscriptions
      on: ["email"],
      unique: true,
    },
  ])

export default NewsletterSubscription

