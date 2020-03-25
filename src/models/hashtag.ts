import { BelongsToMany, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Adventure } from './adventure';
import { AdventureHashtag } from './adventureHashtag';

@Table({
    timestamps: false,
    tableName: 'hashtag',
})
export class Hashtag extends Model<Hashtag> {
    @PrimaryKey
    @Column(DataType.STRING(255))
    get name(): string {
        return this.getDataValue('name');
    }

    @Column({
        type: DataType.STRING(255),
        field: 'ru_analog',
    })
    get ruName(): string {
        return '#' + this.getDataValue('ruName');
    }

    @BelongsToMany(
        () => Adventure,
        () => AdventureHashtag,
    )
    adventures?: Adventure[];
}
