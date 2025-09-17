declare module 'google-auth-library' {
  export class OAuth2Client {
    constructor(clientId?: string, clientSecret?: string, redirectUri?: string);
    verifyIdToken(input: { idToken: string; audience?: string | string[] }): Promise<{ getPayload(): Record<string, unknown> | undefined }>;
    getToken(codeOrOptions: string | { code: string; redirect_uri?: string }): Promise<{ tokens: { id_token?: string } }>;    
  }
}

declare global {
  interface Window {
    GOOGLE_CLIENT_ID?: string;
    google?: {
      accounts: {
        id?: {
          initialize(config: { client_id: string; callback: (response: { credential?: string }) => void }): void;
          prompt(momentListener?: (notification: unknown) => void): void;
        };
      };
    };
  }
}

export {};


