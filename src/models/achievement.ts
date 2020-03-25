import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { Scene } from './scene';

@Table({
    timestamps: false,
    tableName: 'achievement',
})
export class Achievement extends Model<Achievement> {
    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    get id(): number {
        return this.getDataValue('id');
    }

    @AllowNull(false)
    @Column(DataType.STRING(255))
    get name(): string {
        return this.getDataValue('name');
    }

    @ForeignKey(() => Scene)
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
        field: 'scene_id',
    })
    get sceneId(): number {
        return this.getDataValue('sceneId');
    }

    @AllowNull(false)
    @Column({
        type: DataType.TEXT,
        field: 'picture_link',
    })
    get pictureLink(): string {
        return this.getDataValue('pictureLink');
    }

    @BelongsTo(() => Scene)
    scene?: Scene;
}
