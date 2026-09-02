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

interface PasswordResetTemplateProps {
  domain: string;
  token: string;
}

export function PasswordResetTemplate({
  domain,
  token,
}: PasswordResetTemplateProps) {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  return (
    <Html>
      <Body className="bg-white font-sans antialiased my-auto mx-auto text-[#09090b]">
        <Tailwind
          children={
            <Container className="border border-solid border-[#e4e4e7] rounded-lg my-[40px] mx-auto p-[24px] max-w-[465px] shadow-sm">
              <Section>
                <Heading className="text-[24px] font-semibold tracking-tight m-0 mb-4 text-[#09090b]">
                  Сброс пароля
                </Heading>

                <Text className="text-[14px] leading-[24px] text-[#71717a] m-0 mb-6">
                  Привет! Вы получили это письмо, потому что запросили сброс
                  пароля для своего аккаунта. Пожалуйста, перейдите по следующей
                  ссылке, чтобы установить новый пароль:
                </Text>

                <Section className="mb-6">
                  <Link
                    href={resetLink}
                    className="bg-[#18181b] text-[#fafafa] text-[14px] font-medium py-2.5 px-4 rounded-md no-underline inline-block"
                  >
                    Сбросить пароль
                  </Link>
                </Section>

                <Text className="text-[13px] leading-[20px] text-[#a1a1aa] m-0 border-t border-solid border-[#e4e4e7] pt-4">
                  Эта ссылка действительна в течение 1 часа. Если вы не
                  запрашивали сброс пароля, просто проигнорируйте это письмо —
                  ваш текущий пароль останется в безопасности.
                </Text>
              </Section>
            </Container>
          }
        />
      </Body>
    </Html>
  );
}
