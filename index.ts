import express , {Express, NextFunction, Request,Response} from 'express';
import {graphqlHTTP} from 'express-graphql';
import config from './config';
import cors from 'cors';
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser'

import connection from './database/connection';
import { credentials } from './src/api/middlewares/credentials';

import { schema } from './graphql/typeDefs';
import { resolver } from './graphql/resolvers';

const app : Express = express();

connection();



app.use(credentials);
app.use(cors());
app.use(express.json());
app.use((bodyparser.urlencoded({extended: true})));
app.use(cookieParser());

app.use('/graphql', (req:Request, res:Response) => {

  return graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true,
    context : {req ,res}
  })(req,res)
}
)





app.listen(config.port, ()=>{
    console.log(`Server running at ${config.port}`)
})






// import config from './config';
// import { schema } from './graphql/typeDefs';
// import { resolver } from './graphql/resolvers';
// import { credentials } from './src/api/middlewares/credentials';
// import { corsOptions } from './config/corsOptions';

// 

// 

// //app.use(credentials);
// app.use(cors());
// app.use(express.json());
// app.use((bodyparser.urlencoded({extended: true})));
// //app.use(cookieParser());

// var root = {
//     hello: () => {
//       return 'Hello world!';
//     },
//   };

// app.use(
//     '/graphql',
//     graphqlHTTP({
//         schema : schema,
//         rootValue: root,
//         graphiql : true
//         //context: ({req}) =>({req})
//     })
// )


// app.listen(config.port, ()=>{
//     console.log(`Server running at ${config.port}`)
// })