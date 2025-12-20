import { MedusaContainer } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

/**
 * Create WELCOME5 Promotion with First-Purchase Restriction
 * 
 * This script creates a promotion that can only be used ONCE per customer
 * using MedusaJS Campaign Budget feature
 * 
 * Run: npx medusa exec ./src/scripts/create-welcome5-promo.ts
 */
export default async ({ container }: { container: MedusaContainer }) => {
  const promotionService = container.resolve(Modules.PROMOTION)

  console.log("🎁 Creating WELCOME5 promotion with first-purchase restriction...")
  console.log("")

  try {
    // Check if promotion already exists
    const existingPromotions = await promotionService.listPromotions({
      code: "WELCOME5",
    })

    if (existingPromotions && existingPromotions.length > 0) {
      console.log("⚠️  WELCOME5 promotion already exists!")
      console.log("   ID:", existingPromotions[0].id)
      console.log("   Status:", existingPromotions[0].status)
      console.log("")
      console.log("💡 To update it, delete it first in the admin panel.")
      return
    }

    // Create the promotion with campaign budget
    const promotion = await promotionService.createPromotions({
      code: "WELCOME5",
      type: "standard",
      status: "active",
      application_method: {
        type: "percentage",
        value: 5, // 5% discount
        target_type: "order",
        allocation: "across",
        currency_code: "mxn", // Your default currency
      },
      campaign: {
        name: "Welcome Campaign",
        description: "First-time newsletter subscriber offer - 5% off first purchase",
        campaign_identifier: "welcome-campaign",
        budget: {
          type: "usage",
          limit: 1, // ⭐ KEY: Only 1 use per customer!
        },
      },
    })

    console.log("✅ WELCOME5 promotion created successfully!")
    console.log("")
    console.log("📊 Promotion Details:")
    console.log("   Code:", promotion.code)
    console.log("   Discount:", "5% off")
    console.log("   Usage limit:", "1 per customer")
    console.log("   Campaign:", "Welcome Campaign")
    console.log("")
    console.log("🎯 How it works:")
    console.log("   - Each customer can use WELCOME5 only ONCE")
    console.log("   - Different customers can each use it once")
    console.log("   - MedusaJS automatically tracks usage per customer")
    console.log("")
    console.log("🧪 Test it:")
    console.log("   1. Subscribe to newsletter (get email with code)")
    console.log("   2. Add items to cart")
    console.log("   3. Apply WELCOME5 code ✅")
    console.log("   4. Complete checkout")
    console.log("   5. Try to use WELCOME5 again ❌ (should fail)")
    console.log("")
    
  } catch (error) {
    console.error("❌ Error creating promotion:", error.message)
    console.error("")
    console.error("Stack:", error.stack)
  }
}

