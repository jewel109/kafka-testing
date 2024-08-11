import { Kafka } from "kafkajs";
import { kConsumer } from "./kafka.js";
const kafka = new Kafka({
  clientId: "testing-kafka",
  brokers: ["localhost:9092"]

})


const admin = kafka.admin();

const run = async () => {
  await admin.connect();


  await admin.createTopics({
    topics: [
      { topic: 'test-topic', numPartitions: 2 },
      { topic: 'new-topic', numPartitions: 2 }
    ]
  })

  await admin.disconnect();
};

run().catch((e) => console.log(e));
kConsumer()
