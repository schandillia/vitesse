import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
} from "@react-email/components"

import { render } from "@react-email/render"

import { siteConfig } from "@/config/site"

interface SubscriptionCreatedEmailProps {
  name: string | null
  planName: string
}

function SubscriptionCreatedEmail({
  name,
  planName,
}: SubscriptionCreatedEmailProps) {
  return (
    <Html>
      <Head />

      <Body>
        <Container>
          <Text>Hi{name ? ` ${name}` : ""},</Text>

          <Text>Your {planName} subscription is now active.</Text>

          <Text>You now have access to all premium features.</Text>

          <Link href={`${siteConfig.brand.url}/settings/billing`}>
            Manage subscription
          </Link>
        </Container>
      </Body>
    </Html>
  )
}

export const renderSubscriptionCreatedEmail = (
  props: SubscriptionCreatedEmailProps
) => render(<SubscriptionCreatedEmail {...props} />)
