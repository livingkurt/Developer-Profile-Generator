const inquirer = require("inquirer");
const fs = require('fs');
const PDFDocument = require('pdfkit');
const puppeteer = require('puppeteer');
const axios = require('axios').default;
// var http = require('http');
// http.createServer(function (req, res) {
//   res.write('<html><head></head><body>');
//   res.write('<p>Write your HTML content here</p>');
//   res.end('</body></html>');
// }).listen(1337);

// let user_name;






inquirer.prompt([
    {
        type: "input",
        name: "name",
        message: "What is your GitHub Username?"
    },
    {
        type: "input",
        name: "color",
        message: "What is your favorite color?"
    },

]).then(function (response) {

    let filename = response.name.toLowerCase().split(' ').join('') + "_profile.pdf";
    user_name = response.name.toLowerCase();
    let color = response.color.toLowerCase();
    console.log(user_name)
    console.log(color)
    const starred = user_name + "/starred";
    // doc.text(user_name)
    // doc.end();
    get_starred(starred, filename, user_name, color);
    
    
    

});

const get_starred = (starred, filename, user_name, color) => {
    const query_url = "https://api.github.com/users/" + starred;

    axios.get(query_url).then(function (response) {
        const num_stars = response.data.length
        console.log("Number of Starred Repos " + num_stars)
        // /.text("Number of Starred Repos " + num_stars)
        get_github_request(filename, user_name, color, num_stars)
    })
    
};




const get_github_request = (filename, user_name, color, num_stars) => {
    const query_url = "https://api.github.com/users/" + user_name;

    axios.get(query_url).then(function (response) {

        const user_info = response.data
        // console.log(response.name)
        const name = user_info.name
        const profile_img = user_info.avatar_url
        const location = user_info.location
        const github_url = user_info.html_url
        const blog_url = user_info.blog
        const num_repos = user_info.public_repos
        const num_followers = user_info.followers
        const num_following = user_info.following
        
        run(filename, user_name, color, num_stars, name, profile_img, location, github_url, blog_url, num_repos, num_followers, num_following);
        
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




async function run(filename, user_name, color, num_stars, name, profile_img, location, github_url, blog_url, num_repos, num_followers, num_following) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const html = ("<h1>" + user_name + "</h1> <img src='" + profile_img + "'.png> <h1>" + name + "</h1>");
        await page.setContent(html);
        // '<img src="' + profile_img + '.png" >')
        // await page.setContent('<img src="' + profile_img + '.png" >')
        // await page.setContent('<h1>' + name + '</h1>')
        // await page.setContent('<h1>' + location + '</h1>')
        // await page.setContent('<h1>' + github_url + '</h1>')
        // await page.setContent('<h1>' + blog_url + '</h1>')
        // await page.setContent('<h1>' + num_repos + '</h1>')
        // await page.setContent('<h1>' + num_followers + '</h1>')
        // await page.setContent('<h1>' + num_following + '</h1>')
        // await page.setContent('<h1>' + num_stars + '</h1>')
        await page.emulateMedia('screen');
        await page.pdf({
            path: filename,
            format: 'A4',
            printBackground: true
        });
        // page.addStyleTag({content: '.body{background: ' + color + '}'});
        console.log('done');
        await browser.close();
        process.exit();
    } catch (e) {
        console.log('our error', e);
    }
}

// const get_name = (user_info) => {
//     const name = user_info.name
//     console.log(name)
//     // /.text(name)

// }


// const get_profile_img = (user_info) => {
//     const profile_img = user_info.avatar_url
//     console.log("Image " + profile_img + ".png")
//     // /.image(profile_img + ".png", 50, 150, { width: 300 });

// }

// const get_location = (user_info) => {
//     const location = user_info.location
//     console.log("Location " + location)
// }

// const get_github_url = (user_info) => {
//     const github_url = user_info.html_url
//     console.log("GitHub URL " + github_url)
// }

// const get_blog = (user_info) => {
//     const blog_url = user_info.blog
//     console.log("Blog URL " + blog_url)
// }

// const get_num_repositories = (user_info) => {
//     const num_repos = user_info.public_repos
//     console.log("Number of Repos " + num_repos)
// }

// const get_num_followers = (user_info) => {
//     const num_followers = user_info.followers
//     console.log("Number of Followers " + num_followers)
// }

// const get_num_following = (user_info) => {
//     const num_following = user_info.following
//     console.log("Number Following " + num_following)
// }




