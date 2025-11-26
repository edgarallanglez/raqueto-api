import { 
  Text, 
  Column, 
  Container, 
  Heading, 
  Html, 
  Img, 
  Row, 
  Section, 
  Tailwind, 
  Head, 
  Preview, 
  Body, 
  Link 
} from "@react-email/components"
import { BigNumberValue, CustomerDTO, OrderDTO } from "@medusajs/framework/types"

type OrderPlacedEmailProps = {
  order: OrderDTO & {
    customer: CustomerDTO
  }
  email_banner?: {
    body: string
    title: string
    url: string
  }
}

function OrderPlacedEmailComponent({ order, email_banner }: OrderPlacedEmailProps) {
  const shouldDisplayBanner = email_banner && "title" in email_banner

  const formatter = new Intl.NumberFormat([], {
    style: "currency",
    currencyDisplay: "narrowSymbol",
    currency: order.currency_code,
  })

  const formatPrice = (price: BigNumberValue) => {
    if (typeof price === "number") {
      return formatter.format(price)
    }

    if (typeof price === "string") {
      return formatter.format(parseFloat(price))
    }

    return price?.toString() || ""
  }

  return (
    <Tailwind>
      <Html className="font-sans bg-neutral-50">
        <Head />
        <Preview>Thank you for your order from Medusa</Preview>
        <Body className="bg-white my-10 mx-auto w-full max-w-2xl">
          {/* Header */}
          <Section className="text-white px-8 py-6" style={{ backgroundColor: '#021326' }}>
            <Container className="max-w-2xl mx-auto">
              <Row>
                <Column align="center">
                  <Img 
                    src="https://raqueto.shop/Logo.png" 
                    alt="Raqueto" 
                    width="180" 
                    height="42"
                    style={{ display: 'block', margin: '0 auto' }}
                  />
                </Column>
              </Row>
            </Container>
          </Section>

          {/* Accent Bar */}
          <Section className="bg-[#E0FA5B] h-2" />

          {/* Thank You Message */}
          <Container className="max-w-2xl mx-auto bg-white my-8 rounded-lg shadow-sm p-8">
            <Heading className="text-3xl font-bold text-center text-neutral-900 mb-2">
              ¡Gracias por tu compra, {order.customer?.first_name || order.shipping_address?.first_name}! 🎉
            </Heading>
            <Text className="text-center text-neutral-600 text-base leading-relaxed">
              Tu pedido está siendo procesado. Te notificaremos cuando sea enviado.
            </Text>
            <Section className="mt-6 pt-6 border-t border-neutral-200">
              <Text className="text-sm text-neutral-500 text-center mb-1">
                Número de Orden
              </Text>
              <Text className="text-2xl font-bold text-center text-neutral-900">
                #{order.display_id}
              </Text>
            </Section>
          </Container>

          {/* Promotional Banner */}
          {shouldDisplayBanner && (
            <Container className="max-w-2xl mx-auto mb-8">
              <Section
                className="rounded-lg p-8 shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                  border: '2px solid #E0FA5B'
                }}
              >
                <Row>
                  <Column align="left">
                    <Heading className="text-white text-2xl font-bold mb-3">
                      {email_banner.title}
                    </Heading>
                    <Text className="text-neutral-300 text-base leading-relaxed">{email_banner.body}</Text>
                  </Column>
                  <Column align="right">
                    <Link 
                      href={email_banner.url} 
                      className="inline-block bg-[#E0FA5B] text-black font-bold px-6 py-3 rounded-md hover:bg-[#d4ee4f] transition-colors"
                      style={{
                        textDecoration: 'none',
                        backgroundColor: '#E0FA5B',
                        color: '#000000'
                      }}
                    >
                      Comprar Ahora
                    </Link>
                  </Column>
                </Row>
              </Section>
            </Container>
          )}

          {/* Order Items */}
          <Container className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 mb-6">
            <Heading className="text-2xl font-bold text-neutral-900 mb-6 pb-4 border-b-2 border-[#E0FA5B]">
              Tus Productos
            </Heading>
            {order.items?.map((item, index) => (
              <Section key={item.id} className={`py-6 ${index < (order.items?.length ?? 0) - 1 ? 'border-b border-neutral-200' : ''}`}>
                <Row>
                  <Column style={{ width: '30%', verticalAlign: 'top' }}>
                    <Img
                      src={item.thumbnail ?? ''}
                      alt={item.product_title ?? ''}
                      className="rounded-lg"
                      width="100%"
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #e5e5e5'
                      }}
                    />
                  </Column>
                  <Column style={{ width: '70%', paddingLeft: '20px', verticalAlign: 'top' }}>
                    <Text className="text-lg font-bold text-neutral-900 mb-1" style={{ margin: '0 0 4px 0' }}>
                      {item.product_title}
                    </Text>
                    <Text className="text-sm text-neutral-600 mb-2" style={{ margin: '0 0 8px 0' }}>
                      {item.variant_title}
                    </Text>
                    <Text className="text-sm text-neutral-500 mb-3" style={{ margin: '0 0 12px 0' }}>
                      Cantidad: {item.quantity}
                    </Text>
                    <Text className="text-xl font-bold text-neutral-900" style={{ margin: '0' }}>
                      {formatPrice(item.total)}
                    </Text>
                  </Column>
                </Row>
              </Section>
            ))}

            {/* Order Summary */}
            <Section className="mt-10 pt-8 border-t-2 border-neutral-200">
              <Heading className="text-2xl font-bold text-neutral-900 mb-6">
                Resumen del Pedido
              </Heading>
              <Row className="mb-3">
                <Column style={{ width: '50%' }}>
                  <Text className="text-base text-neutral-600" style={{ margin: '0' }}>Subtotal</Text>
                </Column>
                <Column style={{ width: '50%', textAlign: 'right' }}>
                  <Text className="text-base text-neutral-900 font-semibold" style={{ margin: '0' }}>
                    {formatPrice(order.item_total)}
                  </Text>
                </Column>
              </Row>
              {order.shipping_methods?.map((method) => (
                <Row className="mb-3" key={method.id}>
                  <Column style={{ width: '50%' }}>
                    <Text className="text-base text-neutral-600" style={{ margin: '0' }}>{method.name}</Text>
                  </Column>
                  <Column style={{ width: '50%', textAlign: 'right' }}>
                    <Text className="text-base text-neutral-900 font-semibold" style={{ margin: '0' }}>{formatPrice(method.total)}</Text>
                  </Column>
                </Row>
              ))}
              {/* <Row className="mb-3">
                <Column style={{ width: '50%' }}>
                  <Text className="text-base text-neutral-600" style={{ margin: '0' }}>Impuestos</Text>
                </Column>
                <Column style={{ width: '50%', textAlign: 'right' }}>
                  <Text className="text-base text-neutral-900 font-semibold" style={{ margin: '0' }}>{formatPrice(order.tax_total || 0)}</Text>
                </Column>
              </Row> */}
              <Section 
                className="mt-6 pt-6 rounded-lg p-4"
                style={{
                  backgroundColor: '#E0FA5B',
                  borderRadius: '8px',
                  // padding: '16px'
                }}
              >
                <Row>
                  <Column style={{ width: '50%' }}>
                    <Text className="text-xl font-bold text-black" style={{ margin: '0' }}>Total</Text>
                  </Column>
                  <Column style={{ width: '50%', textAlign: 'right' }}>
                    <Text className="text-2xl font-bold text-black" style={{ margin: '0' }}>{formatPrice(order.total)}</Text>
                  </Column>
                </Row>
              </Section>
            </Section>
          </Container>

          {/* Footer */}
          <Section className="bg-gray-50 p-6 mt-10">
            <Row className="mb-6">
                <Column align="center">
                  <Img 
                    src="https://raqueto.shop/Logo.png" 
                    alt="Raqueto" 
                    width="140" 
                    height="33"
                    style={{ display: 'block', margin: '0 auto' }}
                  />
                </Column>
              </Row>
            <Text className="text-center text-gray-500 text-sm">
              Si tienes alguna pregunta, contacta a nuestro equipo de soporte en hola@raqueto.shop
            </Text>
            <Text className="text-center text-gray-500 text-sm">
              Order Token: {order.id}
            </Text>
            <Text className="text-center text-gray-400 text-xs mt-4">
              © {new Date().getFullYear()} Raqueto. Todos los derechos reservados.
            </Text>
          </Section>
        </Body>
      </Html>
    </Tailwind >
  )
}

export const orderPlacedEmail = (props: OrderPlacedEmailProps) => (
  <OrderPlacedEmailComponent {...props} />
)


const mockOrder = {
  "order": {
    "id": "order_01JSNXDH9BPJWWKVW03B9E9KW8",
    "display_id": 1,
    "email": "shahednasser@gmail.com",
    "currency_code": "eur",
    "total": 20,
    "subtotal": 20,
    "discount_total": 0,
    "shipping_total": 10,
    "tax_total": 0,
    "item_subtotal": 10,
    "item_total": 10,
    "item_tax_total": 0,
    "customer_id": "cus_01JSNXD6VQC1YH56E4TGC81NWX",
    "items": [
      {
        "id": "ordli_01JSNXDH9C47KZ43WQ3TBFXZA9",
        "title": "L",
        "subtitle": "Medusa Sweatshirt",
        "thumbnail": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
        "variant_id": "variant_01JSNXAQCZ5X81A3NRSVFJ3ZHQ",
        "product_id": "prod_01JSNXAQBQ6MFV5VHKN420NXQW",
        "product_title": "Medusa Sweatshirt",
        "product_description": "Reimagine the feeling of a classic sweatshirt. With our cotton sweatshirt, everyday essentials no longer have to be ordinary.",
        "product_subtitle": null,
        "product_type": null,
        "product_type_id": null,
        "product_collection": null,
        "product_handle": "sweatshirt",
        "variant_sku": "SWEATSHIRT-L",
        "variant_barcode": null,
        "variant_title": "L",
        "variant_option_values": null,
        "requires_shipping": true,
        "is_giftcard": false,
        "is_discountable": true,
        "is_tax_inclusive": false,
        "is_custom_price": false,
        "metadata": {},
        "raw_compare_at_unit_price": null,
        "raw_unit_price": {
          "value": "10",
          "precision": 20
        },
        "created_at": new Date(),
        "updated_at": new Date(),
        "deleted_at": null,
        "tax_lines": [],
        "adjustments": [],
        "compare_at_unit_price": null,
        "unit_price": 10,
        "quantity": 1,
        "raw_quantity": {
          "value": "1",
          "precision": 20
        },
        "detail": {
          "id": "orditem_01JSNXDH9DK1XMESEZPADYFWKY",
          "version": 1,
          "metadata": null,
          "order_id": "order_01JSNXDH9BPJWWKVW03B9E9KW8",
          "raw_unit_price": null,
          "raw_compare_at_unit_price": null,
          "raw_quantity": {
            "value": "1",
            "precision": 20
          },
          "raw_fulfilled_quantity": {
            "value": "0",
            "precision": 20
          },
          "raw_delivered_quantity": {
            "value": "0",
            "precision": 20
          },
          "raw_shipped_quantity": {
            "value": "0",
            "precision": 20
          },
          "raw_return_requested_quantity": {
            "value": "0",
            "precision": 20
          },
          "raw_return_received_quantity": {
            "value": "0",
            "precision": 20
          },
          "raw_return_dismissed_quantity": {
            "value": "0",
            "precision": 20
          },
          "raw_written_off_quantity": {
            "value": "0",
            "precision": 20
          },
          "created_at": new Date(),
          "updated_at": new Date(),
          "deleted_at": null,
          "item_id": "ordli_01JSNXDH9C47KZ43WQ3TBFXZA9",
          "unit_price": null,
          "compare_at_unit_price": null,
          "quantity": 1,
          "fulfilled_quantity": 0,
          "delivered_quantity": 0,
          "shipped_quantity": 0,
          "return_requested_quantity": 0,
          "return_received_quantity": 0,
          "return_dismissed_quantity": 0,
          "written_off_quantity": 0
        },
        "subtotal": 10,
        "total": 10,
        "original_total": 10,
        "discount_total": 0,
        "discount_subtotal": 0,
        "discount_tax_total": 0,
        "tax_total": 0,
        "original_tax_total": 0,
        "refundable_total_per_unit": 10,
        "refundable_total": 10,
        "fulfilled_total": 0,
        "shipped_total": 0,
        "return_requested_total": 0,
        "return_received_total": 0,
        "return_dismissed_total": 0,
        "write_off_total": 0,
        "raw_subtotal": {
          "value": "10",
          "precision": 20
        },
        "raw_total": {
          "value": "10",
          "precision": 20
        },
        "raw_original_total": {
          "value": "10",
          "precision": 20
        },
        "raw_discount_total": {
          "value": "0",
          "precision": 20
        },
        "raw_discount_subtotal": {
          "value": "0",
          "precision": 20
        },
        "raw_discount_tax_total": {
          "value": "0",
          "precision": 20
        },
        "raw_tax_total": {
          "value": "0",
          "precision": 20
        },
        "raw_original_tax_total": {
          "value": "0",
          "precision": 20
        },
        "raw_refundable_total_per_unit": {
          "value": "10",
          "precision": 20
        },
        "raw_refundable_total": {
          "value": "10",
          "precision": 20
        },
        "raw_fulfilled_total": {
          "value": "0",
          "precision": 20
        },
        "raw_shipped_total": {
          "value": "0",
          "precision": 20
        },
        "raw_return_requested_total": {
          "value": "0",
          "precision": 20
        },
        "raw_return_received_total": {
          "value": "0",
          "precision": 20
        },
        "raw_return_dismissed_total": {
          "value": "0",
          "precision": 20
        },
        "raw_write_off_total": {
          "value": "0",
          "precision": 20
        }
      }
    ],
    "shipping_address": {
      "id": "caaddr_01JSNXD6W0TGPH2JQD18K97B25",
      "customer_id": null,
      "company": "",
      "first_name": "shahed",
      "last_name": "nasser",
      "address_1": "asfasf",
      "address_2": "",
      "city": "asfasf",
      "country_code": "dk",
      "province": "",
      "postal_code": "asfasf",
      "phone": "",
      "metadata": null,
      "created_at": "2025-04-25T07:25:48.801Z",
      "updated_at": "2025-04-25T07:25:48.801Z",
      "deleted_at": null
    },
    "billing_address": {
      "id": "caaddr_01JSNXD6W0V7RNZH63CPG26K5W",
      "customer_id": null,
      "company": "",
      "first_name": "shahed",
      "last_name": "nasser",
      "address_1": "asfasf",
      "address_2": "",
      "city": "asfasf",
      "country_code": "dk",
      "province": "",
      "postal_code": "asfasf",
      "phone": "",
      "metadata": null,
      "created_at": "2025-04-25T07:25:48.801Z",
      "updated_at": "2025-04-25T07:25:48.801Z",
      "deleted_at": null
    },
    "shipping_methods": [
      {
        "id": "ordsm_01JSNXDH9B9DDRQXJT5J5AE5V1",
        "name": "Standard Shipping",
        "description": null,
        "is_tax_inclusive": false,
        "is_custom_amount": false,
        "shipping_option_id": "so_01JSNXAQA64APG6BNHGCMCTN6V",
        "data": {},
        "metadata": null,
        "raw_amount": {
          "value": "10",
          "precision": 20
        },
        "created_at": new Date(),
        "updated_at": new Date(),
        "deleted_at": null,
        "tax_lines": [],
        "adjustments": [],
        "amount": 10,
        "order_id": "order_01JSNXDH9BPJWWKVW03B9E9KW8",
        "detail": {
          "id": "ordspmv_01JSNXDH9B5RAF4FH3M1HH3TEA",
          "version": 1,
          "order_id": "order_01JSNXDH9BPJWWKVW03B9E9KW8",
          "return_id": null,
          "exchange_id": null,
          "claim_id": null,
          "created_at": new Date(),
          "updated_at": new Date(),
          "deleted_at": null,
          "shipping_method_id": "ordsm_01JSNXDH9B9DDRQXJT5J5AE5V1"
        },
        "subtotal": 10,
        "total": 10,
        "original_total": 10,
        "discount_total": 0,
        "discount_subtotal": 0,
        "discount_tax_total": 0,
        "tax_total": 0,
        "original_tax_total": 0,
        "raw_subtotal": {
          "value": "10",
          "precision": 20
        },
        "raw_total": {
          "value": "10",
          "precision": 20
        },
        "raw_original_total": {
          "value": "10",
          "precision": 20
        },
        "raw_discount_total": {
          "value": "0",
          "precision": 20
        },
        "raw_discount_subtotal": {
          "value": "0",
          "precision": 20
        },
        "raw_discount_tax_total": {
          "value": "0",
          "precision": 20
        },
        "raw_tax_total": {
          "value": "0",
          "precision": 20
        },
        "raw_original_tax_total": {
          "value": "0",
          "precision": 20
        }
      }
    ],
    "customer": {
      "id": "cus_01JSNXD6VQC1YH56E4TGC81NWX",
      "company_name": null,
      "first_name": null,
      "last_name": null,
      "email": "afsaf@gmail.com",
      "phone": null,
      "has_account": false,
      "metadata": null,
      "created_by": null,
      "created_at": "2025-04-25T07:25:48.791Z",
      "updated_at": "2025-04-25T07:25:48.791Z",
      "deleted_at": null
    }
  }
}
// @ts-ignore
export default () => <OrderPlacedEmailComponent {...mockOrder} />