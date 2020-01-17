// Calling Dependancies

// Calling inquirer for the terminal based interface
const inquirer = require("inquirer");
// Calling puppeteer for the pdf creation and html convertor
const puppeteer = require('puppeteer');
// Calling axios async way to call to github api
const axios = require('axios').default;
// Calling to generateHTML.js to get styling and colors
const generate = require('./generateHTML');
// Calling to terminalLink to add a nice little link at the bottom of the terminal when pdf is done
const terminalLink = require('terminal-link');
// Calling to fs to have access to the file system
const fs = require('fs');

// Initiate terminal based user interface
inquirer.prompt([
    // Ask user to input username
    {
        type: "input",
        name: "name",
        message: "What is your GitHub Username?"
    },
    // Ask user to input favorite color of four
    {
        type: "rawlist",
        name: "color",
        message: "What is your favorite color?",
        choices: [
            "green",
            "blue",
            "pink",
            "red"
        ]
    },
    {
        type: "confirm",
        name: "html",
        message: "Would you like to create a index.html as well? [y/n]",
    },
// Then Once those choices have been made
]).then(function (data) {
    // Progress Message
    print('Hold on...\n');
    // Create a variable with there username combined with a string containing the .pdf extension
    const filename = data.name.toLowerCase().split(' ').join('') + "_profile.pdf";
    // Assign html string to variable from the generateHTML.js file
    const html_for_pdf = generate.generateHTML(data);
    // Assing username to variable
    const user_name = data.name;
    // Assing user color to variable
    const user_color = data.color;
    // Assing user color to variable
    const html_choice = data.html;
    // Create another way to call the github api to get the amount of starred repos
    const starred = user_name + "/starred";
    // Call the Get Starred function to get how many starred repos you have
    get_starred(starred, filename, user_name, html_for_pdf, html_choice);
});
// Function to get how many starred repos you have
const get_starred = (starred, filename, user_name, html_for_pdf, html_choice) => {
    // Assign queryurl to variable
    const query_url = "https://api.github.com/users/" + starred;
    // Make a request to the github api
    axios.get(query_url).then(function (response) {
        // Get the amount of stars in the array of starred repos
        const num_stars = response.data.length
        // Call the function to get all of the other information from github
        get_github_request(filename, user_name, num_stars, html_for_pdf, html_choice)
    })

};
// Function to get all of the other information from github
const get_github_request = (filename, user_name, num_stars, html_for_pdf, html_choice) => {
    // Progress Message
    print("We're working on it...\n");
    // Assign queryurl to variable
    const query_url = "https://api.github.com/users/" + user_name;
    // Make a request to the github api
    axios.get(query_url).then(function (response) {
        // Assign response object to variable
        const user_info = response.data
        // Assign name to variable
        const name = user_info.name
        // Assign profile image to variable
        const profile_img = user_info.avatar_url
        // Assign location to variable
        const location = user_info.location
        // Assign github url to variable
        const github_url = user_info.html_url
        // Assign bio to variable
        const bio = user_info.bio
        // Assign blog url to variable
        const blog_url = user_info.blog
        // Assign number of repos to variable
        const num_repos = user_info.public_repos
        // Assign number of followers to variable
        const num_followers = user_info.followers
        // Assign number of people your following to variable
        const num_following = user_info.following
        // Call the function to create the pdf from the github information
        create_pdf(filename, user_name, num_stars, name, profile_img, location, github_url, bio, blog_url, num_repos, num_followers, num_following, html_for_pdf, html_choice);

    })
};
// Function to create the pdf from the github information
async function create_pdf(filename, user_name, num_stars, name, profile_img, location, github_url, bio, blog_url, num_repos, num_followers, num_following, html_for_pdf, html_choice) {
    // Progress Message
    print("Almost...\n");
    // Try the following things
    try {
        // Launch puppeteer
        const browser = await puppeteer.launch();
        // Create a new page
        const page = await browser.newPage();
        // Assign the html from the generateHTML.js file to a new variable
        const html = 
        `${html_for_pdf}
        </head>
        <body style="font-family: "Custom_font";>
            <main style="padding: 0px">
                <div class="row wrapper" style="padding: 0px;margin: 0px;">
                    <div class="photo-header" style="margin-top: 100px;
                    ">
                        <!-- <div class="row container"> -->
                            <img src=${profile_img} height="100px" width="100px"alt="profile" class="">
                        <!-- </div> -->
                        <div class="container" style="width: 100%; text-align: center; padding: 0px">
                            <h3 style="margin-top: 30px;">Hi!</h3>
                        </div>
                        <div class="row" style="width: 100%; text-align: center; margin: 10px auto;">
                            <h3 style="width: 100%;">My Name is ${name}!</h3>
                        </div>
                        <div class="">
                            <h6>Currently @ UT Texas Coding Bootcamp</h6>
                        </div>

                        <div class="links-nav">
                            <span class="nav-link"><a href="https://www.google.com/maps/place/${location}"><i class="fas fa-location-arrow"></i>${location}</a></span>
                            <span class="nav-link"><a href="${github_url}"><i class="fab fa-github"></i>Github</a></span>
                            <span class="nav-link"><a href="${blog_url}"><i class="fas fa-rss"></i>Blog</a></span>
                        </div>
                    </div>
                </div>
                <div class="container" style="padding-bottom: 0px;">
                    <div class="">
                        <h4 id="statement"style="margin-top: 27px;" class="col">${bio}</h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="card">
                            <h4>Public Repositories</h4>
                            <h6>${num_repos}</h6>
                        </div>
                        <div class="card">
                            <h4>GitHub Stars</h4>
                            <h6>${num_stars}</h6>
                        </div>

                    </div>
                    <div class="col">
                        <div class="card">
                            <h4>Followers</h4>
                            <h6>${num_followers}</h6>
                        </div>
                        <div class="card">
                            <h4>Following</h4>
                            <h6>${num_following}</h6>
                        </div>
                    </div>
                </div>
                <div class="wrapper" style="height: 205px; margin-bottom: 0px;">

                </div>
            </main>
        </body>
        </html>`
        // Add html and github information to pdf
        await page.setContent(html);
        if (html_choice){
            // Creates html file as well
            await fs.writeFile('index.html', html, (error) => { /* handle error */ });
        }
        // Gets information about screen size
        await page.emulateMedia('screen');
        // Actually creates the pdf document and formats
        await page.pdf({
            // Creates the pdf document
            path: filename,
            // Set page size
            format: 'A4',
            // Will print background graphic
            printBackground: true
        });
        // Tells User that its done
        print('Your PDF has been created!\n');
        // Create a terminal clickable link
        const link = terminalLink(`${github_url}`, `${user_name}`);
        // Place that link onto the terminal
        print(link + "\n");
        // Shows where the github link is
        print('^^^Link to Github User Above!^^^\n');
        // Close the pdf tile
        await browser.close();
        process.exit();
    // If there is an error catch it
    } catch (e) {
        print('Your Error', e);
    }
}

// Python print function
function print(x) {
    console.log(x)
}