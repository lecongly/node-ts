import ErrorMiddleware from '@/middleware/error.middleware';
import db from '@/utils/databases/init.mongodb';
import Controller from '@/utils/interfaces/controller.interface';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';

class App {
    public express: Application;
    public port: number;
    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;
        this.initialiseDatabaseConnection();
        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandling();
    }
    private initialiseMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
        this.express.use(cookieParser());
        this.express.use(
            fileUpload({
                useTempFiles: true,
            })
        );
    }
    private initialiseControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api', controller.router);
        });
    }
    private initialiseErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }
    private initialiseDatabaseConnection(): void {
        db;
    }
    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;
