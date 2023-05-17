
import * as tweetRepository from '../data/tweet.js'
import { getSocketIO } from '../connection/socket.js';

export async function getTweets(req, res) {
    const username = req.query.username; // 값을 받아와서 저장
    const data = await (username
    ? tweetRepository.getAllByUsername(username): tweetRepository.getAll());
    res.status(200).json(data)
}

export async function getTweet(req, res) {
    const id = req.params.id;
    const tweet = await tweetRepository.getById(id)
    if(tweet) {
        res.status(200).json(tweet);
    }else{
        res.status(404).json({message: `Tweet id(${id}) not found`})
    }
}
// body에서 text만 가져오면 됨, create메서드에 text와 req.userId를 넣음.
export async function createTweet(req, res, next) {
    const { text } = req.body;
    //body에서 입력받은 값을 불러와서 변수에 넣겠다.
    const tweet = await tweetRepository.create(text, req.userId)
    // 배열을 만들고 복사로 추가 (메모리에있는 객체를 복사해오고, tweet을 저장해놓고 가리키게 함, 새로운걸 하나 만들어서 옮기는 것)
    res.status(201).json(tweet);
    getSocketIO().emit('tweets', tweet);
}

// 수정 전
// export async function updateTweet(req, res, next) {
//     const id = req.params.id; // 수정할 id 번호를 저장
//     const text = req.body.text
//     const tweet = await tweetRepository.update(id, text)
//     if(tweet){
//         res.status(201).json(tweet)
//     }else{
//         res.status(404).json({message: `Tweet id(${id}) not found`})
//     }
// }

export async function updateTweet(req, res, next) {
    const id = req.params.id; // 수정할 id 번호를 저장
    const text = req.body.text;
    const tweet = await tweetRepository.getById(id) // id를 받아와서 tweet에 저장
    if(!tweet){
        res.status(404).json({message: `Tweet id(${id}) not found`}) //id가 없으면 없다고 return
    }
    console.log(tweet.userId+"트윗");
    console.log(tweet.id+"트윗");
    if(tweet.userId !== req.userId){
        return res.sendStatus(403) // 작성한 userID와 요청(접속)한 userId가 같지않으면 수정하지 못하도록.
    }
    // 수정할 수 있는사람은 아래로 넘어감
    const updated = await tweetRepository.update(id, text);
    res.status(200).json(updated);
}

export async function deleteTweet(req, res, next) {
    const id = req.params.id;
    const tweet = await tweetRepository.getById(id);
    if(!tweet){
        res.status(404).json({message: `Tweet id(${id}) not found`}) //id가 없으면 없다고 return
    }
    if(tweet.userId !== req.userId){
        return res.sendStatus(403) // 작성한 userID와 요청(접속)한 userId가 같지않으면 수정하지 못하도록.
    }
    await tweetRepository.remove(id);
    res.sendStatus(204); // 정상적으로 되었다면 코드번호를 204로 보내겠다.
}