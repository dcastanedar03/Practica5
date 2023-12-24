import { GraphQLError } from "graphql";
import { ViajeModelType } from "../db/tviaje.ts";
import { ClienteModel } from "../db/tcliente.ts";
import { ClienteModelType } from "../db/tcliente.ts";
import { ConductorModel } from "../db/tconductor.ts";
import { ConductorModelType } from "../db/tconductor.ts";

export const Viaje = {
    client: async (parent: ViajeModelType): Promise<ClienteModelType> => {
        if(parent.client){
            const cliente = await ClienteModel.findById(parent.client).exec();
            if(cliente){
                return cliente;
            }
        }throw new GraphQLError("Lo siento no existe cliente");
    },

    driver: async (parent: ViajeModelType): Promise<ConductorModelType> => { 
        if(parent.driver){
            const conductor = await ConductorModel.findById(parent.driver).exec();
            if(conductor){
                return conductor;
            }
        }throw new GraphQLError("Lo siento no existe conductor");
    }
}

