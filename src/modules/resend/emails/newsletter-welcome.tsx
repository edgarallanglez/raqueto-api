import { 
  Text, 
  Container, 
  Heading, 
  Html, 
  Section, 
  Tailwind, 
  Head, 
  Preview, 
  Body, 
  Link,
  Button,
  Row,
  Column,
  Img
} from "@react-email/components"

type NewsletterWelcomeEmailProps = {
  email: string
  promoCode?: string
}

function NewsletterWelcomeEmailComponent({ email, promoCode = "WELCOME5" }: NewsletterWelcomeEmailProps) {
  return (
    <Tailwind>
      <Html className="font-sans bg-neutral-50">
      <Head />
        <Preview>¡Bienvenido a Raqueto! 🎾 Aquí tienes tu código de descuento exclusivo</Preview>
        <Body className="bg-neutral-50 my-0 mx-auto w-full">
          {/* Header */}
          <Section className="text-white px-8 py-6" style={{ backgroundColor: '#021326' }}>
            <Container className="max-w-2xl mx-auto">
              <Row>
                <Column align="center">
                  <Img
                    src="https://raqueto.shop/raqueto-logo-white.png"
                    alt="Raqueto Logo"
                    width="180"
                    height="42"
                    className="mx-auto"
                  />
                </Column>
              </Row>
            </Container>
          </Section>

          {/* Accent Bar */}
          <Section className="bg-[#E0FA5B] h-2" />

          {/* Main Content */}
          <Container className="max-w-2xl mx-auto bg-white my-8 rounded-lg shadow-sm p-10">
            <Section className="text-center mb-8">
              <Heading className="text-3xl font-bold text-neutral-900 mb-2">
                ¡Bienvenido al equipo! 🎾
              </Heading>
              <Text className="text-base text-neutral-600">
                Gracias por suscribirte a nuestro newsletter.
              </Text>
            </Section>

            <Section className="mb-8 pb-8 border-b-2 border-neutral-100">
              <Text className="text-neutral-900 text-base leading-relaxed mb-4">
                Hola {email},
              </Text>
              <Text className="text-neutral-700 text-base leading-relaxed mb-4">
                ¡Nos emociona tenerte en la familia Raqueto! Serás el primero en enterarte de:
              </Text>
              <ul style={{ margin: '0 0 16px 0', padding: '0 0 0 24px' }}>
                <li style={{ marginBottom: '8px', color: '#404040' }}>
                  <Text className="text-neutral-700 text-base leading-relaxed" style={{ margin: 0 }}>
                    🎾 Nuevos productos y lanzamientos exclusivos
                  </Text>
                </li>
                <li style={{ marginBottom: '8px', color: '#404040' }}>
                  <Text className="text-neutral-700 text-base leading-relaxed" style={{ margin: 0 }}>
                    🏷️ Ofertas especiales y descuentos
                  </Text>
                </li>
                <li style={{ marginBottom: '8px', color: '#404040' }}>
                  <Text className="text-neutral-700 text-base leading-relaxed" style={{ margin: 0 }}>
                    📚 Consejos de expertos y guías de equipamiento
                  </Text>
                </li>
                <li style={{ color: '#404040' }}>
                  <Text className="text-neutral-700 text-base leading-relaxed" style={{ margin: 0 }}>
                    ⭐ Acceso anticipado a ventas especiales
                  </Text>
                </li>
              </ul>
            </Section>

            {/* Promo Code Section */}
            <Section className="my-8 p-8 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, #E0FA5B 0%, #B8D147 100%)' }}>
              <Text className="text-neutral-900 text-xl font-bold mb-4" style={{ margin: '0 0 16px 0' }}>
                ¡Aquí está tu regalo de bienvenida! 🎁, recuerda que debes registrarte para poder usar tu código de descuento
              </Text>
              <Text className="text-neutral-800 text-base mb-6" style={{ margin: '0 0 24px 0' }}>
                Usa este código en tu primera compra:
              </Text>
              <div 
                style={{ 
                  backgroundColor: '#ffffff',
                  border: '3px dashed #021326',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '24px'
                }}
              >
                <Text 
                  className="text-4xl font-black tracking-wider" 
                  style={{ 
                    margin: 0,
                    color: '#021326',
                    letterSpacing: '0.1em',
                    fontFamily: 'monospace'
                  }}
                >
                  {promoCode}
                </Text>
              </div>
              <Text className="text-neutral-800 text-lg font-semibold" style={{ margin: 0 }}>
                5% de descuento en el total de tu primera compra
              </Text>
              <Text className="text-neutral-700 text-sm mt-2" style={{ margin: '8px 0 0 0' }}>
                * Aplicable en productos seleccionados. Válido por 30 días.
              </Text>
            </Section>

            <Section className="text-center my-10">
              <Button
                className="rounded-lg text-black text-base font-bold no-underline text-center px-8 py-4"
                href="https://raqueto.shop/store"
                style={{
                  backgroundColor: '#021326',
                  color: '#E0FA5B',
                  borderRadius: '8px',
                  textDecoration: 'none'
                }}
              >
                Explorar Productos →
              </Button>
            </Section>

            <Section className="my-8 p-6 rounded-lg" style={{ backgroundColor: '#f5f5f5' }}>
              <Text className="text-neutral-700 text-sm leading-relaxed text-center mb-2" style={{ margin: '0 0 8px 0' }}>
                <strong>Síguenos en redes sociales:</strong>
              </Text>
              <Row>
                <Column align="center">
                  <Link 
                    href="https://www.instagram.com/raquetoshop" 
                    className="text-sm mx-2"
                    style={{ color: '#021326', textDecoration: 'none' }}
                  >
                    Instagram
                  </Link>
                  <Text style={{ display: 'inline', margin: '0 8px', color: '#737373' }}>•</Text>
                  <Link 
                    href="https://www.facebook.com/profile.php?id=61584131074656" 
                    className="text-sm mx-2"
                    style={{ color: '#021326', textDecoration: 'none' }}
                  >
                    Facebook
                  </Link>
                  <Text style={{ display: 'inline', margin: '0 8px', color: '#737373' }}>•</Text>
                  <Link 
                    href="https://raqueto.shop" 
                    className="text-sm mx-2"
                    style={{ color: '#021326', textDecoration: 'none' }}
                  >
                    Tienda Online
                  </Link>
                </Column>
              </Row>
            </Section>

            <Section className="mt-8 pt-8 border-t-2 border-neutral-100">
              <Text className="text-neutral-600 text-xs leading-relaxed text-center">
                Recibes este email porque te suscribiste a nuestro newsletter en{' '}
                <Link href="https://raqueto.shop" style={{ color: '#021326' }}>raqueto.shop</Link>.
                <br />
                Si deseas darte de baja, puedes{' '}
                <Link href="https://raqueto.shop/unsubscribe" style={{ color: '#021326' }}>
                  cancelar tu suscripción aquí
                </Link>.
              </Text>
            </Section>
          </Container>

          {/* Footer */}
          <Section className="bg-gray-50 p-6 mt-10">
            <Row className="mb-6">
              <Column align="center">
                <Img
                  src="https://raqueto.shop/Logo.png"
                  alt="Raqueto Logo"
                  width="140"
                  height="33"
                  className="mx-auto"
                />
              </Column>
            </Row>
            <Text className="text-center text-gray-500 text-sm">
              ¿Necesitas ayuda? Contáctanos en hola@raqueto.shop
            </Text>
            <Text className="text-center text-gray-400 text-xs mt-4">
              © {new Date().getFullYear()} Raqueto. Todos los derechos reservados.
            </Text>
          </Section>
        </Body>
      </Html>
      </Tailwind>
  )
}

export const newsletterWelcomeEmail = (props: NewsletterWelcomeEmailProps) => (
  <NewsletterWelcomeEmailComponent {...props} />
)

// Mock data for preview/development
const mockData: NewsletterWelcomeEmailProps = {
  email: "nuevo@cliente.com",
  promoCode: "WELCOME5"
}

export default () => <NewsletterWelcomeEmailComponent {...mockData} />

