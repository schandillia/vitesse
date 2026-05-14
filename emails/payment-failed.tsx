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

interface PaymentFailedEmailProps {
  name: string | null
}

function PaymentFailedEmail({ name }: PaymentFailedEmailProps) {
  return (
    <Html>
      <Head />

      <Body>
        <Container>
          <Text>Hi{name ? ` ${name}` : ""},</Text>

          <Text>We were unable to process your recent payment.</Text>

          <Text>
            Please update your payment method to avoid interruption to your
            subscription.
          </Text>

          <Link href={`${siteConfig.brand.url}/settings/billing`}>
            Manage billing
          </Link>
        </Container>
      </Body>
    </Html>
  )
}

export const renderPaymentFailedEmail = (props: PaymentFailedEmailProps) =>
  render(<PaymentFailedEmail {...props} />)
