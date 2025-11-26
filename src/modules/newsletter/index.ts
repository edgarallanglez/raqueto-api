import NewsletterModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const NEWSLETTER_MODULE = "newsletterModuleService"

export default Module(NEWSLETTER_MODULE, {
  service: NewsletterModuleService,
})

