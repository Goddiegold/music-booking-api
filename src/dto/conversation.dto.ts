import {
    IsNotEmpty,
    IsPhoneNumber,
    IsString,
    IsOptional,
} from 'class-validator';

export class CreateConversationDTO {
    @IsString()
    @IsOptional()
    title: string;
}


export class UpdateConversationDTO {
    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsNotEmpty()
    resource: string


    @IsString()
    @IsNotEmpty()
    type: string
}