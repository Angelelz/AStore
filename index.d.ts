import { Cart } from "./src/models/cart.model";

declare global {
  namespace Express {
    interface Response {
      locals: {
        uuid: string,
        isAuth: boolean,
        isAdmin: boolean
        cart: Cart,
        csrfToken: string,
      }
    }
  }
}