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

app.get('/d', async (req, res) => {
  const producer = kafka.producer()

  await producer.connect()
  await producer.send({
    topic: 'test-topic',
    messages: [
      { value: 'Hello KafkaJS user! jewel' },
    ],

  })
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

    }
  })
  await producer.disconnect()
  res.status(200).json({
    msg: "great"
  })

})
app.listen(10000, () => {
  console.log("listening on port 10000")
})
