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

    })
};




async function run(filename, user_name, color, num_stars, name, profile_img, location, github_url, blog_url, num_repos, num_followers, num_following, html_for_pdf) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const html = html_for_pdf;
        await page.setContent(`
        ${html}
        <body>
            <main>
                <div class="row wrapper">
                    <div class="photo-header container">
                        <div class="row">

                            <img src=${profile_img} alt="profile" class="">

                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="col"></div>
                                <h3>Hi!</h3>
                            </div>
                        </div>
                        <div class="row">
                            <h3>My Name is ${name}!</h3>
                        </div>
                        <div class="row">
                            <h5>Currently @ UT Texas Coding Bootcamp</h5>
                        </div>
                        <div class="row links-nav">
                            <div class="col">
                                <h6><a href="" class="nav-link"></a><i class="fas fa-location-arrow"></i>${location}</h6>
                            </div>
                            <div class="col">
                                <h6><a href="${github_url}" class="nav-link"></a><i class="fab fa-github"></i>GitHub</h6>
                            </div>
                            <div class="col"></div>
                            <h6><a href="${blog_url}" class="nav-link"></a><i class="fas fa-rss"></i>Blog</h6>
                        </div>
                    </div>
                </div>
                </div>
                </div>
                <div class="container">
                    <div class="row">
                        <div class="col">
                            <h6 class="col">I create, learn and create some more</h6>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="card">
                            <h6>Public Repositories</h6>
                            <h6>${num_repos}</h6>
                        </div>
                        <div class="card">
                            <h6>GitHub Stars</h6>
                            <h6>${num_stars}</h6>
                        </div>

                    </div>
                    <div class="col">
                        <div class="card">
                            <h6>Followers</h6>
                            <h6>${num_followers}</h6>
                        </div>
                        <div class="card">
                            <h6>Following</h6>
                            <h6>${num_following}</h6>
                        </div>
                    </div>
                </div>
                <div class="row wrapper">

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