/* eslint-env node, mocha */
import 'dotenv/config';
import { expect } from 'chai';
import { describe } from "mocha";
import axios from 'axios';

const { PORT: port = 8000 } = process.env;
const API_URL = `http://localhost:${port}/graphql`;


describe('users', () => {
  describe('user(id: String!): User', () => {
    it('returns a user when user can be found', async () => {
      const expectedResult = {
        data: {
          user: {
            id: '1',
            username: 'Elmer Yu'
          },
        },
      };

      const result = await axios.post(API_URL, {
        query: `
          query ($id: ID!) {
            user(id: $id) {
              id
              username
            }
          }
        `,
        variables: { id: '1' }
      });

      expect(result.data).to.eql(expectedResult);
    });
  });
});
