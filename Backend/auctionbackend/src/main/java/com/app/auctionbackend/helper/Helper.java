package com.app.auctionbackend.helper;

import java.util.regex.Pattern;

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
       String passRegex = "^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$";

       Pattern pat = Pattern.compile(passRegex);
       if (password == null)
           return false;
       return pat.matcher(password).matches();
   }
}
