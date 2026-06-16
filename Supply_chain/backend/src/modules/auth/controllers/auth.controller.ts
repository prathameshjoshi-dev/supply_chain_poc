import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto, RefreshDto } from '../dto/auth.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto.email, loginDto.password);
    return {
      status: 'success',
      data,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshDto: RefreshDto) {
    const data = await this.authService.refreshToken(refreshDto.refreshToken);
    return {
      status: 'success',
      data,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() refreshDto: RefreshDto) {
    await this.authService.logout(refreshDto.refreshToken);
    return {
      status: 'success',
      message: 'Session terminated',
    };
  }

  @Post('sso/callback')
  @HttpCode(HttpStatus.OK)
  async ssoCallback(@Body() body: { provider: string; code: string }) {
    const data = await this.authService.ssoLogin(body.provider, body.code);
    return {
      status: 'success',
      data,
    };
  }
}
