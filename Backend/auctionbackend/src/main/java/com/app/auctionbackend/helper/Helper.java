package com.app.auctionbackend.helper;

import io.swagger.models.auth.In;

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
}
