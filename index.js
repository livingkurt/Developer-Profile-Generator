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
                    <h3 style="margin-top: 10px;">Hi!</h3>
                </div>
                <div class="row" style="width: 100%; text-align: center; margin: 0px auto;">
                    <h3 style="width: 100%;">My Name is ${name}!</h3>
                </div>
                <div class="row">
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
                <h4 id="statement"style="margin-top: 27px;" class="col">I create, learn and create some more</h4>
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
        <div class="wrapper" style="height: 233px; margin-bottom: 0px;">

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