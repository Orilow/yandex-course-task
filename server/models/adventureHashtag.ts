import { Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';

import Adventure from './adventure';
import Hashtag from './hashtag';

@Table({
    timestamps: false,
    tableName: 'adventure_hashtag',
})
export default class AdventureHashtag extends Model<AdventureHashtag> {
    @ForeignKey(() => Adventure)
    @PrimaryKey
    @Column({
        field: 'adventure_id',
    })
    adventureId!: number;

    @ForeignKey(() => Hashtag)
    @PrimaryKey
    @Column({
        field: 'hashtag_name',
    })
    hashtagName!: string;
}
