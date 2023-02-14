import { SignUpData } from "../types";

const isEmpty = (val: string) => {
  return !val || val.trim() === "";
}

const haveValidCrerdentials = (email: string, password: string) => {
  return (
    email &&
    email.includes("@") &&
    password &&
    password.trim().length > 5
  )
}

export const isValidUserInfo = (data: SignUpData) => {
  return (
    haveValidCrerdentials(data.email, data.password) &&
    !isEmpty(data.fullname) &&
    !isEmpty(data.street) &&
    !isEmpty(data.postal) &&
    !isEmpty(data.city)
  );
};

export const confirmationMatches = (email: string, confirmEmail: string) => {
  return email === confirmEmail
}