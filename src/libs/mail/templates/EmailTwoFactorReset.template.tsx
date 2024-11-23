import * as React from 'react';
import {
  Body,
  Heading,
  Html,
  Link,
  Tailwind,
  Text,
} from '@react-email/components';

interface TwoFactorResetTemplateProps {
  token: string;
}

export function TwoFactorResetTemplate({ token }: TwoFactorResetTemplateProps) {
  return (
    <Tailwind>
      <Html>
        <Body>
          <Heading className="text-black">Отключение двухфакторной аутентификации</Heading>
          <strong>Вы собираетесь отключить 2-ую аутентификацию, это может привести к понижению безопасности аккаунта.</strong>
          <Text>
            Ваш код для отключения двухфакторной аутентификации:<strong>{" " + token}</strong>
          </Text>
          <Text>
            Пожалуйста, введите этот код в приложение для завершения процесса
            аутентификации.Код действителен 5 минут.
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
