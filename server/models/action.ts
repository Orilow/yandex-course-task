import { AllowNull, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';

import Scene from 'models/scene';

@Table({
    timestamps: false,
    tableName: 'action',
})
export default class Action extends Model<Action> {
    @PrimaryKey
    @Column
    id!: number;

    @AllowNull(false)
    @Column
    name!: string;

    @ForeignKey(() => Scene)
    @AllowNull(false)
    @Column({
        field: 'scene_id',
    })
    sceneId!: number;

    @BelongsTo(() => Scene, {
        as: 'currentScene',
        foreignKey: 'scene_id',
    })
    currentScene!: Scene;

    @ForeignKey(() => Scene)
    @AllowNull(false)
    @Column({
        field: 'refer_to_scene_id',
    })
    nextSceneId!: number;

    @BelongsTo(() => Scene, {
        as: 'nextScene',
        foreignKey: 'refer_to_scene_id',
    })
    nextScene!: Scene;
}
