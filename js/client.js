var socket = io();
//var $user_name_form = $("#user_name_form");
//var $user_name = $("#user_name");
$(function(){ 
  $("#top-form").submit(function(e){
    e.preventDefault();
    $("#top-form").hide();
  });
  $("#bottom-form").submit(function(e){
    //ngăn page reloading mỗi khi thực hiện function
    e.preventDefault();
    //emit data thẻ textarea id là message, user name
    socket.emit("chat message", $("#user_name").val(), $("#message").val());
    //tạo thẻ li để hiển thị nội dung chat user nhập
    let li = document.createElement("li");
    //append giá trị của #message vào thẻ li vừa tạo
    messages.appendChild(li).append($("#message").val());
    //người gửi thì ko cần append by.. vào sau thẻ span nữa
    let span = document.createElement("span");
    messages.appendChild(span);
    //xóa trắng textarea
    $("#message").val("");
    return true;
  });
  socket.on("chat message", function(user_name,msg){
    $("#messages").append($("<li>").text(msg));
  });
  //hiển thị nd chat ng` nhận nhận của ng gửi
  socket.on("received",function(data){
    let li = document.createElement("li");
    let span = document.createElement("span");
    var messages = document.getElementById("messages");
    messages.appendChild(li).append(data.message);
    messages.appendChild(span).append("by "+data.name);
  });
});
//lấy mọi messages từ collection, link từ phía router bên server.js
$(function(){
  function test(){
    fetch("/chats").then(function(data){
      return data.json();
    }).then(function(json){
      json.map(function(data){
        let li = document.createElement("li");
        let messages = document.getElementById("messages")
        let span = document.createElement("span");
        messages.appendChild(li).append(data.message);
        messages.appendChild(span).append("by "+data.name);
      })
    });
  }
  test();
})();