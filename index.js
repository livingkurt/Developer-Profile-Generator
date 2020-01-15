const inquirer = require("inquirer");
const fs = require('fs');
const PDFDocument = require('pdfkit');
const axios = require('axios').default;

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
    doc = new PDFDocument({compress:false});
    doc.pipe(fs.createWriteStream(filename + " "));
    user_name = response.name.toLowerCase();
    let color = response.color.toLowerCase();
    console.log(user_name)
    console.log(color)
    const starred = user_name + "/starred";
    doc.text(user_name)
    get_github_request(user_name, doc)
    get_starred(starred, doc);

});




const get_github_request = (user_name, doc) => {
    const query_url = "https://api.github.com/users/" + user_name;

    axios.get(query_url).then(function (response) {

        const user_info = response.data
        get_profile_img(user_info, doc);
        get_location(user_info, doc);
        get_github_url(user_info, doc);
        get_blog(user_info, doc);
        get_num_repositories(user_info, doc);
        get_num_followers(user_info, doc);
        get_num_following(user_info, doc);

    })
};

const get_starred = (starred, doc) => {
    const query_url = "https://api.github.com/users/" + starred;

    axios.get(query_url).then(function (response) {
        const num_stars = response.data.length
        console.log("Number of Starred Repos " + num_stars)
        doc.text("Number of Starred Repos " + num_stars)

    })
};



const get_profile_img = (user_info, doc) => {
    const profile_img = user_info.avatar_url
    console.log("Image " + profile_img + ".png")
    
}

const get_location = (user_info, doc) => {
    const location = user_info.location
    console.log("Location " + location)
}

const get_github_url = (user_info, doc) => {
    const github_url = user_info.html_url
    console.log("GitHub URL " + github_url)
}

const get_blog = (user_info, doc) => {
    const blog_url = user_info.blog
    console.log("Blog URL " + blog_url)
}

const get_num_repositories = (user_info, doc) => {
    const num_repos = user_info.public_repos
    console.log("Number of Repos " + num_repos)
}

const get_num_followers = (user_info, doc) => {
    const num_followers = user_info.followers
    console.log("Number of Followers " + num_followers)
}

const get_num_following = (user_info, doc) => {
    const num_following = user_info.following
    console.log("Number Following " + num_following)
}




