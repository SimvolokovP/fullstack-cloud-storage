import { Request } from 'express';
import { SessionData } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

declare module 'express' {
  interface Request {
    session: SessionData;
  }
}
