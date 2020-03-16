import {
    AllowNull,
    AutoIncrement,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from "sequelize-typescript";
import {Scene} from './scene';
import {Hashtag} from "./hashtag";
import {AdventureHashtag} from "./adventureHashtag";

@Table({
    timestamps: false,
    tableName: 'adventure'
})
export class Adventure extends Model<Adventure>{

    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    get id(): number {
        return this.getDataValue('id');
    }

    @AllowNull(false)
    @Column(DataType.STRING(255))
    get name(): string{
        return this.getDataValue('name');
    }

    @ForeignKey(() => Scene)
    @Column({
        type: DataType.INTEGER,
        field: 'first_scene_id'
    })
    firstSceneId?: number;

    @Column(DataType.TEXT)
    description?: string;

    @Column({
        type:DataType.TEXT,
        field: 'picture_link'
    })
    pictureLink?: string;

    @BelongsToMany(() => Hashtag, ()=> AdventureHashtag)
    hashtags?: Hashtag[]
}
