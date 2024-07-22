export interface CartItemInput {
  type: 'airtime' | 'data';
  productId?: string;
  amount: number;
  operator: string;
  email: string;
  phone: string;
  dataPlan?: string;
}

export interface CartDetailsInput {
  sessionId?: string;  
  userId?: string; 
  items: CartItemInput[];
}

export interface FetchCartInput {
  sessionId?: string;  
  userId?: string; 
}
