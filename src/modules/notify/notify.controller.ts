import { Token } from '@/common/decorators/token.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotifyService } from './notify.service';

@Controller('notify')
@ApiTags("Notify")
export class NotifyController {
  constructor(private readonly notifyService : NotifyService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getNotify(@Token('id') id : string) {
    return await this.notifyService.getNotifyByUser(id)
  }
}
