import { BelongsToMany, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

import Adventure from './adventure';
import AdventureHashtag from './adventureHashtag';

@Table({
    timestamps: false,
    tableName: 'hashtag',
})
export default class Hashtag extends Model<Hashtag> {
    @PrimaryKey
    @Column
    name!: string;

    @Column({
        field: 'ru_analog',
    })
    ruName!: string;

    @BelongsToMany(
        () => Adventure,
        () => AdventureHashtag,
    )
    adventures?: Adventure[];
}
