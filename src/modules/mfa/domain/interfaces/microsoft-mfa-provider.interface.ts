export interface MicrosoftIdentity {
  providerUserId: string;
  email: string;
  name: string;
  tenantId: string;
}

export interface BuildMicrosoftAuthorizationUrlInput {
  state: string;
  redirectUri?: string;
}

export interface VerifyMicrosoftSecondFactorInput {
  identity: MicrosoftIdentity;
  verificationCode: string;
}

export const MICROSOFT_MFA_PROVIDER = Symbol('MICROSOFT_MFA_PROVIDER');

export interface MicrosoftMfaProvider {
  buildAuthorizationUrl(
    input: BuildMicrosoftAuthorizationUrlInput,
  ): Promise<string> | string;
  exchangeCodeForIdentity(
    code: string,
  ): Promise<MicrosoftIdentity> | MicrosoftIdentity;
  verifySecondFactor(
    input: VerifyMicrosoftSecondFactorInput,
  ): Promise<boolean> | boolean;
}
