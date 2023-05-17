import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userRepository from '../data/auth.js';
import { config } from '../config.js'


// 핸들러들
export async function signup(req, res) {
    // req.body 데이터를 받아 회원가입 시키는 함수
    // 해당 아이디가 존재한다면 "409"를 리턴
    // userRepository에 데이터를 저장(비밀번호는 bcrypt를 사용하여 저장)
    // JWT를 이용하여 사용자에게 json으로 전달
    const { username, password, name, email, url } = req.body;
    const found = await userRepository.findByUsername(username);

    if(found){
        return res.status(409).json({ message: `${username}은 이미 가입되었습니다!`})
    }
    const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds)
    // hashSync를 왜 안쓰지? await면 비동기니까 Sync를 안쓴것.
    const userId = await userRepository.createUser({
        username,
        password: hashed,
        name,
        email,
        url
    })
    const token = createJwtToken(userId)
    console.log(token)
    res.status(201).json({token, username});
}

export async function login(req, res) {
    // req.body 데이터를 받아 해당 아이디로 로그인 여부를 판단
    // 해당 아이디가 존재하지 않으면 "401"을 리턴
    // bcrypt를 이용하여 비밀번호까지 모두 맞다면 해당 정보를 JWT를 이용하여 사용자에게 json으로 전달
    const { username, password } = req.body;
    const user = await userRepository.findByUsername(username);
    if(!user){
        return res.status(401).json({ message: '아이디가 존재하지 않습니다!'});
    }
    const isValidpassword = await bcrypt.compare(password, user.password)
    if(!isValidpassword){
        return res.status(401).json({ message: '아이디 또는 비밀번호를 확인하세요!'});
    }
    const token = createJwtToken(user.id)
    res.status(200).json({token, username});
    
}

export async function me(req, res, next) {
    const user = await userRepository.findById(req.userId);
    if(!user){
        return res.status(404).json({ message: '사용자가 존재하지 않습니다!'});
    };
    res.status(200).json({ token: req.token, username: user.username})
}

function createJwtToken(id) {
    return jwt.sign({id}, config.jwt.secretKey, {expiresIn: config.jwt.expiresInSec})
}