export interface User {
  name?: string;
  email: string;
  password: string;
}

export interface UserCreated {
  id: number;
  name: string;
  email: string;
  password: string;
  balance: number;
}

export type ApiResponse = {
  ok: boolean;
  data?: UserCreated;
  error?: string;
};

export type IncomeExpense = {
  userId: number;
  title: string;
  type: number;
  total: number;
};

export interface CreatedIncomeExpense extends IncomeExpense {
  id: number;
  createdAt: string;
}
