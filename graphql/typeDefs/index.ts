import {buildSchema, GraphQLID, GraphQLObjectType, GraphQLSchema, GraphQLString} from 'graphql'


export const schema = buildSchema(`
    type User {
        id: ID!
        name: String!
        email: String!
        token: String
    }

    type AuthPayload {
        name: String
        accessToken: String
        id: ID
    }

    type Mutation {
        register(name:String!,email:String!,password:String!) : AuthPayload
        login(email:String!,password:String!) : AuthPayload
        logout : String
    }

    type PrivatePayload {
        name: String!
        id: String!
    }

    type Query {
        refreshtoken : AuthPayload
        privateroute : PrivatePayload!
    }



`);