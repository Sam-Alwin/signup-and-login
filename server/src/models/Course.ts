import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import User from './User';


interface CourseAttributes {
  id?: number;
  title: string;
  platform: string;
  category: string;
  status: 'Not Started' | 'In Progress' | 'Completed'| 'Deleted';
  rating?: number;
  user_id: number;
}


interface CourseCreationAttributes extends Optional<CourseAttributes, 'id'> {}

class Course extends Model<CourseAttributes, CourseCreationAttributes> {
  declare id?: number;
  declare title: string;
  declare platform: string;
  declare category: string;
  declare status: 'Not Started' | 'In Progress' | 'Completed' | 'Deleted';
  declare rating?: number;
  declare user_id: number;
}

Course.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Not Started', 'In Progress', 'Completed','Deleted'),
      allowNull: false,
      defaultValue: 'Not Started',
    },
    rating: {
      type: DataTypes.INTEGER,
      validate: { min: 0, max: 5 },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  { sequelize, modelName: 'course' }
);

User.hasMany(Course, { foreignKey: 'user_id' });
Course.belongsTo(User, { foreignKey: 'user_id' });

export default Course;
