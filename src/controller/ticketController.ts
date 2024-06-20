import { error } from "console";
import Ticket from "../models/ticket";
import Log from "../models/log";

const insertLog = Log.getInstance();

class ticketController {
    insertTicket(request: any): Ticket {
    console.log(`Data received: ${request}`);
    insertLog.info(`Data received: ${request}`);
    const ticket = new Ticket(request[0], request[1]);
    return ticket;
  }
}

export default new ticketController();
