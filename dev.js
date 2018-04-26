/**
 * Created by BANO.notIT on 11.06.17.
 */

const

    SITE_MATCHES = ["*://*.habr.com/*", "*://*.geektimes.com/*"],

    server = require("http").createServer,
    watch = require("chokidar").watch,
    compile = require("./build");

let
    state = {
        revision: +new Date(),
        match: SITE_MATCHES,
        css: compile()
    };

server((req, res) => {
    res.end(JSON.stringify(state))
})
    .listen(8852, () => console.log('listening'));


watch('src').on("all", () => {
    state.revision = +new Date();
    state.css = compile();
    console.log('replacing');
});
