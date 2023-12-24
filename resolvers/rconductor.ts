import { ConductorModelType } from "../db/tconductor.ts";
import { ViajeModel } from "../db/tviaje.ts";
import { ViajeModelType } from "../db/tviaje.ts";

export const Conductor = {
    travels: async (parent: ConductorModelType): Promise<Array<ViajeModelType>> => { 
        return await ViajeModel.find({driver: parent._id}).exec();
    }
};