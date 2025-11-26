import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Fix Stripe customer IDs mismatch
 * This script clears invalid Stripe customer IDs from the database
 */
export default async function fixStripeCustomers({ container }: { container: MedusaContainer }) {
  const query = container.resolve(Modules.CUSTOMER)

  console.log("Fetching customers with Stripe metadata...")

  // Get all customers
  const customers = await query.listCustomers({})

  console.log(`Found ${customers.length} customers`)

  // Clear Stripe customer IDs from metadata
  for (const customer of customers) {
    if (customer.metadata && customer.metadata.stripe_id) {
      console.log(`Clearing Stripe ID for customer ${customer.id}: ${customer.metadata.stripe_id}`)
      
      await query.updateCustomers(customer.id, {
        metadata: {
          ...customer.metadata,
          stripe_id: null
        }
      })
    }
  }

  console.log("✅ Done! All Stripe customer IDs cleared.")
  console.log("New PaymentIntents will create fresh Stripe customers.")
}


