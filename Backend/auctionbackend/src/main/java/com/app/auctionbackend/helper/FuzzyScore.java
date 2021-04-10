package com.app.auctionbackend.helper;

import java.util.*;

public class FuzzyScore {

    public Integer fuzzyScore(String term,String query){

        if (query.contains(" ")) {
            List<Integer> queryScores = new ArrayList<>();
            String[] queryArray = query.split(" ");

            for (int j = 0; j < queryArray.length; j++) {
                int score = fuzzyScore(term, queryArray[j]);
                queryScores.add(score);
            }
            Integer maxScore = Collections.max(queryScores);
            return maxScore;
        }


        if(!query.contains(" ") && term.contains(" ")){
            List<Integer> termScores = new ArrayList<>();
            String[] termArray = term.split(" ");

            for(int j = 0; j < termArray.length; j++){

                int score = fuzzyScore(termArray[j], query);

                termScores.add(score);
            }
            Integer maxScore = Collections.max(termScores);
            return maxScore;
        }

        if(query.contains(",") && query.length() > 1){
            List<Integer> queryScores = new ArrayList<>();
            String[] queryArray = query.split(",");

            for(int j = 0; j < queryArray.length; j++){

                int score = fuzzyScore(term, queryArray[j]);

                queryScores.add(score);
            }
            Integer maxScore = Collections.max(queryScores);
            return maxScore;
        }
        return getFuzzyScore(term, query);
    }

    public Integer getFuzzyScore(String term, String query) {
        if(term == null || query == null){
            return 0;
        }

        int score = 0;
        int currentTermIndex = 0;

        String termString = term.toLowerCase();
        String queryString = query.toLowerCase();

        for(int i = 0; i < queryString.length(); i++){
            char queryCharacter = queryString.charAt(i);

            for(int j = currentTermIndex; j < termString.length(); j++){
                char termCharacter = termString.charAt(j);

                currentTermIndex ++;

                if(queryCharacter == termCharacter){
                    score += 1;

                   if(i != 0 && j != 0){
                        char lastQueryCharacter = queryString.charAt(i-1);
                        char lastTermCharacter = termString.charAt(j-1);

                        if(lastQueryCharacter == lastTermCharacter){
                            score += 2;
                        }
                   }
                   break;
                }
            }
        }
        return score;
    }
}