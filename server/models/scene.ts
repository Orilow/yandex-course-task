import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';

import Achievement from './achievement';
import Action from './action';
import Adventure from './adventure';

@Table({
    timestamps: false,
    tableName: 'scene',
})
export default class Scene extends Model<Scene> {
    @PrimaryKey
    @Column
    id!: number;

    @ForeignKey(() => Adventure)
    @Column
    adventureId?: number;

    @BelongsTo(() => Adventure)
    adventureStartScene?: Adventure;

    @Column({
        type: DataType.TEXT,
        field: 'picture_link',
    })
    pictureLink?: string;

    @Column({
        type: DataType.TEXT,
        field: 'description',
    })
    description?: string;

    @Column({
        field: 'description_position',
    })
    descriptionPosition?: string;

    @Column({
        field: 'start_scene_id',
    })
    startSceneId?: number;

    @HasMany(() => Action)
    actions?: Action[];

    @HasMany(() => Achievement)
    achievements?: Achievement[];
}
