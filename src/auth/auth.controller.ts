import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './strategy/local.strategy';
import { AuthService } from './auth.service';
import { SkipAuthDecorator } from './strategy/public.decorator';
import { SignUpDto } from './dto/sign-up.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @SkipAuthDecorator()
  @Post('sign-in')
  async signIn(@Req() req, @Res() res) {
    const result = await this.authService.login(
      req.user,
      req.headers['user-agent'],
    );
    await this.authService.setTokenToHttpOnlyCookie(res, result);
    res.status(201).json({ message: 'User successfully sign up' });
  }

  @SkipAuthDecorator()
  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto, @Req() req, @Res() res: Response) {
    const newUser = await this.authService.register(dto);
    const result = await this.authService.login(
      newUser,
      req.headers['user-agent'],
    );
    await this.authService.setTokenToHttpOnlyCookie(res, result);
    res.status(201).json({ message: 'User successfully registered' });
  }

  @SkipAuthDecorator()
  @Post('logout')
  async logout(@Res() res) {
    await this.authService.removeHttpOnlyCookie(res);
    res.status(201).json({ message: 'User successfully logout' });
  }

  @SkipAuthDecorator()
  @Post('refresh')
  async refresh(@Req() req, @Res() res: Response) {
    console.log('refresh::controller', req.cookie['refresh']);

    // const result = await this.authService.refresh(
    //   req.cookie['access'],
    //   req.cookie['refresh'],
    //   req.headers['user-agent'],
    // );
  }

  @Post('sign-out')
  async signOut(@Req() req, @Res() res: Response) {
    await this.authService.signOut(req.user);
    await this.authService.removeHttpOnlyCookie(res);
    res.status(201).json({ message: 'User successfully sign out' });
  }
}
