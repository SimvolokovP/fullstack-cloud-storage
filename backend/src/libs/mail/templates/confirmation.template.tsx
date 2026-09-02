import {
  Body,
  Heading,
  Link,
  Tailwind,
  Text,
  Container,
  Section,
} from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

interface ConfirmationTemplateProps {
  domain: string;
  token: string;
}

export function ConfirmationTemplate({
  domain,
  token,
}: ConfirmationTemplateProps) {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  return (
    <Html>
      <Body className="bg-white font-sans antialiased my-auto mx-auto text-[#09090b]">
        <Tailwind
          children={
            <Container className="border border-solid border-[#e4e4e7] rounded-lg my-[40px] mx-auto p-[24px] max-w-[465px] shadow-sm">
              <Section>
                <Heading className="text-[24px] font-semibold tracking-tight m-0 mb-4 text-[#09090b]">
                  Подтверждение почты
                </Heading>

                <Text className="text-[14px] leading-[24px] text-[#71717a] m-0 mb-6">
                  Привет! Чтобы подтвердить свой адрес электронной почты,
                  пожалуйста, перейдите по следующей ссылке:
                </Text>

                <Section className="mb-6">
                  <Link
                    href={confirmLink}
                    className="bg-[#18181b] text-[#fafafa] text-[14px] font-medium py-2.5 px-4 rounded-md no-underline inline-block"
                  >
                    Подтвердить почту
                  </Link>
                </Section>

                <Text className="text-[13px] leading-[20px] text-[#a1a1aa] m-0 border-t border-solid border-[#e4e4e7] pt-4">
                  Эта ссылка действительна в течение 1 часа. Если вы не
                  запрашивали подтверждение, просто проигнорируйте это
                  сообщение.
                </Text>
              </Section>
            </Container>
          }
        />
      </Body>
    </Html>
  );
}
