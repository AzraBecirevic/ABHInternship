import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "./auth";

export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const PASSWORD_REGEX = new RegExp(
  "^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{" +
    PASSWORD_MIN_LENGTH +
    "," +
    PASSWORD_MAX_LENGTH +
    "}$"
);

export const BID_REGEX = /^-?\d+(\.\d{1,2})?$/;

export const ID_REGEX = /^[0-9]+$/;

export const PHONE_NUMBER_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,4}$/im;

export const CITY_REGEX = /^[a-zA-Z]{1}[a-zA-Z ]{0,39}$/;

export const ZIP_CODE_REGEX = /(^\d{5}$)|(^\d{5}-\d{4}$)/;

export const STREET_REGEX = /^[\.a-zA-Z0-9, ]{0,60}$/;
