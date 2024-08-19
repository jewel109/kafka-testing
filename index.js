import express from "express";

app.use(express.json())


app.listen(10000, () => {
  console.log("listening on port 10000")
})
