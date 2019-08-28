const express = require('express');
const graphQlHttp = require('express-graphql');

const { buildSchema } = require('graphql');

const app = express();

const events = []
app.use(express.json());

app.use('/graphql', graphQlHttp({
    schema: buildSchema(`
        type Event {
            _id : ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput : EventInput) : Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events : () => {
            return events;  
        },
        createEvent: (args) => {
            const event = {
                _id : Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date().toISOString()
            }
            events.push(event)
            return event;
        }
    },
    graphiql: true
}))

app.listen(3000, () => console.log('App up n working on port 3000'))