import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class ApproveEventDto {
    @IsBoolean()
    @ApiProperty()
    verified: boolean;
}