// import { db } from '../db/database.js';
import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
// 테이블이 db에 있으면 냅두고 없으면 새로 만들도록 해야함.
// 서버를 다시 킬때마다 테이블을 새로 만들면 기존 데이터가 날라가니까..

// DataTypes: 데이터 타입을 결정해주는 prop
const DataTypes = SQ.DataTypes; 

// 몽고DB와 비슷한 부분이 있다. 테이블이름에 s자가 무조건 자동으로 추가된다. 코드에서는 s를 빼고 써야함.
// User라는 객체는 테이블이다.
export const User = sequelize.define(
    'user',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        url: DataTypes.TEXT,
        regdate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
        // regdate: 날짜타입, 현재시간을 자동으로 출력
    },
    { timestamps: false } 
    // timestamps: false는 날짜를 datatime 형태로하기 위함.
)
//findOne(WHERE 조건)은 딱하나만 찾을때. 
export async function findByUsername(username) {
    return User.findOne({ where: { username }});
    // username필드에서 받아온 username과 같은것을 찾아오라는 의미
}

export async function createUser(user){
    return User.create(user).then((data) => data.dataValues.id);
    // user의 형태를 알고있고, 받은 data를 dataValues의 id로 넣게됨
}

export async function findById(id){
    console.log("들어옴 findById");
    return User.findByPk(id) // PK가 id라서, findByPk를 쓸수도 있음
    // return User.findOne({ where: { id }});
}
