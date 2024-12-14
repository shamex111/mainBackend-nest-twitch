export interface SessionMetadata {
  location: {
    country: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  device: {
    browser: string;
    os: string;
    type: string;
  };
  ip: string;
}

export interface SessionCookie {
  originalMaxAge: number;
  expires: string;
  secure: boolean;
  httpOnly: boolean;
  domain: string;
  path: string;
  sameSite: 'lax' | 'strict' | 'none';
}

export interface Session {
  cookie: SessionCookie;
  createdAt: string;
  metadata: SessionMetadata;
  userId: string;
}
