import { Request } from "express";
import { DBUser } from "../types";

export const createUserSession = (
  req: Request,
  user: DBUser,
  action?: () => void
) => {
  req.session.uid = user.id;
  req.session.isAdmin = user.isAdmin;
  req.session.save(action);
};

export const deleteAuthSession = (req: Request, action?: () => void) => {
  req.session.uid = null;
  req.session.save(action);
};
