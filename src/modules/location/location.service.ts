import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/providers/prisma'
import { Prisma } from '@prisma/client'

@Injectable()
export class LocationService {
  constructor(private prismaService: PrismaService) {}

  async getAllProvince() {
    return await this.prismaService.province.findMany()
  }

  async getAllCity(prov_id ?: number) {
    const option : Prisma.CityFindManyArgs = {}
    if(prov_id) option.where = {
      province_id : prov_id
    }
    return await this.prismaService.city.findMany(option)
  }
}
