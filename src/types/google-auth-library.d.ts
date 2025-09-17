// Intentionally left blank: previously provided ambient types for 'google-auth-library'

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


