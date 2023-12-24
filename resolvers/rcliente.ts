import { ClienteModelType } from "../db/tcliente.ts";
import { ViajeModel } from "../db/tviaje.ts";
import { ViajeModelType } from "../db/tviaje.ts";

export const Cliente = {
    travels: async (parent: ClienteModelType): Promise<Array<ViajeModelType>> => { 
        return await ViajeModel.find({client: parent._id}).exec();
    }
};