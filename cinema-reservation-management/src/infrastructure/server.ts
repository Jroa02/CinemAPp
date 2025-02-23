import express, { Request, Response, NextFunction } from 'express';
import { setMoviesRoutes } from '../interfaces/http/routes/moviesRoutes';
import { setRoomsRoutes } from '../interfaces/http/routes/roomsRouter';
import { setSchedulesRoutes } from '../interfaces/http/routes/schedulesRouter';
import { setSeatsRoutes } from '../interfaces/http/routes/seatsRouter';
import { setReservationsRoutes } from '../interfaces/http/routes/reservationsRouter';
import { setReservedSeatsRoutes } from '../interfaces/http/routes/reservedSeatsRouter';
import { setNotificationsRouter } from '../interfaces/http/routes/notificationsRoutes';
import { createConnection } from './database/connection';
import * as OpenApiValidator from 'express-openapi-validator';
import * as path from 'path';
import dotenv  from 'dotenv';
import cors from "cors";


const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;


// Set up OpenAPI Validator
const apiSpec = path.join(__dirname, './../../static/Cinema.yml');
app.use(
  OpenApiValidator.middleware({
    apiSpec,
    validateRequests: true,
    validateResponses: true,
  })
);

createConnection();
// routes
setMoviesRoutes(app);
setRoomsRoutes(app);
setSchedulesRoutes(app);
setSeatsRoutes(app);
setReservationsRoutes(app);
setReservedSeatsRoutes(app);
setNotificationsRouter(app);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`ERROR: ${err}`);
  res.status(err.status || 500).json({
    status: err.status || 500,
    error: err.error || 'Internal Server Error',
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 🚀`);
});