import { IsNumber, IsPositive, IsString } from "class-validator"
import { PartialType } from '@nestjs/mapped-types'


export class CreateEventDTO {
    @IsString()
    type: string

    @IsNumber()
    @IsPositive()
    budget: number
}


export class UpdateEventDTO extends PartialType(CreateEventDTO){}