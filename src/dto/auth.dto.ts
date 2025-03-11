import { IsEmail, IsString, Max, Min } from "class-validator";


export class ResetPaswordStep1 {
    @IsString()
    @IsEmail()
    email: string
}

export class ResetPaswordStep2 {
    @IsString()
    @Min(8)
    @Max(50)
    newPassword: string
}