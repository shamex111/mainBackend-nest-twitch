import * as React from 'react';
import {
  Body,
  Heading,
  Html,
  Link,
  Tailwind,
  Text,
} from '@react-email/components';

interface IEmailConfirmation {
  domain: string;
  token: string;
}

export function EmailConfirmationTemplate({ domain, token }: IEmailConfirmation) {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  return (
    <Tailwind>
      <Html>
        <Body className="text-black">
          <Heading>Подтверждения почты</Heading>
          <Text>
            Привет! Что бы подтвердить свой адрес электронной почты, пожалуйста,
            перейдите по следующей ссылке:
          </Text>
          <Link href={confirmLink}>Подтвердить почту</Link>
          <Text>
            Эта ссылка действительна в течении 1 часа. Если вы не запрашивали
            подтверждение, просто проигнорируйте это сообщение.
          </Text>
          <Text>Спасибо за использование нашего сервиса!</Text>
        </Body>
      </Html>
    </Tailwind>
  );
}
