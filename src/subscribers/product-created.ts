import type {
    SubscriberArgs,
    SubscriberConfig,
} from "@medusajs/framework"

/**
 * Subscriber that triggers storefront cache revalidation when a product is created.
 * This ensures the Next.js storefront displays new products immediately.
 * 
 * @see https://docs.medusajs.com/resources/nextjs-starter/guides/revalidate-cache
 */
export default async function productCreatedHandler({
    event: { data },
    container,
}: SubscriberArgs<{ id: string }>) {
    const storefrontUrl = process.env.STOREFRONT_URL

    if (!storefrontUrl) {
        console.warn("[ProductCreated] STOREFRONT_URL environment variable is not set. Skipping cache revalidation.")
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
            console.log(`[ProductCreated] Successfully triggered cache revalidation for product ${data.id}`)
        } else {
            const errorText = await response.text()
            console.error(`[ProductCreated] Failed to revalidate cache: ${response.status} - ${errorText}`)
        }
    } catch (error) {
        console.error("[ProductCreated] Error triggering cache revalidation:", error)
    }
}

export const config: SubscriberConfig = {
    event: "product.created",
}
