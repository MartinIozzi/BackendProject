import winston, { format } from 'winston';
import config from '../config/config.js';
import levelOptions from '../utils/logger.js';

const colors = {
    fatal: 'black',
    error: 'red',
    warning: 'yellow',
    info: 'blue',
    http: 'green',
    debug: 'white',
}

winston.addColors(colors)

let logger;

if (config.NODE_ENV === "development") {
    try {
        logger = winston.createLogger({
            levels: levelOptions.levels,
            transports: [
                new winston.transports.Console({ level: 'debug', 
                format: format.combine(
                    format.colorize({ all: false }),
                    format.simple()
                ) 
            })]
        }); 
    } catch (error) {
        logger.error('error en el entorno de producción')
    }
} else {
    try {
        logger = winston.createLogger({
            levels: levelOptions.levels,
            transports: [
                new winston.transports.Console({ level: 'info',
            format: format.combine(
                format.colorize({ all: false }),
                format.simple()
            ) 
        }),
            new winston.transports.File({ 
                filename: './src/errors.log',
                level: 'error', 
                format: winston.format.simple()
            })]
        });
    } catch (error) {
        logger.error('error en el entorno de desarrollo')
    }
}

export const loggerMiddleware = (req, res, next) => {
    try {
        req.logger = logger;
        logger.http(`${req.method} - ${req.url} - [${req.ip}] - ${req.get('user-agent')} - ${new Date().toISOString()}`);
        next();
    } catch (error) {
        logger.error('problemas en el loggerMiddleware')
    }

}

export default logger;