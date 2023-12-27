module.exports = ({ env }) => ({
	// ...
	io: {
		enabled: true,
		config: {
			contentTypes: ['api::article.article'],
			"events":[
             {
               "name": "connection",
               "handler": ({ strapi }, socket) => {
                 strapi.log.info(`[io] new connection with id ${socket.id}`);

                socket.on('chat:connect', (data) =>{
                  console. log('new connection to room ${data.roomID}');

                  socket. join(data. roomID);
                });

                socket.on('chat:sendPrivateMessage', (data) => {
                  console. log('Private message from ${data.message. from} to room ${data.roomID}');

                  socket.to(data.roomID).emit(
                    "chat:onNewPrivateMessage",
                    data. message,
                    );
                });

                 socket.on('disconnect', async (data) =>{
                   console.log(`onDisconnect ${data}`);
                 });
               },
             },
           ]
		},
	},
});
