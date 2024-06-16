import { error } from 'console';
import Ticket from '../models/ticket';

class ticketController{
 
        insertTicket(request:any):Ticket{
          console.log(request)
            const ticket = new Ticket(request[0], request[1]);
            return ticket;
        
}

// async create(req: Request, res: Response): Promise<void> {
//     const { natureza, descricao, provedor } = req.body;

//     if (!natureza || !descricao || !provedor) {
//       Logger.log('Invalid input data');
//       res.status(400).send('Invalid input data');
//       return;
//     }

//     try {
//       switch (provedor) {
//         case 'A':
//           await PostgresDAO.save({ natureza, descricao, provedor });
//           break;
//         case 'B':
//           await MongoDAO.save({ natureza, descricao, provedor });
//           break;
//         case 'C':
//           await MariaDAO.save({ natureza, descricao, provedor });
//           break;
//         default:
//           res.status(400).send('Invalid service provider');
//           return;
//       }
//       res.status(201).send('Chamado criado com sucesso');
//     } catch (error) {
//       Logger.log(`Error: ${error.message}`);
//       res.status(500).send('Error creating chamado');
//     }
  }

  export default new ticketController();