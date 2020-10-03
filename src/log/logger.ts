import winston from 'winston';

const format = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(
        info => `${info.timestamp as string} ${info.level}: ${info.message}`
    )
);

export const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            format: format
        }),
    ],
});
