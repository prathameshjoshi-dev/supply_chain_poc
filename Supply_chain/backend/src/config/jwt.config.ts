export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'super-secret-key-for-dev-only',
  signOptions: { expiresIn: 3600 },
};
