type ID = String;

export interface IncomingPackets {
  extOrderId: ID;
  type: string;
  cargoType?: string;
  cargoAmount?: number;
  toLocation?: string;
  fromLocation?: string;
}

export interface IOrder {
  orderid: ID;
  fromlocation: String;
  tolocation: String;
  cargotype: String;
  cargoamount: Number;
  updated_at: Date;
  ordersent: Boolean;
}

export interface SeaberInterface {
  orderid: ID;
  fromlocation: String;
  tolocation: String;
  cargotype: String;
  cargoamount: Number;
}
