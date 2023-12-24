import mongoose, {InferSchemaType}  from "npm:mongoose@7.6.3";
import { ViajeModel } from "./tviaje.ts";
import { ViajeModelType } from "./tviaje.ts";
import { ConductorModel } from "./tconductor.ts";

const Schema = mongoose.Schema;

const ClienteSchema = new Schema({
    nombre: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    cards: [{ 
        number: {type: String, required: true},
        cvv: {type: String, required: true},
        expirity: {type: String, required: true},
        money: {type: Number, required: false, default: 0}, 
    }, {required: false, default: []}],
    travels: [{type: Schema.Types.ObjectId, required: false, ref:"Viaje", default: []}]
})

ClienteSchema
    .path("email")
    .validate(function(email: string) {
        return /^[a-z]{1,64}@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/.test(email); 
    })

ClienteSchema
    .path("cards.number").validate(function (numerot: string) {
        if(/^\d{16}$/.test(numerot)){ 
            return true;
        }
        throw new Error('fallo en el numero de la tarjeta');
    })

ClienteSchema
    .path("cards.cvv").validate(function (cvv: string) {
        if(/^\d{3}$/.test(cvv)){ 
            return true;
        }
        throw new Error('fallo en el cvv de la tarjeta');
    })

ClienteSchema
    .path("cards.expirity").validate(function (ex: string) {
        if(/^(0[1-9]|1[0-2])\/(20)\d{2}$/.test(ex)){
                return true;
        } 
        throw new Error('fallo en la fecha de expiracion de la targeta, tiene que ser MM/YYYY');
    })

ClienteSchema.path("cards.money").validate(function (money: number) {
    if(money >= 0){ 
        return true;
    }
    throw new Error('No tienes saldo');
})

ClienteSchema
    .path("travels").validate(function (travels: Array<ViajeModelType>) {
        let count = 0;
        for(let i = 0; i < travels.length; i++){
            if(travels[i].status != "Finalizado"){
                count++;
            }
        }
        if(count > 1){
            throw new Error('solo se puede un viaje');
        }
        return true;
    })

ClienteSchema
    .post("findOneAndDelete", async function(cliente: ClienteModelType){
        if(cliente){
            await ViajeModel.deleteMany({client: cliente._id}); 
            await ConductorModel.updateMany({travels: cliente._id}, {$pull: {travels: cliente._id}}); 
        }
    })

export type ClienteModelType = mongoose.Document & InferSchemaType<typeof ClienteSchema>;

export const ClienteModel = mongoose.model<ClienteModelType>("Cliente", ClienteSchema)

