import { Request } from "express";

export const getSessionFlashData = (req: Request) => {
  const sessionData = req.session.flashData;
  req.session.flashData = undefined;
  return sessionData;
};

export const flashDataToSession = (
  req: Request,
  data: any,
  action: () => void
) => {
  req.session.flashData = data;
  req.session.save(action);
};
