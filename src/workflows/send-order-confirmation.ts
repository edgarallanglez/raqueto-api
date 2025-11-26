import { createWorkflow, WorkflowResponse, transform } from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { sendNotificationStep } from "./steps/send-notification";

type WorkflowInput = {
    id: string
}

export const sendOrderConfirmationWorkflow = createWorkflow(
    "send-order-confirmation",
    ({ id }: WorkflowInput) => {
        const { data: orders } = useQueryGraphStep({
            entity: "order",
            fields: [
                "id",
                "display_id",
                "email",
                "currency_code",
                "total",
                "items.*",
                "shipping_address.*",
                "billing_address.*",
                "shipping_methods.*",
                "customer.*",
                "total",
                "subtotal",
                "discount_total",
                "shipping_total",
                "tax_total",
                "item_subtotal",
                "item_total",
                "item_tax_total",
            ],
            filters: {
                id
            }
        })

        // Build notification data
        const notificationData = transform({ orders }, (data) => {
            return [
                // Customer notification
                {
                    to: data.orders[0]?.email ?? "",
                    channel: "email",
                    template: "order-placed",
                    data: {
                        order: data.orders[0]
                    }
                },
                // Admin notification
                {
                    to: process.env.ADMIN_EMAIL ?? "hola@raqueto.shop",
                    channel: "email",
                    template: "order-placed-admin",
                    data: {
                        order: data.orders[0]
                    }
                }
            ]
        })

        // Send notifications
        const notifications = sendNotificationStep(notificationData)

        return new WorkflowResponse(notifications)
    }
)