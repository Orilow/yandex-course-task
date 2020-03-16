import {AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table} from "sequelize-typescript";
import {Action} from "./action";
import {Achievement} from './achievement';

@Table({
    timestamps: false,
    tableName: 'scene'
})
export class Scene extends Model<Scene>{

    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    get id(): number{
        return this.getDataValue('id');
    }

    @Column({
        type: DataType.TEXT,
        field: 'picture_link'
    })
    pictureLink?: string;

    @Column({
        type: DataType.TEXT,
        field: 'description'
    })
    get description(): string {
        const value = this.getDataValue('description');
        return value.replace(/\n/g, '<br>');
    }

    @Column({
        type: DataType.STRING(255),
        field: 'description_position'
    })
    descriptionPosition?: string;

    @Column({
        type: DataType.INTEGER,
        field: 'start_scene_id'
    })
    startSceneId?: number;

    @HasMany(() => Action)
    actions?: Action[];

    @HasMany(() => Achievement)
    achievements?: Achievement[]
}
