import { BelongsToMany, Column, DataType, HasOne, Model, PrimaryKey, Table } from 'sequelize-typescript';

import AdventureHashtag from './adventureHashtag';
import Hashtag from './hashtag';
import Scene from './scene';

@Table({
    timestamps: false,
    tableName: 'adventure',
})
export default class Adventure extends Model<Adventure> {
    @PrimaryKey
    @Column
    id!: number;

    @Column({
        allowNull: false,
    })
    name!: string;

    @Column({ field: 'first_scene_id' })
    firstSceneId?: number;

    @HasOne(() => Scene)
    firstScene?: Scene;

    @Column(DataType.TEXT)
    description?: string;

    @Column({
        type: DataType.TEXT,
        field: 'picture_link',
    })
    pictureLink?: string;

    @BelongsToMany(
        () => Hashtag,
        () => AdventureHashtag,
    )
    hashtags?: Hashtag[];
}
