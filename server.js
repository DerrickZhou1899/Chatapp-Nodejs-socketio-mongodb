const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = 8000;

const mongoose = require("mongoose");
const mongourl = "mongodb+srv://chaunhatdang:cnd1899@cndpersonal.cawgw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const connectdb = mongoose.connect(mongourl,{
    useNewUrlParser: true
});
const Chats = require("./models/ChatSchema");

//dùng body parser để đẩy dữ liệu lên html
const  bodyParser  = require("body-parser");

//lấy đường dẫn html
//tham khảo tại https://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.json());

//tạo routing phản hồi các yêu cầu của user
//tham khảo tại https://expressjs.com/en/guide/routing.html
//req đại diện cho http request, có các thuộc tính cho request query string, parameters, body, http headers
//res đại diện cho http reponse app express send mỗi khi app nhận http request, trong trường hợp này là sendfile index.html mỗi khi có 1 request tới route '/'
//app nhiều page có thể đổi thành route '/home', '/about' rồi res.send('home page/about page')
//tham khảo tại https://www.freecodecamp.org/news/express-explained-with-examples-installation-routing-middleware-and-more/
app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});
//làm theo https://expressjs.com/en/starter/static-files.html nhưng ko được
//phải có get style.css thì html mới nhận dc folder css, ko thì phải để css cùng file html
app.get('/css/style.css',function(req,res){
    res.sendFile(__dirname+'/css/style.css');
});
app.get('/js/client.js',function(req,res){
    res.sendFile(__dirname+'/js/client.js');
})

const router = express.Router();
//có thể phân router ra 1 file js riêng nếu nhiều router
//tham khảo từ https://dev.to/rexeze/how-to-build-a-real-time-chat-app-with-nodejs-socketio-and-mongodb-2kho
//router.route("/").get(...) y/c middleware function còn router.get("/",func) y/c object
app.use("/chats", router.get("/", function(req,res,next){
    res.setHeader("Content-Type", "application/json");
        connectdb.then(function(db){
            //tìm {} = tất cả trong collection
            Chats.find({}).then(function(chat){
            //gửi phản hồi với nội dung là tham số dc chuyển thành chuỗi json = phương thức json.stringify()
            res.json(chat);
        });
    });
}));

//connect socket
io.on('connection',function (socket){
    console.log("user connected");
    socket.on('disconnect',function(){
        console.log('user disconnected');
    })
    //xử lý out message cho client
    socket.on("chat message",function(user_name,msg){
        //console.log('message: '+ msg);
        //user name = "" cho anonymous
        if(user_name == ""){
            user_name = "Anonymous";
            socket.broadcast.emit("received",{name: user_name,message :msg});
            let chatMessage = new Chats({name:user_name,message: msg});
            chatMessage.save();
        }
        else{
            socket.broadcast.emit("received",{name: user_name,message :msg});
            let chatMessage = new Chats({name:user_name,message: msg});
            chatMessage.save();
        }
    });
});

http.listen(port,function(){
    try{
        console.log("Listening on port:%s... ",http.address().port);
    }catch(err){
        console.log(err);
    }
});