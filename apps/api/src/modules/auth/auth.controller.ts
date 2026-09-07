import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { LoginDto, AuthResponse, UserSession } from '@bhumitra/types';

@ApiTags('Authentication & Identity')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Officer authentication via credentials or SSO preset' })
  @ApiResponse({ status: 200, description: 'JWT authentication successful' })
  @ApiResponse({ status: 401, description: 'Invalid officer credentials' })
  async login(@Body() loginDto: LoginDto): Promise<{ data: AuthResponse; meta: { timestamp: string } }> {
    const authData = await this.authService.login(loginDto);
    return {
      data: authData,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT access token using refresh token' })
  @ApiResponse({ status: 200, description: 'Access token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Body() body: { refreshToken: string }) {
    const data = await this.authService.refreshToken(body.refreshToken);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update officer password with verification of existing password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 401, description: 'Current password mismatch' })
  async changePassword(
    @CurrentUser() user: UserSession,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    const data = await this.authService.changePassword(user.id, body.currentPassword, body.newPassword);
    return { data };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Officer session termination' })
  logout(): { data: { message: string } } {
    return {
      data: {
        message: 'Officer logged out successfully',
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current authenticated officer profile and permissions' })
  @ApiResponse({ status: 200, description: 'Authenticated officer profile' })
  getProfile(@CurrentUser() user: UserSession): { data: UserSession } {
    return {
      data: user,
    };
  }

  @Public()
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send Aadhaar/Officer SSO OTP (Prototype Demo)' })
  sendOtp(@Body() _body: { aadhaarNumber?: string; phone?: string }) {
    return {
      data: {
        message: 'Statutory demonstration OTP dispatched',
        expiresInSeconds: 300,
        demoOtp: '2026',
      },
    };
  }

  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify Aadhaar/Officer SSO OTP (Prototype Demo)' })
  verifyOtp(@Body() body: { otp: string; userId?: string }) {
    return this.login({
      userId: body.userId || 'GJ-DM-VD-0042',
      authMode: 'sso',
    });
  }
}
