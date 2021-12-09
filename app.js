const express = require('express');
const app = express();
const OrdersRoutes = require('./routes/orders.routes');
const PORT = process.env.PORT || 3001;
const sequelize = require('./config/db');
const redis = require("redis")

const subscriber = redis.createClient()
const client = redis.createClient()
sequelize.sync();
subscriber.on("message", (channel, message) => {
    if (channel === 'add-order') {
        client.set(`order-${message}`,message, err => {
            console.log('Order Added in redis', `order-${message}`)
        })
    }
    if (channel === 'remove-order'){
        client.del(`order-${message}`,err => {
            console.log('Order removed from redis', `order-${message}`)
        })
    }
})
subscriber.subscribe("add-order")
subscriber.subscribe("remove-order")
app.use(express.json());
app.use('/api/orders', OrdersRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
