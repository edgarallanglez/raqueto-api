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
  Link,
  Button 
} from "@react-email/components"
import { BigNumberValue, CustomerDTO, OrderDTO } from "@medusajs/framework/types"

type OrderPlacedAdminEmailProps = {
  order: OrderDTO & {
    customer: CustomerDTO
  }
}

function OrderPlacedAdminEmailComponent({ order }: OrderPlacedAdminEmailProps) {
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

  const adminUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
  const orderUrl = `${adminUrl}/app/orders/${order.id}`

  return (
    <Tailwind>
      <Html className="font-sans bg-neutral-50">
        <Head>
          <meta name="color-scheme" content="light" />
          <meta name="supported-color-schemes" content="light" />
          <style>{`
            @media (prefers-color-scheme: dark) {
              .accent-bar {
                background-color: #E0FA5B !important;
              }
              .order-number {
                color: #E0FA5B !important;
              }
              .admin-button {
                background-color: #000000 !important;
                color: #ffffff !important;
              }
              .footer-logo {
                filter: none !important;
                opacity: 1 !important;
              }
            }
          `}</style>
        </Head>
        <Preview>{`🔔 Nueva orden #${order.display_id} - ${formatPrice(order.total)}`}</Preview>
        <Body className="bg-neutral-100 my-10 mx-auto w-full max-w-2xl">
          {/* Header */}
          <Section className="bg-black text-white px-8 py-6">
            <Container className="max-w-2xl mx-auto">
              <Row>
                <Column>
                  <Heading className="text-2xl font-bold m-0">🔔 Nueva Orden Recibida</Heading>
                </Column>
                <Column align="right">
                  <Text className="text-[#E0FA5B] text-xl font-bold m-0 order-number" style={{ color: '#E0FA5B' }}>
                    #{order.display_id}
                  </Text>
                </Column>
              </Row>
            </Container>
          </Section>

          {/* Accent Bar */}
          <Section className="bg-[#E0FA5B] h-2 accent-bar" style={{ backgroundColor: '#E0FA5B', height: '8px' }} />

          {/* Alert Box */}
          <Container className="max-w-2xl mx-auto bg-white my-6 rounded-lg shadow-lg p-6">
            <Row className="mb-4">
              <Column style={{ width: '50%' }}>
                <Text className="text-sm text-neutral-600 m-0 mb-1">Total del Pedido</Text>
                <Text className="text-3xl font-bold text-black m-0">
                  {formatPrice(order.total)}
                </Text>
              </Column>
              <Column style={{ width: '50%', textAlign: 'right' }}>
                <Text className="text-sm text-neutral-600 m-0 mb-1">Cliente</Text>
                <Text className="text-lg font-semibold text-black m-0">
                  {order.customer?.first_name || order.shipping_address?.first_name} {order.customer?.last_name || order.shipping_address?.last_name}
                </Text>
                <Text className="text-sm text-neutral-600 m-0">
                  {order.email}
                </Text>
              </Column>
            </Row>

            <Section className="mt-6 pt-4 border-t border-neutral-200">
              <Button
                href={orderUrl}
                className="w-full bg-black text-white font-bold py-4 px-6 rounded-lg text-center admin-button"
                style={{
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  textDecoration: 'none',
                  display: 'block',
                  textAlign: 'center',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderRadius: '8px'
                }}
              >
                Ver Orden en Admin →
              </Button>
            </Section>
          </Container>

          {/* Order Summary */}
          <Container className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6 mb-6">
            <Heading className="text-xl font-bold text-neutral-900 mb-4 m-0">
              Resumen del Pedido
            </Heading>
            
            {/* Items List */}
            <Section className="mb-4">
              <Text className="text-sm font-semibold text-neutral-700 mb-2">
                Productos ({order.items?.length || 0}):
              </Text>
              {order.items?.slice(0, 3).map((item) => (
                <Row key={item.id} className="mb-2">
                  <Column style={{ width: '70%' }}>
                    <Text className="text-sm text-neutral-900 m-0">
                      {item.quantity}x {item.product_title}
                    </Text>
                    <Text className="text-xs text-neutral-500 m-0">
                      {item.variant_title}
                    </Text>
                  </Column>
                  <Column style={{ width: '30%', textAlign: 'right' }}>
                    <Text className="text-sm font-semibold text-neutral-900 m-0">
                      {formatPrice(item.total)}
                    </Text>
                  </Column>
                </Row>
              ))}
              {(order.items?.length || 0) > 3 && (
                <Text className="text-sm text-neutral-500 mt-2 m-0">
                  +{(order.items?.length || 0) - 3} más...
                </Text>
              )}
            </Section>

            {/* Shipping Address */}
            <Section className="pt-4 border-t border-neutral-200">
              <Text className="text-sm font-semibold text-neutral-700 mb-2">
                Dirección de Envío:
              </Text>
              <Text className="text-sm text-neutral-900 m-0">
                {order.shipping_address?.address_1}
                {order.shipping_address?.address_2 && `, ${order.shipping_address.address_2}`}
              </Text>
              <Text className="text-sm text-neutral-900 m-0">
                {order.shipping_address?.city}, {order.shipping_address?.province} {order.shipping_address?.postal_code}
              </Text>
              <Text className="text-sm text-neutral-900 m-0">
                {order.shipping_address?.country_code?.toUpperCase()}
              </Text>
              {order.shipping_address?.phone && (
                <Text className="text-sm text-neutral-900 m-0">
                  📞 {order.shipping_address.phone}
                </Text>
              )}
            </Section>

            {/* Shipping Method */}
            {order.shipping_methods && order.shipping_methods.length > 0 && (
              <Section className="pt-4 border-t border-neutral-200 mt-4">
                <Text className="text-sm font-semibold text-neutral-700 mb-1">
                  Método de Envío:
                </Text>
                <Text className="text-sm text-neutral-900 m-0">
                  {order.shipping_methods[0].name} - {formatPrice(order.shipping_methods[0].total)}
                </Text>
              </Section>
            )}
          </Container>

          {/* Action Required Section */}
          <Container className="max-w-2xl mx-auto bg-[#FFF5E0] border-2 border-[#E0FA5B] rounded-lg p-6 mb-6">
            <Heading className="text-lg font-bold text-neutral-900 mb-2 m-0">
              ⚡ Próximos Pasos:
            </Heading>
            <Text className="text-sm text-neutral-700 m-0 mb-1">
              1. Revisar disponibilidad de stock
            </Text>
            <Text className="text-sm text-neutral-700 m-0 mb-1">
              2. Preparar el pedido para envío
            </Text>
            <Text className="text-sm text-neutral-700 m-0 mb-1">
              3. Marcar como cumplido en el admin
            </Text>
          </Container>

          {/* Footer */}
          <Section className="bg-neutral-800 text-white p-6 mt-6 rounded-lg" style={{ backgroundColor: '#262626', colorScheme: 'light' }}>
            <Row className="mb-4" style={{ backgroundColor: '#262626' }}>
              <Column align="center" style={{ backgroundColor: '#262626' }}>
                <Img 
                  src="https://raqueto.shop/raqueto-logo-white.png" 
                  alt="Raqueto" 
                  width="140" 
                  height="auto"
                  style={{ display: 'block', margin: '0 auto 16px auto', backgroundColor: '#262626' }}
                />
              </Column>
            </Row>
            <Text className="text-center text-neutral-300 text-sm m-0 mb-2">
              Admin Notifications
            </Text>
            <Text className="text-center text-neutral-400 text-xs m-0">
              Order ID: {order.id}
            </Text>
            <Text className="text-center text-neutral-400 text-xs m-0">
              Este email fue enviado automáticamente a los administradores de la tienda.
            </Text>
          </Section>
        </Body>
      </Html>
    </Tailwind>
  )
}

export const orderPlacedAdminEmail = (props: OrderPlacedAdminEmailProps) => (
  <OrderPlacedAdminEmailComponent {...props} />
)

// Mock data for preview
const mockOrder = {
  order: {
    id: "order_01JSNXDH9BPJWWKVW03B9E9KW8",
    display_id: 1,
    email: "cliente@example.com",
    currency_code: "mxn",
    total: 2500,
    subtotal: 2200,
    discount_total: 0,
    shipping_total: 300,
    tax_total: 0,
    item_subtotal: 2200,
    item_total: 2200,
    item_tax_total: 0,
    customer_id: "cus_01JSNXD6VQC1YH56E4TGC81NWX",
    items: [
      {
        id: "ordli_01JSNXDH9C47KZ43WQ3TBFXZA9",
        title: "Pro Staff",
        subtitle: "Wilson Pro Staff RF97",
        thumbnail: "https://example.com/racquet.jpg",
        variant_id: "variant_01JSNXAQCZ5X81A3NRSVFJ3ZHQ",
        product_id: "prod_01JSNXAQBQ6MFV5VHKN420NXQW",
        product_title: "Wilson Pro Staff RF97",
        variant_title: "Grip 4 3/8",
        quantity: 1,
        unit_price: 2200,
        total: 2200,
      }
    ],
    shipping_address: {
      id: "caaddr_01JSNXD6W0TGPH2JQD18K97B25",
      first_name: "Juan",
      last_name: "Pérez",
      address_1: "Av. Reforma 123",
      address_2: "Piso 4",
      city: "Ciudad de México",
      country_code: "mx",
      province: "CDMX",
      postal_code: "06600",
      phone: "+52 55 1234 5678",
    },
    billing_address: {},
    shipping_methods: [
      {
        id: "ordsm_01JSNXDH9B9DDRQXJT5J5AE5V1",
        name: "Envío Express",
        total: 300,
      }
    ],
    customer: {
      id: "cus_01JSNXD6VQC1YH56E4TGC81NWX",
      first_name: "Juan",
      last_name: "Pérez",
      email: "juan.perez@example.com",
    }
  }
}

// @ts-ignore
export default () => <OrderPlacedAdminEmailComponent {...mockOrder} />

