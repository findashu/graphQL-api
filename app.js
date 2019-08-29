const express = require('express');
const graphQlHttp = require('express-graphql');
const mongoose = require('mongoose');
const { buildSchema } = require('graphql');

const Event = require('./models/event');

const app = express();

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
           return Event.find().then(events => {
                
                return events.map(event => {
                    return { ...event._doc }
                })
            }).catch(err => console.log(err));  
        },
        createEvent: (args) => {
            // const event = {
            //     _id : Math.random().toString(),
            //     title: args.eventInput.title,
            //     description: args.eventInput.description,
            //     price: +args.eventInput.price,
            //     date: new Date().toISOString()
            // }
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            });

            return event.save().then(dt => {
                console.log(dt)
                return { ...dt._doc };
            }).catch(err => {
                console.log(err)
                throw err;
            });            
        }
    },
    graphiql: true
}));

mongoose.connect('mongodb://localhost:27017/graphql', {useNewUrlParser:true})
    .then(() => {
        app.listen(3000, () => console.log('App up n working on port 3000'))
    })
    .catch(err => console.log('DB Connection Error',err))