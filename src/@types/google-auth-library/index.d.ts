declare module 'google-auth-library' {
  export class OAuth2Client {
    constructor(clientId?: string, clientSecret?: string, redirectUri?: string);
    verifyIdToken(input: { idToken: string; audience?: string | string[] }): Promise<{ getPayload(): Record<string, unknown> | undefined }>;
  }
}


