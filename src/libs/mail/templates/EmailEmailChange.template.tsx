import * as React from 'react';
import { Body, Heading, Html, Tailwind, Text } from '@react-email/components';

interface EmailChangeTemplateProps {
  token: string;
}

export function EmailChangeTemplate({ token }: EmailChangeTemplateProps) {
  return (
    <Tailwind>
      <Html>
        <Body>
          <Heading className="text-black">Изменение почты</Heading>
          <Text>
            Ваш код для изменения почты:<strong>{' ' + token}</strong>
          </Text>
          <Text>
            Пожалуйста, введите этот код в приложение для завершения процесса
            смены почты.Код действителен 5 минут.
          </Text>
          <Text>
            Если вы не запрашивали этот код, просто проигнорируйте это
            сообщение.
          </Text>
        </Body>
      </Html>
    </Tailwind>
  );
}
