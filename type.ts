export type Cliente ={
    nombre: string;
    email:string;
    cards: Array<Tarjeta>;
    travels: Array<Viaje>;
    id: string;
}

export type Conductor ={
    nombre: string;
    email:string;
    username:string; 
    travels: Array<Viaje>;
    id: string;
}

export type Viaje ={
    client: Cliente;
    driver : Conductor;
    money: number;
    distance: number;
    date: Date;
    status: Estado;
}

export type Tarjeta ={
    number: string;
    cvv : string;
    expirity: string;
    money : number;
}

export enum Estado {
    Programado = "Programado",
    EnProgreso = "EnProgreso",
    Finalizado = "Finalizado"
}
