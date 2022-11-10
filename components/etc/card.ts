export interface CarInfo {
  id: number;
  manufacturer: string;
  model: string;
  year: number;
  nickname: string;
}
export interface CarOwnership extends CarInfo {
  users: [{ Ownerships: { id: number; isPrimary: Boolean } }];
}
export interface CarPending extends CarInfo {
  ownership: [{ id: number; isPrimary: Boolean }];
}
export interface UserInfo {
  username: string;
  email: string;
}
export interface CarLogs extends CarInfo {
  logs: [{ mileage: number | null }];
}
export interface CarExpenses extends CarOwnership {
  monthly: [{ carId: number; monthly: number }] | [];
  yearly: [{ carId: number; yearly: number }] | [];
  alltime: [{ carId: number; alltime: number }] | [];
}

export interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  href: string;
}

export interface Logs {
  id: number;
  name: string | null;
  date: Date;
  mileage: number | null;
  car: CarInfo;
  expenses: {
    date: string;
    price: number;
    refuels?: { id: number; liters: number };
    prolongedExpenses?: { id: number; endDate: string };
    recurringExpenses?: { id: number };
  };
  user: { username: string };
}
