import { createLogger, format, transports } from 'winston';
import { ConsoleTransportInstance, FileTransportInstance } from 'winston/lib/winston/transports';
import util from 'util';
import config from '../config/config';
import { EApplicationEnvironment } from '../constant/application';
import path from 'path';

const consoleLogFormat = format.printf((info)=>{
    const { level, message, timestamp, meta = {} } = info
    const customLevel = level.toUpperCase()
    const customTimeStamp = timestamp
    const customMessage = message
    const customMeta = util.inspect(meta, {
        showHidden: false,
        depth: null
    })

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const customLog = `${customLevel} [${customTimeStamp}] ${customMessage}\n${'META'} ${customMeta}`

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
export default createLogger({
    defaultMeta: {
        meta: {}
    },
    transports:[
        ...fileTransport(),
        ...consoleTransport()
    ]
})