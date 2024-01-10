module.exports = ({ env }) => ({
  // ...
  io: {
    enabled: true,
    config: {
      contentTypes: ['api::article.article'],
      "events": [
        {
          "name": "connection",
          "handler": ({ strapi }, socket) => {
            strapi.log.info(`[io] new connection with id ${socket.id}`);

            socket.on('room:connect', (data) => {
              console.log(`new connection to room ${data.roomID}`);

              socket.join(data.roomID);
            });

            socket.on('room:leave', (data) => {
              console.log(`leaving room ${data.roomID}`);

              socket.leave(data.roomID);
            });

            socket.on('locationData', (data) => {
              console.log(`Private message ${data['latitude']}, ${data['longitude']} ${data['roomID']}, ${data['courierId']}`);

              socket.to(data.roomID).emit(
                "onLocationData",
                data,
              );
            });

            socket.on('changeStatus', async (data) => {
              console.log(`ChangeStatus ${data['deliveryModelID']}, ${data['orderStatus']}`);

              
              // socket.to(data.roomID).emit(
              //   "onLocationData",
              //   data,
              // );

               try {
                let deliverys = await strapi.db.query("api::delivery.delivery").findMany();

                deliverys.forEach(delivery => {
                  console.log(`Delivery_ID: ${delivery.id}`);
                  if(delivery.id == data['deliveryModelID']){
                    console.log(`Delivery_ID: ${delivery.id}`);
                    delivery
                  }
                });
               } catch(error) {
                console.log(`[io] chat:connect error: ${error}`);
               }

            });

            socket.on('disconnect', async (data) => {
              console.log(`onDisconnect ${data}`);
            });
          },
        },
      ]
    },
  },
});
