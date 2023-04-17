import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";
import { User } from "./auth.model";

// generic - показывает какие поля нам нужны для создания класса, остальные поля для создания класса не нужны
interface TokenCreationAttrs {
    refreshToken: string;
    userId: number;
}

@Table({tableName: 'token'})
export class Token extends Model<Token, TokenCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'refreshtoken', description: 'Токен'})
    @Column({type: DataType.STRING(1000), allowNull: false})
    refreshToken: string;

    // @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;
    
    // @BelongsTo(() => User)
    // user: User;
}