package com.app.auctionbackend.helper;

import java.util.regex.Pattern;

import static com.app.auctionbackend.helper.ValidationConstants.PASSWORD_MAX_LENGTH;
import static com.app.auctionbackend.helper.ValidationConstants.PASSWORD_MIN_LENGTH;

public class Helper {

    public static boolean isEmailFormatValid(String email)
    {
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\."+
                "[a-zA-Z0-9_+&*-]+)*@" +
                "(?:[a-zA-Z0-9-]+\\.)+[a-z" +
                "A-Z]{2,7}$";

        Pattern pat = Pattern.compile(emailRegex);
        if (email == null)
            return false;
        return pat.matcher(email).matches();
    }

   public static boolean isPasswordFormatValid(String password)
   {
       String passRegex = "^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{" + PASSWORD_MIN_LENGTH + ","+ PASSWORD_MAX_LENGTH + "}$";

       Pattern pat = Pattern.compile(passRegex);
       if (password == null)
           return false;
       return pat.matcher(password).matches();
   }

   public static boolean isIdValid(String id){
       if(id.matches("[0-9]+"))
           return true;
       return false;
   }
   public static boolean isPhoneNumberFormatValid(String phoneNumber){
       String phoneNumberRegex = "^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{3,4}$";

       Pattern pat = Pattern.compile(phoneNumberRegex);
       if (phoneNumber == null)
           return false;
       return pat.matcher(phoneNumber).matches();
   }

    public static boolean isCityFormatValid(String city){
        String cityRegex = "^[a-zA-Z]{1}[a-zA-Z ]{0,39}$";

        Pattern pat = Pattern.compile(cityRegex);
        if (city == null)
            return false;
        return pat.matcher(city).matches();
    }

    public static boolean isZipCodeFormatValid(String zipCode){
        String zipCodeRegex =  "(^[0-9]{5}$)|(^[0-9]{5}-[0-9]{4}$)";

        Pattern pat = Pattern.compile(zipCodeRegex);
        if (zipCode == null)
            return false;
        return pat.matcher(zipCode).matches();
    }

    public static boolean isStreetFormatValid(String street){
        String streetRegex = "^[\\.a-zA-Z0-9, ]{0,60}$" ;

        Pattern pat = Pattern.compile(streetRegex);
        if (street == null)
            return false;
        return pat.matcher(street).matches();
    }
}
