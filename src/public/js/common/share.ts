// Social share button scripts

// Facebook
(function (d, s, id) {
    let js;
    const fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_GB/all.js#xfbml=1&appId=451426544938146";
    fjs.parentNode.insertBefore(js, fjs);
}(document, "script", "facebook-jssdk"));

// Twitter
!function (d, s, id) {
    let js;
    const fjs = d.getElementsByTagName(s)[0],
        p = /^http:/.test(<any>d.location) ? "http" : "https";
    if (!d.getElementById(id)) {
        js = d.createElement(s); js.id = id; js.src = p + "://platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs);
    }
}(document, "script", "twitter-wjs");
