import * as React from 'react';
import {
  Body,
  Heading,
  Html,
  Tailwind,
  Text,
} from '@react-email/components';

interface TwoFactorAuthTemplateProps {
  token: string;
}

export function TwoFactorAuthTemplate({ token }: TwoFactorAuthTemplateProps) {
  return (
    <Tailwind>
      <Html>
        <Body>
          <Heading className="text-black">Двухфакторная аутентификация</Heading>
          <Text>
            Ваш код двухфакторной аутентификации:<strong>{" " + token}</strong>
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
