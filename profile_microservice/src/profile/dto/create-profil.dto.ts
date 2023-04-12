import { ApiProperty } from "@nestjs/swagger";

export class CreateProfileDto {
    @ApiProperty({example: 'user@mail.ru', description: 'Почтовый адрес'})
    readonly email: string;
    @ApiProperty({example: '123456', description: 'Пароль пользователя'})
    readonly password: string;
    @ApiProperty({example: 'Имя', description: 'Имя пользователя'})
    readonly first_name: string;
    @ApiProperty({example: 'Фамилия', description: 'Фамилия пользователя'})
    readonly last_name: string;
    @ApiProperty({example: '7-987-123-45-67', description: 'Телефон пользователя'})
    readonly phone: number;
    readonly essenceTable: string;
    @ApiProperty({example: 'image.jpg', description: 'Фотография'})
    readonly image: string;
    
    readonly userId: number;
}