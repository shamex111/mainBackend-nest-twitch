import { applyDecorators, UseGuards } from '@nestjs/common';

import { AuthProviderGuard } from '../guards/provider.guard';

export function Provider() {
  return applyDecorators(UseGuards(AuthProviderGuard));
}
