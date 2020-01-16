# Developer-Profile-Generator



![Developer-Profile-Generator](images/Half.png)

## About The Project

I created a Github pdf creator that takes takes in 2 pieces of of information
* Your Github Username
* Your Favorite Color

Then produces a sleek and clean pdf of all your github user information to be used with clients and interviews.



### Features
* Automatic Github stats
* Choose from 4 different colors themes
* Links to you blog, github page, and your city shown on google maps


### Built With

* [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [puppeteer](https://www.google.com/search?client=safari&rls=en&q=puppetteer+js&ie=UTF-8&oe=UTF-8)
* [axios](https://github.com/axios/axios)
* [Node.js](https://nodejs.org/en/docs/)



<!-- GETTING STARTED -->
## Getting Started

* Click [Here](https://github.com/livingkurt/Developer-Profile-Generator/archive/master.zip) to download the repo to your local machine.
* Open up your terminal
    * Change directory to the repo directory
    * Type into terminal "node index.js"
    * Press Enter
* You will be asked 2 questions
* What is your Github username?
    * Type in a valid github username
* What is your favorite color?
    * You will be given a choice of 4 colors
        * green
        * blue
        * pink
        * red
    * And press enter
* It may take a moment to fully run
* Once you see a Done in the bottom of the terminal
* Your Done!
* Now check your repo directory to see how it looks


## Back End

This application was fully made in the backend. I used node.js, axios, and puppeteer to gather all of the information from github, 

## Issues

* Major Cities Collapse will not uncollapse when changing window size
* Google Chrome will not do the api calls, safari does

![Developer-Profile-Generator](images/Full.png)