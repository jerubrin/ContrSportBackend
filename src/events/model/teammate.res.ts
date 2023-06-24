export class TeammateRes {
  eventID: number;
  email: string;
  confirmed: boolean; // подтвердил ли пользователь участие в ивенте
  paid: number; // сколько пользователь оплатил
  firstName: string;
  gender: string;
  lastName: string | null;
  countryCode: string | null;
  phone: string | null;
  telegram: string | null;
}