import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "testing-kafka",
  brokers: ["localhost:9092"]

})


export const kProducer = async () => {

  const producer = kafka.producer()

  await producer.connect()
  await producer.send({
    topic: 'test-topic',
    messages: [
      { value: 'Hello KafkaJS user!' },
    ],
  })

  await producer.disconnect()
}


export const kConsumer = async () => {

  const consumer = kafka.consumer({ groupId: 'test-group' })


  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(), offset: message.offset
      })
      const producer = kafka.producer()

      await producer.connect()

      await producer.send({

        topic: "new-topic",
        messages: [
          { value: JSON.stringify('new topic is running') }
        ]
      })
    },
  })

  const anotherConsumer = kafka.consumer({ groupId: "test-group-3" })
  await anotherConsumer.connect()
  await anotherConsumer.subscribe({ topic: 'new-topic' })

  await anotherConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString()
      })
    }
  })

}

