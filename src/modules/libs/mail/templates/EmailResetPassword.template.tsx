import * as React from 'react';
import { Body, Heading, Html, Link, Tailwind, Text } from '@react-email/components';

interface ResetPasswordTemplateProps {
  domain: string;
  token: string;
}

export function ResetPasswordTemplate({
  domain,
  token,
}: ResetPasswordTemplateProps) {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  return (
    <Tailwind>
      <Html>
        <Body>
          <Heading className='text-black'>Сброс пароля</Heading>
          <Text>
            Привет! Вы запросили сброс пароля. Пожалуйста, перейдите по
            следующей ссылке, чтоьы создать новый пароль:
          </Text>
          <Link href={resetLink}>Подтвердить сброс пароля</Link>
          <Text>
            Эта ссылка действительна в течении 1 часа. Если вы не запрашивали
            сброс пароля, просто проигнорируйте это сообщение.
          </Text>
        </Body>
      </Html>
    </Tailwind>
  );
}
