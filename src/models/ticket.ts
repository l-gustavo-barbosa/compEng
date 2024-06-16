class Ticket {
    type: string;
    description: string;

    constructor (type:string, description:string){
        this.type = type;
        this.description = description;
    }
    getType():string{
        return this.type;
    };
    getDescription():string{
        return this.description;
    }
}

export default Ticket