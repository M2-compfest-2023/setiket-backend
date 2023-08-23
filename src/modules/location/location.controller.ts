import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { ResponseMessage } from '@/common/decorators/responseMessage.decorator';
import { CityParam } from './dtos/city.dto';

@Controller('location')
@ApiTags("Location")
export class LocationController {
  constructor(private locationService : LocationService){}

  @Get('/province')
  @ResponseMessage("Success get all province")
  async getProvince() {
    return this.locationService.getAllProvince()
  }

  @Get('/city')
  @ResponseMessage("Success get all cities")
  async getCity() {
    return this.locationService.getAllCity()
  }

  @Get('/city/:province_id')
  @ResponseMessage("Success get cities for one province")
  async getCityByProvince(@Param() params : CityParam) {
    return this.locationService.getAllCity(params.province_id)
  }
}
