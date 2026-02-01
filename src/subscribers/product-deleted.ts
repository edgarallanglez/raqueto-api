import type {
    SubscriberArgs,
    SubscriberConfig,
} from "@medusajs/framework"

/**
 * Subscriber that triggers storefront cache revalidation when a product is deleted.
 * This ensures the Next.js storefront removes deleted products immediately.
 * 
 * @see https://docs.medusajs.com/resources/nextjs-starter/guides/revalidate-cache
 */
export default async function productDeletedHandler({
    event: { data },
    container,
}: SubscriberArgs<{ id: string }>) {
    const storefrontUrl = process.env.STOREFRONT_URL

    if (!storefrontUrl) {
        console.warn("[ProductDeleted] STOREFRONT_URL environment variable is not set. Skipping cache revalidation.")
        return
    }

    try {
        const revalidationSecret = process.env.REVALIDATION_SECRET
        const url = new URL("/api/revalidate", storefrontUrl)
        url.searchParams.set("tags", "products")

        if (revalidationSecret) {
            url.searchParams.set("secret", revalidationSecret)
        }

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (response.ok) {
            console.log(`[ProductDeleted] Successfully triggered cache revalidation for product ${data.id}`)
        } else {
            const errorText = await response.text()
            console.error(`[ProductDeleted] Failed to revalidate cache: ${response.status} - ${errorText}`)
        }
    } catch (error) {
        console.error("[ProductDeleted] Error triggering cache revalidation:", error)
    }
}

export const config: SubscriberConfig = {
    event: "product.deleted",
}
