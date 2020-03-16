import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey, Table
} from "sequelize-typescript";
import {Scene} from "./scene";


@Table({
    timestamps: false,
    tableName: 'action'
})
export class Action extends Model<Action>{
    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    get id(): number {
        return this.getDataValue('id');
    }

    @AllowNull(false)
    @Column({
        type: DataType.STRING(255),
        field: 'name'
    })
    get name(): string {
        return this.getDataValue('name');
    }

    @ForeignKey(() => Scene)
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
        field: 'scene_id'
    })
    get sceneId(): number {
        return this.getDataValue('sceneId');
    }

    @BelongsTo(() => Scene, {
        as: 'currentScene',
        foreignKey: 'scene_id'
    })
    get currentScene(): Scene {
        return this.getDataValue('currentScene');
    }

    @ForeignKey(() => Scene)
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
        field: 'refer_to_scene_id'
    })
    get nextSceneId(): number {
        return this.getDataValue('nextSceneId');
    }

    @BelongsTo(() => Scene, {
        as: 'nextScene',
        foreignKey: 'refer_to_scene_id'
    })
    get nextScene(): Scene {
        return this.getDataValue('nextScene');
    }
}
