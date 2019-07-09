import 'dotenv/config';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import uuid from 'uuid';

import { Message, User } from './types';

const app = express();

let users: { [id: string]: User } = {
  1: {
    id: '1',
    username: 'Elmer Yu',
  },
  2: {
    id: '2',
    username: 'Dave Davids',
  },
};

let messages: { [id: string]: Message } = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1',
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2',
  },
};

const schema = gql`
  type Query {
    me: User
    users: [User!]
    user(id: ID!): User

    messages: [Message!]!
    message(id: ID!): Message!
  }
  type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  type User {
    id: ID!
    username: String!
    messages: [Message!]
  }
  type Message {
    id: ID!
    text: String!
    user: User!
  }
`;

const resolvers = {
  Query: {
    me: (parent, args, context): User => context.me,
    users: (): User[] => {
      return Object.values(users);
    },
    user: (parent, {id}): User => users[id],

    messages: (): Message[] => Object.values(messages),
    message: (parent, {id}): Message => messages[id],
  },
  Mutation: {
    createMessage: (parent, args, context): Message => {
      const message = {
        id: uuid(),
        text: args.text,
        userId: context.me.id,
      };
      messages[message.id] = message;
      return message;
    },
    deleteMessage: (parent, args): boolean => {
      const {[args.id]: message, ...otherMessages} = messages;
      if (message) {
        messages = otherMessages;
        return true;
      }
      return false;
    },
  },

  User: {
    username: (parent): string => parent.username,
    messages: (parent): Message[] => {
      return Object.values(messages).filter(
        (message): boolean => message.userId === parent.id
      );
    },
  },
  Message: {
    user: (parent): User => users[parent.userId],
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1],
  },
});

server.applyMiddleware({app, path: '/graphql', cors: true});

const {PORT: port = 8000} = process.env;

app.listen({port}, (): void => {
  console.log(`Apollo Server on http://localhost:${port}/graphql`);
});
