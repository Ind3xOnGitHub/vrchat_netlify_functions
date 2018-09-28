const https = require('https');

const { VRCHAT_USER, VRCHAT_PASSWORD } = process.env;

exports.handler = function(event, context, callback) {
    const searchFor = event.queryStringParameters.user.toLowerCase()
    const isID = searchFor.indexOf('usr_') === 0 ? true : false

    const options = {
        host: 'api.vrchat.cloud',
        path: `/api/1/users/${encodeURIComponent(searchFor)}${!isID ? '/name' : ''}`,
        auth: VRCHAT_USER + ':' + VRCHAT_PASSWORD,
        headers: {
            'Cookie': 'apiKey=JlE5Jldo5Jibnk5O5hTx6XVqsJu4WJ26'
        }
    }

    const req = https.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', chunk => {
            const json = JSON.parse(chunk);

            const ranks = {
                0: 'Visitor',
                1: 'New User',
                2: 'User',
                3: 'Known',
                4: 'Trusted',
                5: 'Veteran'
            }

            let currentRank = 0;
            if (json.tags.indexOf('system_trust_basic') >= 0) currentRank = 1
            if (json.tags.indexOf('system_trust_intermediate') >= 0) currentRank = 2
            if (json.tags.indexOf('system_trust_known') >= 0) currentRank = 3
            if (json.tags.indexOf('system_trust_veteran') >= 0) currentRank = 4
            if (json.tags.indexOf('system_trust_legend') >= 0) currentRank = 5

            console.log(`${searchFor} (${json.displayName})`, ranks[currentRank]);

            callback(null, {
                statusCode: 200,
                body: `
                  <html>
                    <head>
                      <meta charset="UTF-8">
                      <title>Your VRChat rank</title>

                      <meta property="og:title" content="${ranks[currentRank]}">
                      <meta property="og:description" content="VRChat rank of ${json.displayName}">
                    </head>

                    <body>
                      <p>Rank of ${json.displayName}: <strong>${ranks[currentRank]}</strong></p>
                      <form method="GET" action="">
                        <label for="user_input">Enter your user name or user ID:</label>
                        <input id="user_input" type="text" name="user" value="${event.queryStringParameters.user}">
                        <button>Submit</button>
                      </form>
                      <br>
                      <p>API response:</p>
                      <pre><code>${JSON.stringify(json, null, 4)}</code></pre>
                      <br>
                      <a href="https://github.com/Ind3xOnGitHub/vrchat_netlify_functions/blob/master/functions/get_vrchat_rank.js" target="_blank" rel="noopener">Source code</a>
                    </body>
                  </html>
                `
            })
        });
    });

    req.on('error', function(e) {
        console.error(e)
    });

    req.end()
}
