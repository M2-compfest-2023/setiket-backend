import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class ApprovalEo {
    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        example: true,
    })
    approve: boolean;
}
