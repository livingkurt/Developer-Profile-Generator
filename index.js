// Calling Dependancies

// Calling inquirer for the terminal based interface
const inquirer = require("inquirer");
// Calling puppeteer for the pdf creation and html convertor
const puppeteer = require('puppeteer');
// Calling axios async way to call to github api
const axios = require('axios').default;
// Calling to generateHTML.js to get styling and colors
const generate = require('./generateHTML');

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
// Then Once those choices have been made
]).then(function (data) {
    // Create a variable with there username combined with a string containing the .pdf extension
    const filename = data.name.toLowerCase().split(' ').join('') + "_profile.pdf";
    // Assign html string to variable from the generateHTML.js file
    const html_for_pdf = generate.generateHTML(data);
    // Assing username to variable
    const user_name = data.name;
    // Assing user color to variable
    const user_color = data.color;
    // Create another way to call the github api to get the amount of starred repos
    const starred = user_name + "/starred";
    // Call the Get Starred function to get how many starred repos you have
    get_starred(starred, filename, user_name, html_for_pdf);
});
// Function to get how many starred repos you have
const get_starred = (starred, filename, user_name, html_for_pdf) => {
    // Assign queryurl to variable
    const query_url = "https://api.github.com/users/" + starred;
    // Make a request to the github api
    axios.get(query_url).then(function (response) {
        // Get the amount of stars in the array of starred repos
        const num_stars = response.data.length
        // Call the function to get all of the other information from github
        get_github_request(filename, user_name, num_stars, html_for_pdf)
    })

};
// Function to get all of the other information from github
const get_github_request = (filename, user_name, num_stars, html_for_pdf) => {
    // Assign queryurl to variable
    const query_url = "https://api.github.com/users/" + user_name;

    axios.get(query_url).then(function (response) {

        const user_info = response.data
        // print(response.name)
        const name = user_info.name
        const profile_img = user_info.avatar_url
        const location = user_info.location
        const github_url = user_info.html_url
        const bio = user_info.bio
        const blog_url = user_info.blog
        const num_repos = user_info.public_repos
        const num_followers = user_info.followers
        const num_following = user_info.following

        run(filename, num_stars, name, profile_img, location, github_url, bio, blog_url, num_repos, num_followers, num_following, html_for_pdf);

    })
};

async function run(filename, num_stars, name, profile_img, location, github_url, bio, blog_url, num_repos, num_followers, num_following, html_for_pdf) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const html = html_for_pdf;
        await page.setContent(`
        ${html}
        
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
                    <div class="nav-link">
                        <h6><a href="" class=""></a><i class="fas fa-location-arrow"></i>${location}</h6>
                    </div>
                    <div class="nav-link">
                        <h6><a href="${github_url}" class=""></a><i class="fab fa-github"></i>GitHub</h6>
                    </div>
                    <div class="nav-link">
                        <h6><a href="${blog_url}" class=""></a><i class="fas fa-rss"></i>Blog</h6>
                    </div>
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
        <div class="wrapper" style="height: 202px; margin-bottom: 0px;">

        </div>
    </main>
</body>

</html>`);
                    
        await page.emulateMedia('screen');
        await page.pdf({
            path: filename,
            format: 'A4',
            printBackground: true
        });
        print('done');
        await browser.close();
        process.exit();
    } catch (e) {
        print('our error', e);
    }
}

function print(x) {
    console.log(x)
}