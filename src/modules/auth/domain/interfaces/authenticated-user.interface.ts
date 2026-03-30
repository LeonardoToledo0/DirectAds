export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  mfaEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
