import { ApiProperty } from "@nestjs/swagger";

export class AddRoleDto {
    @ApiProperty({example: 'ADMIN', description: 'Назначаемая роль'})
    readonly value: string;
    @ApiProperty({example: '5', description: 'Id пользователя, которому назначается роль'})
    readonly userId: number;
}