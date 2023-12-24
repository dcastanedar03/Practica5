import mongoose, {InferSchemaType}  from "npm:mongoose@7.6.3";
import { ClienteModel } from "./tcliente.ts";
import { ConductorModel } from "./tconductor.ts";
import { Estado } from "../type.ts";

const Schema = mongoose.Schema;

const ViajeSchema = new Schema({
    client: {type: Schema.Types.ObjectId, ref: "Cliente", required: true},
    driver: {type: Schema.Types.ObjectId, ref: "Conductor", required: true},
    money: {type: Number, required: true}, 
    distance: {type: Number, required: true}, 
    date: {type: Date, required: true},
    status: {type: String, required: true, enum: Object.values(Estado)}
})

ViajeSchema
    .path("money").validate(function (money: number) {
        if(money < 5){ 
            throw new Error('El minimo son 5 euros');
        }
    })

ViajeSchema
    .path("distance").validate(function (distance: number) {
        if(distance < 0.01){ 
            throw new Error('El minimo es 0,01km');
        }
    })

ViajeSchema
    .path("date").validate(function (date: Date) {
        if(date.getTime() > Date.now()){ 
            return true;
        }
        throw new Error('Esa fecha ya ha pasado');
    })

ViajeSchema
    .path("status").validate(function (status: Estado) {
        if(Object.values(Estado).includes(status)){
            return true;
        }
        throw new Error('Ese estado no existe');
    })

ViajeSchema
    .pre("save", async function(next) {
        const viaje = this as ViajeModelType;

        const cliente = await ClienteModel.findById(viaje.client).populate('travels').exec();
        const conductor = await ConductorModel.findById(viaje.driver).populate('travels').exec();

        if (!cliente || !conductor) {
            throw new Error('No hay cliente o conductor');
        }

        const viajeCliente = cliente.travels.some(viaje => viaje.status !== Estado.Finalizado);
        const viajeConductor = conductor.travels.some(viaje => viaje.status !== Estado.Finalizado);

        if (viajeCliente) {
            throw new Error('El cliente tiene  ya un viaje');
        }

        if (viajeConductor) {
            throw new Error('El conductor tiene ya un viaje');
        }

        if (cliente.cards.length === 0 || !cliente.cards.some(card => card.money > 0)) {
            throw new Error('El cliente no tiene dinero');
        }

        const suficienteDinero = cliente.cards.some(card => card.money >= viaje.money);

        if (!suficienteDinero) {
            throw new Error('El cliente no tiene suficiente dinero ');
        }

        const card = cliente.cards.find(card => card.money >= viaje.money);

        if (card) {
            card.money -= viaje.money;
            cliente.travels.push(viaje);
            await Promise.all([cliente.save(), conductor.travels.push(viaje), conductor.save()]);
            next();
        }
    });
    
export type ViajeModelType = mongoose.Document & InferSchemaType<typeof ViajeSchema> //busque el error que tenia y saque la informacion de aqui https://github.com/Automattic/mongoose/issues/12420

export const ViajeModel =  mongoose.model<ViajeModelType>("Viaje", ViajeSchema);