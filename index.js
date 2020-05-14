import { ApolloServer } from "apollo-server";
import { schema } from "./src/schema";
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// connection to mongoose
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true });

//Pass the schema to ApolloServer
const server = new ApolloServer({ schema })

//Launch the server
server.listen().then(({ url }) => {
    console.log(`==> 🚀  Server ready at ${url} `);
});