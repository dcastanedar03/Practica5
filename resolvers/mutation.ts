import { GraphQLError } from "graphql";
import { ClienteModel } from "../db/tcliente.ts";
import { ClienteModelType } from "../db/tcliente.ts";
import { ConductorModel } from "../db/tconductor.ts";
import { ConductorModelType } from "../db/tconductor.ts";
import { ViajeModel } from "../db/tviaje.ts";
import { ViajeModelType } from "../db/tviaje.ts";

export const Mutation = {
    posCliente: async(_parent:unknown, args:{nombre: string, email: string}): Promise<ClienteModelType> => {
        try{
            const{nombre, email} = args
            const cliente = new ClienteModel({
                nombre,
                email
            })
            await cliente.save();
            return cliente;
        }catch(error){
            throw new GraphQLError(error.message, {extensions: {code: "INTERNAL_SERVER_ERROR"},});
        }
    },
    posConductor: async(_parent:unknown, args:{nombre: string, email: string, username: string}): Promise<ConductorModelType> => {
        try{
            const{nombre, email, username} = args
            const conductores = new ConductorModel({
                nombre,
                email,
                username
            })
            await conductores.save();
            return conductores;
        }catch(error){
            throw new GraphQLError(error.message, {extensions: {code: "INTERNAL_SERVER_ERROR"},});
        }
    },
    deleteCliente: async(_parent:unknown, args:{id: string}): Promise<string> => {
        try{
            const clienteDelete = await ClienteModel.findOneAndDelete({_id: args.id})
            if(!clienteDelete){
                throw new GraphQLError(`Cliente no encontrado${args.id}`, {extensions: {code: "NOT_FOUND"},});
            }
            return "Cliente eliminado"
        }catch(error){
            throw new GraphQLError(error.message, {extensions: {code: "INTERNAL_SERVER_ERROR"},});
        }
    },
    deleteConductor: async(_parent:unknown, args:{id: string}): Promise<string> => {
        try{
            const conductorDelete = await ConductorModel.findOneAndDelete({_id: args.id})
            if(!conductorDelete){
                throw new GraphQLError(`Conductor no encontrado ${args.id}`, {extensions: {code: "NOT_FOUND"},});
            }
            return "Conductor eliminado"
        }catch(error){
            throw new GraphQLError(error.message, {extensions: {code: "INTERNAL_SERVER_ERROR"},});
        }
    },
    posTarjeta: async(_parent:unknown, args:{id: string, number: string, cvv: string, expirity: string, money: number}): Promise<ClienteModelType>  => {
        const{number, cvv, expirity, money} = args
        const cliente = await ClienteModel.findById(args.id);
        if(!cliente){
            throw new GraphQLError(`Cliente no encontrado`, {extensions: { code: "NOT_FOUND" },})  
        }
        if(cliente.cards){
            for(let i in cliente.cards){
                if(cliente.cards[i].number == args.number){
                    throw new GraphQLError(`Tarjeta ya creada`, {extensions: {code:"HAS_BEEN_CREATED_BEFORE"}})
                }
            }
        }
        const cards = {
            number,
            cvv,
            expirity,
            money
        }
        
        cliente.cards.push(cards)
        
        await cliente.save()
        return cliente
    },
    deleteTarjeta: async(_parent:unknown, args:{id: string, number: string}):Promise<string> => {
        const cliente = await ClienteModel.findOne({_id: args.id});
        if(!cliente){
            throw new GraphQLError(`Cliente no encontrado`, {extensions: { code: "NOT_FOUND" },})  
        }else if(!cliente.cards){
            throw new GraphQLError(`No tiene tarjetas`, {extensions: { code: "NOT_CARDS_FOUND" },})
        }

        let cont = 0
        for(let i in cliente.cards){
            if(cliente.cards[i].number === args.number){
                cliente.cards.splice(cont, 1)
            }
            cont ++;
        }

        await cliente.save();
        return "Tarjeta eliminada";
    },
    posViaje: async(_:unknown, args: {idCliente: string, idConductor: string, money: number, distance: number, date: string, status: string}): Promise <ViajeModelType> => {
        try{
            const cliente = await ClienteModel.findById(args.idCliente);
            const conductor = await ConductorModel.findById(args.idConductor)
            const viaje = new ViajeModel({
                client: cliente,
                driver: conductor,
                money: args.money,
                distance: args.distance,
                date: args.date,
                status: args.status
            })
            await viaje.save()
            return viaje;
        }catch(error){
            throw new GraphQLError(error.message, {extensions: {code: "ERROR"},});
        }
    },
    deleteViaje: async(_parent:unknown, args:{id: string}): Promise<ViajeModelType> => {
        try{
            const viajeAcabar = await ViajeModel.findById({_id: args.id})
            
            if(!viajeAcabar){
                throw new GraphQLError(`Viaje no encontrado${args.id}`, {extensions: {code: "NOT_FOUND"},});
            } else if(viajeAcabar?.status === "Finalizado"){
                throw new GraphQLError("Viaje ya terminado", {extensions: {code: "NOT_FOUND"},});
            }

            const viajeAcabado = await ViajeModel.findByIdAndUpdate(args.id, {status:"Finalizado", date: new Date()},
                                    {new: true})

            if(!viajeAcabado){
                throw new GraphQLError(`Viaje no encontrado ${args.id}`, {extensions: {code: "NOT_FOUND"},});
            }
            return viajeAcabado
        }catch(error){
            throw new GraphQLError(error.message, {extensions: {code: "INTERNAL_SERVER_ERROR"},});
        }
    }
}