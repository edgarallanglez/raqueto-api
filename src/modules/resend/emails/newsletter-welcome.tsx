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
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <style>{`
          @media (prefers-color-scheme: dark) {
            .accent-bar {
              background-color: #E0FA5B !important;
            }
            .promo-section {
              // background-color: #E0FA5B !important;
            }
            .promo-section * {
              color: #fff !important;
            }
            .promo-code-box {
              background-color: #E0FA5B !important;
              border-color: #E0FA5B !important;
              color: #ffffff !important;
            }
            .promo-code-text {
              color: #000000 !important;
            }
            .cta-button {
              background-color: #021326 !important;
              color: #E0FA5B !important;
            }
            .footer-logo {
              filter: none !important;
              opacity: 1 !important;
            }
          }
        `}</style>
      </Head>
        <Preview>¡Bienvenido a Raqueto! 🎾 Aquí tienes tu código de descuento exclusivo</Preview>
        <Body className="bg-neutral-50 my-0 mx-auto w-full">
          {/* Header */}
          <Section className="text-white px-8 py-6" style={{ backgroundColor: '#021326', colorScheme: 'light' }}>
            <Container className="max-w-2xl mx-auto" style={{ backgroundColor: '#021326' }}>
              <Row style={{ backgroundColor: '#021326' }}>
                <Column align="center" style={{ backgroundColor: '#021326' }}>
                  <Img
                    src="https://raqueto.shop/raqueto-logo-white.png"
                    alt="Raqueto Logo"
                    width="200"
                    height="auto"
                    className="mx-auto"
                    style={{ backgroundColor: '#021326' }}
                  />
                </Column>
              </Row>
            </Container>
          </Section>

          {/* Accent Bar */}
          <Section className="bg-[#E0FA5B] h-2 accent-bar" style={{ backgroundColor: '#E0FA5B', colorScheme: 'light', height: '8px' }} />

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
            <Section className="my-8 p-8 rounded-xl text-center promo-section" style={{ colorScheme: 'light' }}>
              <Text className="text-neutral-900 text-xl font-bold mb-4" style={{ margin: '0 0 16px 0', color: '#000000' }}>
                ¡Aquí está tu regalo de bienvenida! 🎁, recuerda que debes registrarte para poder usar tu código de descuento
              </Text>
              <Text className="text-neutral-800 text-base mb-6" style={{ margin: '0 0 24px 0', color: '#000000' }}>
                Usa este código en tu primera compra:
              </Text>
              <div 
                className="promo-code-box"
                style={{ 
                  backgroundColor: '#E0FA5B',
                  border: '3px dashed #E0FA5B',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '24px'
                }}
              >
                <Text 
                  className="text-4xl tracking-wider promo-code-text" 
                  style={{ 
                    margin: 0,
                    color: '#000000',
                    letterSpacing: '0.1em',
                    fontFamily: 'monospace',
                    fontWeight: 'bold'
                  }}
                >
                  {promoCode}
                </Text>
              </div>
              <Text className="text-neutral-800 text-lg font-semibold" style={{ margin: 0, color: '#000000' }}>
                5% de descuento en el total de tu primera compra
              </Text>
              <Text className="text-neutral-700 text-sm mt-2" style={{ margin: '8px 0 0 0', color: '#000000' }}>
                * Aplicable en productos seleccionados. Válido por 30 días.
              </Text>
            </Section>

            <Section className="text-center my-10">
              <Button
                className="rounded-lg text-black text-base font-bold no-underline text-center px-8 py-4 cta-button"
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
          <Section className="bg-gray-50 p-6 mt-10" style={{ backgroundColor: '#f9fafb', colorScheme: 'light' }}>
            <Row className="mb-6" style={{ backgroundColor: '#f9fafb' }}>
              <Column align="center" style={{ backgroundColor: '#f9fafb' }}>
                <Img
                  src="https://raqueto.shop/Logo.png"
                  alt="Raqueto Logo"
                  width="140"
                  height="auto"
                  className="mx-auto"
                  style={{ backgroundColor: '#f9fafb' }}
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

