//calling my dependencies
const inquirer = require("inquirer");
const fs = require('fs');
const PDFDocument = require('pdfkit');
const puppeteer = require('puppeteer');
const axios = require('axios').default;
const generate = require('./generateHTML');
const doc = new PDFDocument;
//I'm pulling from the inquirer functions like prompt to ask the user questions
inquirer.prompt([
    {
        type: "input",
        name: "name",
        message: "What is your GitHub Username?"
    },
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

]).then(function (data) {
    //creating my file name
    const filename = data.name.toLowerCase().split(' ').join('') + "_profile.pdf";
    const html_for_pdf = generate.generateHTML(data);
    //   print(html_for_pdf);
    print(data.name);
    print(data.color);

    const user_name = data.name;
    const user_color = data.color;
    const starred = user_name + "/starred";
    let js_color
    if (user_color === "green") {
        js_color = generate.colors.green;
    }
    else if (user_color === "blue") {
        js_color = generate.colors.blue;
    }
    else if (user_color === "pink") {
        js_color = generate.colors.pink;
    }
    else if (user_color === "red") {
        js_color = generate.colors.red;
    }

    print(js_color)
    const wrapper_background = js_color.wrapperBackground;
    const header_background = js_color.headerBackground;
    const header_color = js_color.headerColor;
    const photo_border_color = js_color.photoBorderColor;

    print(wrapper_background);
    print(header_background);
    print(header_color);
    print(photo_border_color);

    get_starred(starred, filename, user_name, user_color, html_for_pdf);

    //This will create a JSON file with my of username and my fav color
    //   fs.writeFile(filename, JSON.stringify(profilePDF, null), function(err) {
    //     if (err) {
    //       return print(err);
    //     }
    //     print("Success!");
    //     //taking the username from the user input data
    //     let name = data.name;    
    //     print(name);
    //     //taking the color from the user input data
    //     let color = data.color;    
    //     print(color);
    //     //pulling a function from from the generateHTML.js.
    //     print(generate.colors);
    //     //calling the generateHTML and inputting data input for colors
    //     // print(profilePDF);
    //     //Activity 24 you put your github info in and call it inside the HTML for PDF
    //     //need to make a const that holds the body tag to into my HTML to convert to PDF
    //   });  
});

const get_starred = (starred, filename, user_name, color, html_for_pdf) => {
    const query_url = "https://api.github.com/users/" + starred;

    axios.get(query_url).then(function (response) {
        const num_stars = response.data.length
        print("Number of Starred Repos " + num_stars)
        // /.text("Number of Starred Repos " + num_stars)
        get_github_request(filename, user_name, color, num_stars, html_for_pdf)
    })

};




const get_github_request = (filename, user_name, color, num_stars, html_for_pdf) => {
    const query_url = "https://api.github.com/users/" + user_name;

    axios.get(query_url).then(function (response) {

        const user_info = response.data
        // print(response.name)
        const name = user_info.name
        const profile_img = user_info.avatar_url
        const location = user_info.location
        const github_url = user_info.html_url
        const blog_url = user_info.blog
        const num_repos = user_info.public_repos
        const num_followers = user_info.followers
        const num_following = user_info.following
        // print(name)
        // print(profile_img)
        // print(location)
        // print(github_url)
        // print(blog_url)
        // print(num_repos)
        // print(num_followers)
        // print(num_following)

        run(filename, user_name, color, num_stars, name, profile_img, location, github_url, blog_url, num_repos, num_followers, num_following, html_for_pdf);

        // get_name(user_info);
        // get_profile_img(user_info);
        // get_location(user_info);
        // get_github_url(user_info);
        // get_blog(user_info);
        // get_num_repositories(user_info);
        // get_num_followers(user_info);
        // get_num_following(user_info);

    })
};




async function run(filename, user_name, color, num_stars, name, profile_img, location, github_url, blog_url, num_repos, num_followers, num_following, html_for_pdf) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const html = html_for_pdf;
        // print(typeof (html))
        // print(html);
        await page.setContent(`
        ${html}
        </head>
            <body>
                <div class="container">
                    <div id="top_color_d" class="row">
                        <div id="greeting_d">
                            <img src=${profile_img} height="300px" width="300px" alt="profile" class="photo-header">
                            <h1>Hi!</h1>
                            <h1>My Name is ${name}!</h1>
                            <h4>Currently @ UT Texas Coding Bootcamp</h4>
                            <div id="nav_bar" class="row links-nav">
                                <a href="" class="nav-link">${location}</a>
                                <a href="${github_url}" class="nav-link">GitHub</a>
                                <a href="${blog_url}" class="nav-link">Blog</a>
                            </div>
                        </div>
                    </div>
                    <div id="middle_color_d" class="row">
                        <div class="row">
                            <h3>I create, learn and create some more</h3>
                        </div>
                        <div class="col">
                            <div>
                                <h3>Public Repositories</h3>
                                <h3>${num_repos}</h3>
                            </div>
                            <div>
                                <h3>GitHub Stars</h3>
                                <h3>${num_stars}</h3>
                            </div>
                        </div>
                        <div class="col">
                            <div>
                                <h3>Followers</h3>
                                <h3>${num_followers}</h3>
                            </div>
                            <div>
                                <h3>Following</h3>
                                <h3>${num_following}</h3>
                            </div>
                            </div>
                        </div>
                    <div id="bottom_color_d" class="row">

                    </div>
                </div>
            </body>
        </html>`);
        // await page.setContent("<h2>Hello</h2>");
        await page.emulateMedia('screen');
        await page.pdf({
            path: filename,
            format: 'A4',
            printBackground: true
        });
        // page.addStyleTag({content: '.body{background: ' + color + '}'});
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