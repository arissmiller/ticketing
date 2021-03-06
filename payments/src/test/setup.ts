import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {app} from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

let mongo: any;

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?:string): string[];
    }
  }
}

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_51HEmKLA2hd06hjrnEsyj3me1LGWUYmcBTUCamluVPxh4J7VEgosWLFH2CjIXgI5PbrHmd8idKTEmTxjwW6uID3rm00Nl1LYi3t';

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for(let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  //Build JWT payload {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }
  //Create JWT

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Build session Object.
  const session = {jwt: token};

  const sessionJSON = JSON.stringify(session);
  //Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //return a string thats the cookie with encoded data
  return [`express:sess=${base64}`];
}
