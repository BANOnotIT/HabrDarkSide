/**
 * Created by BANO.notIT on 12.06.17.
 */

const
    css = require("./build")(),
    request = require("request"),
    read = require("fs").readFileSync,
    conf = require("./deploy/stylish-conf.json");


const formData = {
    "_method": "put",
    "authenticity_token": conf.authenticity_token,


    "style[id]": conf.style_id,
    "style[license]": conf.license,
    "style[additional_info]": read("./deploy/aditional.html"),
    "style[long_description]": read("./deploy/description.html"),
    "style[short_description]": conf["short desc"],
    "style[screenshot_url_override]": conf.screenshot_url_override,
    "style[style_code_attributes][id]": conf.code_id,
    "style[style_code_attributes][code]": `@-moz-document ${conf.domains.map(dom => 'domain("' + dom + '")').join()}
    {${css}}`,
};

request.post({
    url: "https://userstyles.org/styles/update",
    formData,
    headers: {
        Cookie: conf.cookie
    }
}, function (error, response) {
    if (!error && response.statusCode === 200)
        console.log('Published!');
    else
        console.log([error, response]);

});