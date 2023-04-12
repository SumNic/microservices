import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";

// generic - показывает какие поля нам нужны для создания класса, остальные поля для создания класса не нужны
interface ProfileCreationAttrs {
    first_name: string;
    last_name: string;
    phone: number;
    userId: number;
}

@Table({tableName: 'profile'}) 
export class Profile extends Model<Profile, ProfileCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ApiProperty({example: 'Имя', description: 'Имя пользователя'})
    @Column({type: DataType.STRING, allowNull: false})
    first_name: string;
    
    @ApiProperty({example: 'Фамилия', description: 'Фамилия пользователя'})
    @Column({type: DataType.STRING, allowNull: false})
    last_name: string;
    
    @ApiProperty({example: '7-987-123-45-67', description: 'Телефон пользователя'})
    @Column({type: DataType.INTEGER, allowNull: false})
    phone: number;

    @Column({type: DataType.STRING, defaultValue: 'profile'})
    essenceTable: string;

    @Column({type: DataType.INTEGER})
    userId: number;

    // @ForeignKey(() => User)
    // @Column({type: DataType.INTEGER})
    // userId: number;
    
    // @BelongsTo(() => User)
    // user: User;
}