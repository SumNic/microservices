import { ApiProperty } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, HasOne, Model, Table } from "sequelize-typescript";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";
import { Token } from "./token.model";

// generic - показывает какие поля нам нужны для создания класса, остальные поля для создания класса не нужны
interface UserCreationAttrs {
    email: string;
    password: string;
    activationLink: string;
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'user@mail.ru', description: 'Почтовый адрес'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @ApiProperty({example: '123456', description: 'Пароль пользователя'})
    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @ApiProperty({example: 'true', description: 'Активация пользователя'})
    @Column({type: DataType.BOOLEAN, defaultValue: 'false'})
    isActivated: boolean;

    @ApiProperty({example: 'sdfsdf', description: 'Ссылка активации'})
    @Column({type: DataType.STRING})
    activationLink: string;

    // @ApiProperty({example: 'werwer', description: 'Токен'})
    // @HasOne(() => Token) 
    // token: Token[];

    @ApiProperty({example: 'ADMIN', description: 'Роль пользователя'})
    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];
}