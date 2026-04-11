import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
} from "@react-email/components"
import { siteConfig } from "@/config/site"
import { render } from "@react-email/render"

interface WelcomeEmailProps {
  name: string | null
}

function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Text>
            Welcome to {siteConfig.name}
            {name ? `, ${name}` : ""}!
          </Text>

          <Text>
            We're glad to have you. Click the link below to get started.
          </Text>
          <Link href={siteConfig.url}>Go to {siteConfig.name}</Link>
          <Text>
            If you didn't create this account, please contact us at{" "}
            <Link href={`mailto:${siteConfig.emails.support}`}>
              {siteConfig.emails.support}
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const renderWelcomeEmail = (name: string) =>
  render(<WelcomeEmail name={name} />)
