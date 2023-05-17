import SQ, { Sequelize } from 'sequelize';
import { sequelize } from '../db/database.js';
import { User } from './auth.js';
// 테이블 없으면 만들어주는.
const DataTypes = SQ.DataTypes; 

// tweets 테이블 만들기
const Tweet = sequelize.define(
    'tweet',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        // createAt: {
        //     type: DataTypes.DATE,
        //     defaultValue: DataTypes.NOW,
        //     allowNull: true
        // },
        // join하면 미리 코드로 안만들어도 생김.
        // userId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     references: {
        //         model: 'users',
        //         key: 'id'
        //     }
        // }
    },
    // { timestamps: false } --> 이걸 빼야지 createAt, updatedAt이 자동으로 생김.
);

// join하는 방법
Tweet.belongsTo(User);
// 객체를 만들어서 attributes라는 키로 된 배열을 만들고 select~join문을 만들때 보고자하는 컬럼들을 미리 적어서 저장
const INCLUDE_USER = {
    attributes: [
        'id',
        'text',
        'createdAt',
        'userId',
        // user에 들어있는 컬럼(한단계 들여써진 내용)을 앞으로 땡겨 쓸 수 있음
        [Sequelize.col('user.name'), 'name'], //'user.name'컬럼을 name으로 하겠다.  
        [Sequelize.col('user.username'), 'username'],
        [Sequelize.col('user.url'), 'url']
    ],
    // User와 조인된 내용을 포함해서 findAll할 수 있다.
    include: {
        model: User,
        attributes: [],
    }
}

const ORDER_DESC = {
    order: [['createdAt', 'DESC']]
}

// 모든 트윗 데이터 보여주기

export async function getAll(){
    return Tweet.findAll({...INCLUDE_USER, ...ORDER_DESC}).then((data) => {
        console.log(data);
        return data;
    })
}
// getAll 결과(workbench)
// [
//     {
//         "id": 1,
//         "text": "새로 트윗트윗트위함니돠!!!",
//         "createdAt": "2023-05-11T04:33:07.000Z",
//         "userid": 1,
//         "name": " 오렌디",
//         "username": "orange",
//         "url": ""
//     }
// ]

export async function getAllByUsername(username) {
    return Tweet.findAll({
        ...INCLUDE_USER,
        ...ORDER_DESC,
    include: {
        ...INCLUDE_USER.include,
        where: {username}
    }});
}
// workbench 결과
// {
//     "id": 6,
//     "text": "새로 트윗트윗트위함니돠!!!",
//     "createdAt": "2023-05-11T05:12:18.000Z",
//     "userid": 1,
//     "name": " 오렌디",
//     "username": "orange",
//     "url": ""
// },
// {
//     "id": 5,
//     "text": "새로 트윗트윗트위함니돠!!!",
//     "createdAt": "2023-05-11T05:11:06.000Z",
//     "userid": 1,
//     "name": " 오렌디",
//     "username": "orange",
//     "url": ""
// },
// {
//     "id": 4,
//     "text": "새로 트윗트윗트위함니돠!!!",
//     "createdAt": "2023-05-11T04:52:24.000Z",
//     "userid": 1,
//     "name": " 오렌디",
//     "username": "orange",
//     "url": ""
// },...
export async function getById(id) {
    return Tweet.findOne({
        where: { id }, ...INCLUDE_USER});
        //INCLUDE_USER에서 id를 찾아조.
}
// 결과
// {
//     "id": 1,
//     "text": "새로 트윗트윗트위함니돠!!!",
//     "createdAt": "2023-05-11T04:33:07.000Z",
//     "userid": 1,
//     "name": " 오렌디",
//     "username": "orange",
//     "url": ""
// }


//트윗의 id를 뽑아서 확인하고 return 
export async function create(text, userId) {
    return Tweet.create({text, userId}).then((data) => {
        console.log(data);
        return data;
    });
}

export async function update(id, text) {
    return Tweet.findByPk(id, INCLUDE_USER).then((tweet) => {
        tweet.text = text;
        return tweet.save(); //그녀석을 찾아서 save해주는 것.
    })
}

export async function remove(id) {
    return Tweet.findByPk(id).then((tweet) => {
        tweet.destroy();
    });
}