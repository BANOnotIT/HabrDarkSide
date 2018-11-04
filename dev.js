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

let
    sockets = [];


server((req, res) => {

    if (req.url === '/events') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache'
        });
        res.on('close', () =>
            sockets.forEach(
                (socket, i, sockets) => {
                    if (socket === res)
                        sockets.splice(i, 1)
                }
            )
        );
        sockets.push(res);
        console.log('got connection!')
        return
    }

    console.log('sending current state!')
    res.end(JSON.stringify(state))
})
    .listen(8852, () => console.log('listening'));


watch('src').on("all", () => {
    console.log('compiling...', new Date)
    state.revision = +new Date();
    state.css = compile();
    console.log('reloading');
    sockets.forEach(socket =>
        socket.write('data: reload\n\n')
    )

});
