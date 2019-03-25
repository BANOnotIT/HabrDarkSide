/**
 * Created by BANO.notIT on 11.06.17.
 */

let store = {match: [''], css: '', revision: -Infinity};

const
    HOST = 'http://localhost:8852/';

fetchStyle(listener);
chrome.tabs.onUpdated.addListener(tabExecuter);
chrome.tabs.onReplaced.addListener(tabExecuter);


const events = new EventSource(HOST + 'events');

events.onopen = events.onmessage = e => {
    console.log(e);
    fetchStyle(listener)
}


function fetchStyle(callback) {

    let req = new XMLHttpRequest();

    req.open('GET', HOST + 'source.json');
    req.onerror = (args) => {
        setTimeout(() => fetchStyle(callback), 1000);
        console.log(args);
    };

    req.onload = () => {
        if (req.status >= 200 && req.status < 300) {
            callback(req.responseText);
            console.log('received data');
        }
    };

    req.send();


}

function listener(text) {

    let result = JSON.parse(text);

    console.log(result.revision, store.revision);

    if (result.revision === store.revision)
        return;

    store = {match: result.match, css: result.css, revision: result.revision};
    tabExecuter()

}

function tabExecuter() {

    let css = codeGen(store.css);

    chrome.tabs.query({url: store.match}, tabs => {

        console.log(tabs);

        tabs.forEach(({id}) => {
            console.log(id);
            chrome.tabs.executeScript(id, {
                code: css,
                runAt: 'document_end'
            })
        })

    })

}

function codeGen(css) {

    return `
var createDRStyle = function() {
    var css = '${css.replace("'", "\\'")}';
    var style = document.createElement('style');
    style.setAttribute('id', 'stylish-reloader');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    return style;
};
if (document.head) {
    var style = createDRStyle();
    var prevStyle = document.getElementById('stylish-reloader');
    if (!prevStyle) {
        document.head.appendChild(style);
    } else if (style.textContent.replace(/^\\s*/gm, '') !== prevStyle.textContent.replace(/^\\s*/gm, '')) {
        prevStyle.parentElement.removeChild(prevStyle);
        document.head.appendChild(style);
    }
} else {
    var drObserver = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
            if (mutations[i].target.nodeName === 'HEAD') {
                drObserver.disconnect();
                document.removeEventListener('readystatechange', onReady);
                var prevStyle = document.getElementById('stylish-reloader');
                if (!prevStyle) {
                    var style = createDRStyle();
                    document.head.appendChild(style);
                }
                break;
            }
        }
    });
    drObserver.observe(document, { childList: true, subtree: true });
    var onReady = function() {
        if (document.readyState !== 'complete') { 
            return;
        }
        drObserver.disconnect();
        document.removeEventListener('readystatechange', onReady);
        if (!document.head) {
            var head = document.createElement('head');
            document.documentElement.insertBefore(head, document.documentElement.firstElementChild);
        }
        var prevStyle = document.getElementById('stylish-reloader');
        if (!prevStyle) {
            var style = createDRStyle();
            document.head.appendChild(style);
        }
    };
    document.addEventListener('readystatechange', onReady);
    if (document.readyState === 'complete') { 
        onReady();
    }
}
console.log("REPLACED")
    `

}
