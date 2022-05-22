import CartSession from "./CartSession"
import CartItem from "./CartItem"
import Order from "./Order"
import Payment from "./Payment"

export default interface Models {
  cart_session: CartSession
  cart_item: CartItem
  orders: Order
  payments: Payment
}
