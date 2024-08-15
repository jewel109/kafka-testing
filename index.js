import express from "express";

import mongoose from "mongoose";
import { Client } from "@elastic/elasticsearch"


const client = new Client({
  node: "http://localhost:9200"
})

// console.log(client)
const app = express()

// mongoose.connect("mongodb://localhost:27017/blog-app-testing-1")

async function elasticsearchConn() {
  // await client.indices.delete({ index: 'my_index' })
  await client.index({
    index: 'my_index',
    id: 'my_document_id',
    document: {
      foo: 'foo',
      bar: 'bar',
    },
  })

  const data = await client.get({
    index: 'my_index',
    id: 'my_document_id',
  })

  // console.log(data)
  const s = await client.search({
    index: "my_index",
    query: {
      match: {
        bar: 'bar'
      }
    }
  })

  console.log(s.hits.hits)

}

elasticsearchConn()
async function run() {
  // Let's start by indexing some data
  await client.index({
    index: 'game-of-thrones',
    document: {
      character: 'Ned Stark',
      quote: 'Winter is coming.'
    }
  })

  await client.index({
    index: 'game-of-thrones',
    document: {
      character: 'Daenerys Targaryen',
      quote: 'I am the blood of the dragon.'
    }
  })

  await client.index({
    index: 'game-of-thrones',
    // here we are forcing an index refresh,
    // otherwise we will not get any result
    // in the consequent search
    refresh: true,
    document: {
      character: 'Tyrion Lannister',
      quote: 'A mind needs books like a sword needs a whetstone.'
    }
  })

  // Let's search!
  const result = await client.search({
    index: 'game-of-thrones',
    query: {
      match: {
        quote: 'is'
      }
    }
  })

  console.log(result.hits.hits)
}

run().catch(console.log)
app.use(express.json())

app.get('/', async (req, res) => {
  // const { topic, message } = req.body;

  try {

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Failed to send message');
  }
});

app.listen(10000, () => {
  console.log("listening on port 10000")
})
