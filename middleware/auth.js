import jwt from 'jsonwebtoken'
import * as userRepository from '../data/auth.js'
import { config } from '../config.js';

const AUTH_ERROR = { message: '인증 에러!'};

export const isAuth = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    console.log('----------------')
    console.log(authHeader)

    if(!(authHeader && authHeader.startsWith('Bearer '))) {
        return res.status(401).json(AUTH_ERROR);
    }


    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        config.jwt.secretKey,
        async (error, decoded) => {
            if(error){
                return res.status(401).json({ message: '인증 에러!1234'});
            }
            const user = await userRepository.findById(decoded.id);
            console.log("---------------------");
            console.log(user);
            if(!user){
                return res.status(401).json(AUTH_ERROR);
            }
            req.userId = user.id;
            req.token = token;
            next(); // 이후 위에서 설정한 isAuth
        }
    )
}