import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
  Heading,
} from "@react-email/components"
import { render } from "@react-email/render"

interface ContactNotificationEmailProps {
  name: string
  email: string
  message: string
}

export function ContactNotificationEmail({
  name,
  email,
  message,
}: ContactNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Heading className="text-xl font-bold">New Contact Message</Heading>
          <Text>
            <strong>From:</strong> {name} ({email})
          </Text>
          <Section>
            <Text>
              <strong>Message:</strong>
            </Text>
            <Text className="whitespace-pre-wrap">{message}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const renderContactNotificationEmail = async (
  name: string,
  email: string,
  message: string
) =>
  render(
    <ContactNotificationEmail name={name} email={email} message={message} />
  )
