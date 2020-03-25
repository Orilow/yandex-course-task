import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Adventure } from './adventure';
import { Hashtag } from './hashtag';

@Table({
    timestamps: false,
    tableName: 'adventure_hashtag',
})
export class AdventureHashtag extends Model<AdventureHashtag> {
    @ForeignKey(() => Adventure)
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        field: 'adventure_id',
    })
    get adventureId(): number {
        return this.getDataValue('adventureId');
    }

    @ForeignKey(() => Hashtag)
    @PrimaryKey
    @Column({
        type: DataType.STRING(255),
        field: 'hashtag_name',
    })
    get hashtagName(): number {
        return this.getDataValue('hashtagName');
    }
}
