import express from "express";

import mongoose from "mongoose";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "testing-kafka",
  brokers: ["localhost:9092"]

})

const app = express()

mongoose.connect("mongodb://localhost:27017/blog-app-testing-1")

app.use(express.json())
app.get('/produce', async (req, res) => {
  // const { topic, message } = req.body;

  try {
    const producer = kafka.producer()
    await producer.connect();
    await producer.send({
      topic: 'test-topic',
      messages: [{ value: JSON.stringify("jewel great") }],
    });
    await producer.disconnect();

    res.status(200).send(`Message sent to topic `);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Failed to send message');
  }
});
app.get('/d', async (req, res) => {
  const consumer2 = kafka.consumer({ groupId: "test-group-1" })
  await consumer2.connect()
  await consumer2.subscribe({ topic: 'test-topic' })
  await consumer2.run({
    eachMessage: async ({ topic, partition, message }) => {

      if (message) {
        console.log({
          value: message.value.toString()
        })

      }
      return res.statusCode(404).json({
        msg: "not found "
      })

    }
  })
  res.status(200).json({
    msg: "great"
  })

})
app.listen(10000, () => {
  console.log("listening on port 10000")
})
