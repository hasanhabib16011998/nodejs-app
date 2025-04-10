import { createLogger, format, transports } from 'winston';
import { ConsoleTransportInstance, FileTransportInstance } from 'winston/lib/winston/transports';
import util from 'util';
import 'winston-mongodb';
import config from '../config/config';
import { EApplicationEnvironment } from '../constant/application';
import path from 'path';
import * as sourceMapSupport from 'source-map-support';
import { red, blue, yellow, green, magenta } from 'colorette';
import { MongoDBTransportInstance } from 'winston-mongodb';

//linking trace support
sourceMapSupport.install();

const colorizedLabels = (level: string) => {
    switch(level) {
        case 'ERROR':
            return red(level);
        case 'INFO':
            return blue(level);
        case 'WARN':
            return yellow(level);
        default:
            return level;
    }
}
const consoleLogFormat = format.printf((info)=>{
    const { level, message, timestamp, meta = {} } = info
    const customLevel = colorizedLabels(level.toUpperCase())
    const customTimeStamp = green(timestamp as string)
    const customMessage = message
    const customMeta = util.inspect(meta, {
        showHidden: false,
        depth: null,
        colors: true
    })

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const customLog = `${customLevel} [${customTimeStamp}] ${customMessage}\n${magenta('META')} ${customMeta}`

    return customLog
})
const consoleTransport = (): Array<ConsoleTransportInstance> => {
    //production env check
    if(config.ENV === EApplicationEnvironment.DEVELOPMENT) {
    return [
        new transports.Console({
            level: 'info',
            format: format.combine(format.timestamp(), consoleLogFormat)
        })
    ];
    }

    return []
};

const fileLogFormat = format.printf((info)=>{
    const { level, message, timestamp, meta = {} } = info
    const logMeta: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(meta as Record<string, unknown>)){
        if(value instanceof Error){
            logMeta[key] = {
                name: value.name,
                message: value.message,
                trace: value.stack || ''
            }
        } else {
            logMeta[key] = value
        }
    }

    const logData = {
        level: level.toUpperCase(),
        message,
        timestamp,
        meta: logMeta
    }

    return JSON.stringify(logData, null, 4)
})

const fileTransport = (): Array<FileTransportInstance> => {
    //production env check
    if(config.ENV === EApplicationEnvironment.PRODUCTION) {
    return [
        new transports.File({
            filename: path.join(__dirname,'../','../','logs',`${config.ENV}.log`),
            level: 'info',
            format: format.combine(format.timestamp(), fileLogFormat)
        })
    ];
    }

    return []
};

const mongoDBTransport = (): Array<MongoDBTransportInstance> => {
    return [
        new transports.MongoDB({
            level:'info',
            db: config.DATABASE_URL as string,
            metaKey: 'meta',
            expireAfterSeconds: 3600*24*30,
            options: {
                useUnifiedTopology: true
            },
            collection: 'application-logs'

        })
    ];
}
export default createLogger({
    defaultMeta: {
        meta: {}
    },
    transports:[
        ...fileTransport(),
        ...consoleTransport(),
        ...mongoDBTransport()
    ]
})