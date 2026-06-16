import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from '../../../database/schemas/user.schema';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID') || 'YOUR_GOOGLE_CLIENT_ID';
    this.googleClient = new OAuth2Client(clientId);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ email, status: 'active' }).exec();
    if (user && user.passwordHash && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(email: string, pass: string) {
    const user = await this.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }), // Example refresh token
      expiresIn: 3600,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const newPayload = { email: payload.email, sub: payload.sub, role: payload.role };
      return {
        accessToken: this.jwtService.sign(newPayload),
        expiresIn: 3600,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    // In a real implementation, you might blacklist the token in Redis
    return true;
  }

  async ssoLogin(provider: string, token: string) {
    if (provider !== 'google') {
      throw new BadRequestException('Unsupported SSO provider');
    }

    let payload: any;
    try {
      // With @react-oauth/google useGoogleLogin, we get an access_token
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      
      payload = await response.json();
    } catch (error) {
      throw new UnauthorizedException('Invalid Google access token');
    }

    if (!payload || !payload.email) {
      throw new UnauthorizedException('Google token did not contain an email address');
    }

    // Find or create user
    let user = await this.userModel.findOne({ email: payload.email }).exec();

    if (!user) {
      // Create a new user from Google payload
      const createdUser = new this.userModel({
        name: payload.name || payload.email.split('@')[0],
        email: payload.email,
        passwordHash: '', // No password for SSO users
        role: 'viewer', // Default role
        warehouseIds: [],
        status: 'active',
      });
      user = await createdUser.save();
    } else if (user.status !== 'active') {
      throw new UnauthorizedException('User account is inactive');
    }

    const jwtPayload = { email: user.email, sub: user._id, role: user.role };
    return {
      accessToken: this.jwtService.sign(jwtPayload),
      refreshToken: this.jwtService.sign(jwtPayload, { expiresIn: '7d' }),
    };
  }
}
