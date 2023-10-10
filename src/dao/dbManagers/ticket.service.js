import ticketModel from "../../models/ticket.model.js";
import logger from "../../middlewares/logger.middleware.js";


export default class TicketService{
    constructor(){
        this.model = ticketModel;
    }

    async createTicket(purchaser, amount){
        const generateRandomNumber = () => Math.floor(Math.random() * 99999999) + 99999999;
        const generatedCode = generateRandomNumber(); //verificar que no exista el codigo creado
        try {
            let ticket = {
                purchaser,
                amount,
                purchase_datatime: new Date(),
                code: generatedCode,
            }
            return await this.model.create(ticket)
        } catch (error) {
            logger.error('error al crear el ticket', error);
        }
    }

    async getTickets(){
        try {
            return await this.model.find().lean()
        } catch (error) {
            logger.error('error al traer los tickets', error);
        }
    }

    async getTicketById(id){
        try {
            return await this.model.findOne({ _id: id }).lean()
        } catch (error) {
            logger.error('error al traer el ticket por _id', error);
        }
    }
}