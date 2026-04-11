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

interface MagicLinkEmailProps {
  url: string
}

function MagicLinkEmail({ url }: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Text>Welcome to {siteConfig.name}!</Text>
          <Text>Click the link below to log in. It expires in 15 minutes.</Text>
          <Link href={url}>Log in to {siteConfig.name}</Link>
          <Text>
            If you didn’t request this, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const renderMagicLinkEmail = (url: string) =>
  render(<MagicLinkEmail url={url} />)
