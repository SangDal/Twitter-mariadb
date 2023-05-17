import express from 'express'
// import * as tweetController from '../controller/tweet.js'
import { body } from 'express-validator'
import { validate } from "../middleware/validator.js";
import * as authController from '../controller/auth.js';
import { isAuth } from '../middleware/auth.js'

const router = express.Router();

const validateCredential =[
    body('username')
        .trim()
        .notEmpty()
        .isLength({ min:4 })
        .withMessage('아이디는 최소 4자 이상 입력하세요!'),
    body('password')
        .trim()
        .isLength({ min:4 })
        .withMessage('비밀번호는 최소 4자 이상 입력하세요!'),
    validate
]

const validateSignup = [
    ...validateCredential,
    body('name')
        .notEmpty()
        .withMessage('이름은 꼭 입력하세요'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('email 형식에 맞게 쓰세요!'),
    body('url')
        .isURL()
        .withMessage('URL 형식에 맞게 쓰세요!')
        .optional({ nullable: true, checkFalsy: true}),
        // nullable: true는 데이터 안넣어도 상관없다는 뜻
        // checkFalsy: true: true false로 판단되는 값들을 true false로 보여주는 것. 
    validate
]
// 왜 하나로 쓰지 못할까? 객체로 다 받아와서 유효성 검사 함수를 적용하는데, 자바스크립트를 생각했을 때, 로그인 데이터를 가져왔는데 거기에 없는 객체에 대한 검사를 하게되서 오류가 난다.

router.post('/signup', validateSignup, authController.signup)
router.post('/login', validateCredential, authController.login)
router.get('/me', isAuth, authController.me)

export default router;

// const validateTweet = [
//     body('name')
//         .notEmpty()
//         .withMessage('name은 빈칸 또는 공백을 포함할 수 없습니다!!'),
//     body('email')
//         .trim()
//         .isEmail()
//         .normalizeEmail()
//         .withMessage('email 형식에 맞게 쓰세요!'),
//     body('url')
//         .trim()
//         .isURL()
//         .withMessage('URL 형식에 맞게 쓰세요!'),
//     body('username')
//         .notEmpty()
//         .withMessage('username은 빈칸 또는 공백을 포함할 수 없습니다!!'),
//     body('password')
//         .notEmpty()
//         .isLength({ min:4 })
//         .withMessage('password는 공백없이 최소 4자 이상 입력하세요!'),
//     validate
// ]



