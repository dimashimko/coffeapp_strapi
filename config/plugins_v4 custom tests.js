let connectedUsers = [];

//Example
// [
//   {
//     userID: 1,
//     socket: SocketOBJ(),
//   },
//   {
//     ...
//   }
// ]

module.exports = ({ env }) => ({
  "io": {
    "enabled": true,
    "config": {
      "IOServerOptions" :{
        "cors": { "origin": "http://localhost:1337", "methods": ["GET", "POST"] },
      },
			contentTypes: ['api::article.article'],
//      "contentTypes": {
//        "message": "*",
//        "chat":["create"]
//      },
      "events":[
        {
          "name": "connection",
          "handler": ({ strapi }, socket) => {
            strapi.log.info(`[io] new connection with id ${socket.id}`);

            socket.on('chat:connect', async (data)  =>{
              let {userID} = data;

            console.log(`userID: ${userID}`);

              //Сохраняем сессию пользователя для возможности в дальнейшем подключать его к комнатам зная его userID
              connectedUsers.push({
                'userID': userID,
                'socket': socket,
              });

            console.log(`connectedUsers length: ${connectedUsers.length}`);
            connectedUsers.forEach(user => {
                console.log(`userID: ${user.userID}, socket: ${user.socket}`);
              });
            console.log(``);

             try {
              //Получаем список чатов к котороых есть наш пользователь с userID
              let allChat = await strapi.db.query("api::chat.chat");
              console.log(`allChat: ${allChat}`);
              let chats = await strapi.db.query("api::chat.chat").findMany({
                "where": {
                  "chat_users": {
                    "id": {
                      "$eqi": userID,
                    }
                  }
                },
              });
            console.log(`chats length: ${chats.length}`);
            console.log(`chats: ${chats}`);

              //Перебираем все чаты в которых есть наш пользователь и подключаем его к чат комнатам в которых он есть
              chats.forEach(chat => {
                console.log(`chat: ${chat}`);
                console.log(`Connect user to CHAT_${chat.id}`);

                socket.join(`CHAT_${chat.id}`);
              });


             } catch(error) {
              console.log(`[io] chat:connect error: ${error}`);
             }
            });

            socket.on('chat:sendPrivateMessage', (data) => {
                let {chatID} = data;

                console.log(`Private message from ${data.message.from} to room CHAT_${chatID}`);

                //Send message to room
                socket.to(`CHAT_${chatID}`).emit(
                  "chat:onNewPrivateMessage",
                  data.message,
                );
            });

            socket.on('chat:onNewChatCreated', (data) => {
              console.log(`onNewChatCreated: ${data}`);

              let {chatID, companionID} = data;

              //Подключаем основного пользователя(нас) к комнате
              socket.join(`CHAT_${chatID}`);

              //Находим сокет собеседника и подключаем его к комнте нового чата
              let id = connectedUsers.findIndex((obj) => obj.userID == companionID);
              connectedUsers[id].socket.join(`CHAT_${chatID}`);

              //Информируем собеседника о том, что у него появился новый чат
              socket.to(connectedUsers[id].socket.id).emit('chat:newChat');
            });

            socket.on('disconnect', async (data) =>{

              //Удаляем пользователя из стека активных пользователей
              let id = connectedUsers.findIndex((obj) => obj.socketID == socket.id);
              connectedUsers.splice(id, 1);
              //

              console.log(`onDisconnect ${socket.id}`);
              socket.emit('user:userDisconnect');
            });

            socket.on('customEvent', async (data) =>{
              console.log(`customEvent ${data} `);
              socket.emit('customEvent');
            });


            socket.on('locationData', async (data) =>{
              let {latitude, longitude} = data;

              console.log(`latitude ${latitude} `);
              console.log(`longitude ${longitude} `);
//              socket.emit('locationData', data);
            });


          },
        },
      ]
    },
  },
});
