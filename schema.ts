export const typeDefs = `#graphql

    type Cliente {
        nombre: String!,
        email: String!,
        cards: [Tarjeta!]!,
        travels: [Viaje!]!,
        id: ID!
    }

    type Conductor {
        nombre: String!,
        email: String!,
        username: String!,
        travels: [Viaje!]!,
        id: ID!
    }

    type Viaje {
        client: Cliente!,
        driver: Conductor!,
        money: Int!,
        distance: Int!,
        date: String!,
        status: Status!,
        id: ID!
    }

    type Tarjeta {
        number: String!,
        cvv: String!,
        expirity: String!,
        money: Int!
    }

    enum Status {
        Programado,
        EnProgreso,
        Finalizado
    }

    type Query {
        clientes: [Cliente!]!
        conductores: [Conductor!]!
        viajes: [Viaje!]!
    }

    type Mutation{
        posCliente(nombre: String!, email: String!): Cliente!
        deleteCliente(id: String!): String!

        posConductor(nombre: String!, email: String!, username: String!): Conductor!
        deleteConductor(id:String!): String!

        posTarjeta(id: ID!, number: String!, cvv: Int!, expirity: String!, money: Int!): Cliente!
        deleteTarjeta(id:ID!, number: String!): String!

        posViaje(idCliente: ID!, idConductor: ID!, money: Int!, distance: Int!, date: String!, status: String!): Viaje!
        deleteViaje(id: ID!): Viaje!
    }

`