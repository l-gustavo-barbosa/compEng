import * as fs from 'fs';
import * as path from 'path';

export default class Log {
    private static instance: Log;
    private logFilePath: string;

    private constructor() {
        this.logFilePath = path.join(__dirname, '../log.txt');
    }

    public static getInstance(): Log {
        if (!Log.instance) {
            Log.instance = new Log();
        }
        return Log.instance;
    }

    private writeLog(level: string, message: string): void {
        const now = new Date();
        const timestamp = this.formatDateTime(now);
        const logMessage = `${timestamp} [${level}] ${message}\n`;
        fs.appendFileSync(this.logFilePath, logMessage, 'utf8');
    }

    private formatDateTime(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    public info(message: string): void {
        this.writeLog('INFO', message);
    }

    public error(message: any): void {
        this.writeLog('ERROR', message);
    }
}
