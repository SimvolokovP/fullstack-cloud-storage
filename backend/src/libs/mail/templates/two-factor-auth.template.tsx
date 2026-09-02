import {
  Body,
  Heading,
  Tailwind,
  Text,
  Container,
  Section,
} from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

interface TwoFactorAuthTemplateProps {
  token: string;
}

export function TwoFactorAuthTemplate({ token }: TwoFactorAuthTemplateProps) {
  return (
    <Html>
      <Body className="bg-white font-sans antialiased my-auto mx-auto text-[#09090b]">
        <Tailwind
          children={
            <Container className="border border-solid border-[#e4e4e7] rounded-lg my-[40px] mx-auto p-[24px] max-w-[465px] shadow-sm">
              <Section>
                <Heading className="text-[24px] font-semibold tracking-tight m-0 mb-4 text-[#09090b]">
                  Двухфакторная аутентификация
                </Heading>

                <Text className="text-[14px] leading-[24px] text-[#71717a] m-0 mb-6">
                  Привет! Используйте следующий одноразовый код для
                  подтверждения входа в ваш аккаунт:
                </Text>

                <Section className="mb-6 bg-[#f4f4f5] rounded-md p-4 text-center border border-solid border-[#e4e4e7]">
                  <Text className="text-[32px] font-bold tracking-[6px] m-0 font-mono text-[#18181b]">
                    {token}
                  </Text>
                </Section>

                <Text className="text-[13px] leading-[20px] text-[#a1a1aa] m-0 border-t border-solid border-[#e4e4e7] pt-4">
                  Этот код действителен в течение 5 минут. Если вы не
                  запрашивали этот код, пожалуйста, проигнорируйте это письмо и
                  смените ваш пароль в целях безопасности.
                </Text>
              </Section>
            </Container>
          }
        />
      </Body>
    </Html>
  );
}
