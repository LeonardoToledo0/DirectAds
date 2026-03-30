export class AuthResponseDto {
  accessToken!: string;
  user!: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
