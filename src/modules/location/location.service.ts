import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/providers/prisma'

@Injectable()
export class LocationService {
  constructor(private prismaService: PrismaService) {}

  async getAllProvince() {
    return await this.prismaService.province.findMany()
  }

  async getAllCity() {
    return await this.prismaService.city.findMany()
  }
}
