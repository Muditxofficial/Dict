const { ApolloServer, UserInputError, gql } = require("apollo-server");

const uuid = require("uuid/v1");

let words = [
  {
    title: "Car",
    meaning: "A type of vehicle with four tyres",
    search: "Cold",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431",
  },
  {
    title: "PC",
    meaning: "Personal Computer",
    search: "Warm",
    id: "3d599470-3436-11e9-bc57-8b80ba54c431",
  },
  {
    title: "Java",
    meaning: "Worst language for a computer science student",
    search: "Hot",
    id: "3d599471-3436-11e9-bc57-8b80ba54c431",
  },
];

const typeDefs = gql`
  type Word {
    title: String!
    search: String
    meaning: String!
    id: ID!
  }

  type Query {
    wordCount: Int!
    allWords: [Word!]!
    findWord(title: String!): Word
  }

  type Mutation {
    addWord(title: String!, search: String, meaning: String!): Word
  }
`;

const resolvers = {
  Query: {
    wordCount: () => words.length,
    allWords: () => words,
    findWord: (root, args) => words.find((p) => p.title === args.title),
  },

  Mutation: {
    addWord: (root, args) => {
      if (words.find((p) => p.title === args.title)) {
        throw new UserInputError("title must be unique", {
          invalidArgs: args.title,
        });
      }
      const word = { ...args, id: uuid() };
      words = words.concat(word);
      return word;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
