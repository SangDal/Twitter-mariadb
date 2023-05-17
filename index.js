import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import tweetsRouter from './router/tweets.js'
import authRouter from './router/auth.js'
import { config } from './config.js';
import { initSocket } from './connection/socket.js'
import { sequelize } from './db/database.js'
// import { db } from './db/database.js'

const app = express()
const corsOption = {
    origin: config.cors.allowedOrigin,
    optionsSuccessStatus: 200
};

app.use(express.json())
app.use(cors(corsOption))
app.use(morgan('tiny'))  // 사용자들이 접속하면 log를 콘솔에 찍음(HTTP 요청 로깅을 간단하게 처리하고자 할 때 사용)

// router
// 갈 곳이 있는지 라우터가 확인하고 보냄
app.use('/tweets', tweetsRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
    res.sendStatus(404);
})
// 서버에러
app.use((error, req, res, next) => {
    console.log(error)
    res.sendStatus(500)
});

// db.getConnection().then((connection) => console.log(connection))
// 연결확인을 위한 출력하는 부분은 주석처리하고, 서버를 sequelize 안으로 이동
sequelize.sync().then(() => {
    console.log(`서버가 시작 되었음. ${new Date()}`);
    const server = app.listen(config.host.port);
    initSocket(server);
})




//소켓은 이벤트 기반으로 움직인다. 사용자가 이벤트를 발생시키면 그 이벤트에 의해 처리가 됨
// .on()은 어떤 이벤트가 발생하면 비동기처리 함수를 작동시킨다. 'connection'은 사용자가 연결될때 함수를 처리.
// .emit()은 소켓에 접속된 사용자에게 이벤트를 발생시켜줌
// socketIO.on('connection', ()=>{
//     console.log('클라이언트 연결 성공!');
//     socketIO.emit('dwitter', 'Hello 🍊');
// }) 

// setInterval(() => {
//     socketIO.emit('dwitter', 'Hello ❤❤🧡🧡')
// }, 1000)