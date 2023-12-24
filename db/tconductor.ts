import mongoose, {InferSchemaType}  from "npm:mongoose@7.6.3";
import { ViajeModel } from "./tviaje.ts";
import { ViajeModelType } from "./tviaje.ts";
import { ClienteModel } from "./tcliente.ts";

const Schema = mongoose.Schema;

const ConductorSchema = new Schema({
    nombre: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    travels: [{type: Schema.Types.ObjectId, ref: "Viaje", required: false, default:[]}]
})

ConductorSchema
    .path("email")
    .validate(function(email: string) {
        return /^[a-z]{1,64}@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/.test(email); 
    })

ConductorSchema
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

ConductorSchema
    .post("findOneAndDelete", async function(conductor: ConductorModelType){
        if(conductor){
            await ViajeModel.deleteMany({driver: conductor._id}); 
            await ClienteModel.updateMany({travels: conductor._id}, {$pull: {travels: conductor._id}}); 
        }
    })

export type ConductorModelType = mongoose.Document & InferSchemaType<typeof ConductorSchema> //busque el error que tenia y saque la informacion de aqui https://github.com/Automattic/mongoose/issues/12420

export const ConductorModel =  mongoose.model<ConductorModelType>("Conductor", ConductorSchema);

    