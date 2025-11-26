import { 
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import { PostAdminCreateBrand, PostAdminUpdateBrand } from "./admin/brands/validators"

export const GetBrandsSchema = createFindParams()

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/brands",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(
          GetBrandsSchema,
          {
            defaults: [
              "id",
              "name",
              "slug",
              "description",
              "logo_url",
              "website_url",
              "order",
              "is_active",
              "sports",
              "country",
              "metadata",
              "products.*",
            ],
            isList: true,
          }
        ),
      ],
    },
    {
      matcher: "/admin/brands",
      method: "POST",
      middlewares: [
        validateAndTransformBody(PostAdminCreateBrand),
      ],
    },
    {
      matcher: "/admin/brands/:id",
      method: "POST",
      middlewares: [
        validateAndTransformBody(PostAdminUpdateBrand),
      ],
    },
  ],
})

