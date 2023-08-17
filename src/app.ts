import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import swaggerUi  from "swagger-ui-express"

import swaggerDocs from './swagger.json';

import { router } from './routes/index'

export const app = express()


// Middleware config
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use(express.json())
app.use(cors());
app.use(logger('dev'))

// ENDPOINT INTEGRATION

app.use('/api/v1', router )