import { Kafka } from "kafkajs";


const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});
const producer = kafka.producer();

const initKafka = async () => {
  try {
    await producer.connect();
    console.log("kafka", "kafka connecvted...");
    // logger.info("Kafka connected"); // Log success message
  } catch (error) {
    console.log("kafka", error);
    // logger.error("Kafka connection error:", error); // Log error with descriptive message
  }
};

initKafka().catch((err) =>{ 
    // logger.error("Kafka initialization error:", err)
    console.log("kafka:",err);
});


export {
    kafka,
    producer,
    initKafka
}