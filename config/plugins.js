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

                 socket.on('message:sendPrivateMessage', (data) => {
                     console.log(`onPrivateMessage to ${data.anotherSocketID}`);

                     socket.to(data.anotherSocketID).emit(
                       "chat:onNewPrivateMessage",
                       data.message,
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
