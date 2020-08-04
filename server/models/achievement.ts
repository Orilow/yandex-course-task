import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';

import Scene from 'models/scene';

@Table({
    timestamps: false,
    tableName: 'achievement',
})
export default class Achievement extends Model<Achievement> {
    @PrimaryKey
    @Column
    id!: number;

    @AllowNull(false)
    @Column
    name!: string;

    @AllowNull(false)
    @Column({
        type: DataType.TEXT,
        field: 'picture_link',
    })
    pictureLink!: string;

    @ForeignKey(() => Scene)
    @AllowNull(false)
    @Column({
        field: 'scene_id',
    })
    sceneId!: number;

    @BelongsTo(() => Scene)
    scene?: Scene;
}
