import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
} from "@react-email/components"
import { siteConfig } from "@/config/site"
import { render } from "@react-email/render"

interface ContactAutoReplyEmailProps {
  name: string
  message: string
}

export function ContactAutoReplyEmail({
  name,
  message,
}: ContactAutoReplyEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Text>Hi {name},</Text>
          <Text>
            Thanks for reaching out. We have received your message and will get
            back to you within 24 hours.
          </Text>
          <Section>
            <Text>
              <strong>Your message:</strong>
            </Text>
            <Text className="whitespace-pre-wrap text-gray-600">{message}</Text>
          </Section>
          <Text>— {siteConfig.emails.contact.sender}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const renderContactAutoReplyEmail = async (
  name: string,
  message: string
) => render(<ContactAutoReplyEmail name={name} message={message} />)
