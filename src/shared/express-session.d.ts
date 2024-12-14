import { Session } from 'express-session';

declare global {
  namespace Express {
    interface Request {
      session: Session & {
        userId?: string;
        metadata: SessionMetadata;
        passport?: {
          user: string;
        };
        createdAt?: Date | string;
      };
    }
  }
}
