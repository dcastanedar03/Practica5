import { ClienteModel } from "../db/tcliente.ts";
import { ClienteModelType } from "../db/tcliente.ts";
import { ConductorModel } from "../db/tconductor.ts";
import { ConductorModelType } from "../db/tconductor.ts";
import { ViajeModel } from "../db/tviaje.ts";
import { ViajeModelType } from "../db/tviaje.ts";

export const Query = {
    clientes: async (): Promise<Array<ClienteModelType>> => {
        return await ClienteModel.find().exec();
    },
    conductores: async (): Promise<Array<ConductorModelType>> => {
        return await ConductorModel.find().exec();
    },
    viajes: async (): Promise<Array<ViajeModelType>> => {
        return await ViajeModel.find().exec();
    }
}