import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';

@Controller('location')
@ApiTags("Location")
export class LocationController {
  constructor(private locationService : LocationService){}

  @Get('/province')
  async getProvince() {
    return this.locationService.getAllProvince()
  }

  @Get('/city')
  async getCity() {
    return this.locationService.getAllCity()
  }
}
