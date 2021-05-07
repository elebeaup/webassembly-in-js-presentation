const initEmbedTweet = async function (Reveal) {
    window.twttr = (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function (f) {
            t._e.push(f);
        };
    }(document, "script", "twitter-wjs"));

    const tweets = document.querySelectorAll(".tweet");

    for (const tweet of tweets) {
        tweet.innerHTML = `<blockquote class="twitter-tweet" data-theme="light"><p lang="en" dir="ltr"><a href="${tweet.getAttribute('data-src')}"></a></blockquote>`;
    }
};

const RevealEmbedTweet = {
    id: 'RevealEmbedTweet',
    init: function (deck) {
        initEmbedTweet(deck);
    }
};

export default RevealEmbedTweet;




