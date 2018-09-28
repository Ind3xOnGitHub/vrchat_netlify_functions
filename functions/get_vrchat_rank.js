const https = require('https')

const { VRCHAT_USER, VRCHAT_PASSWORD } = process.env

exports.handler = function(event, context, callback) {
  if (!event.queryStringParameters.user) {
    callback(null, {
      statusCode: 200,
      body: `
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Your VRChat rank</title>
        </head>

        <body>
          <form method="GET" action="">
            <label for="user_input">Enter your user name or user ID:</label>
            <input id="user_input" type="text" name="user">
            <button>Submit</button>
          </form>
          <br>
          <br>
          <a href="https://github.com/Ind3xOnGitHub/vrchat_netlify_functions/blob/master/functions/get_vrchat_rank.js" target="_blank" rel="noopener">Source code</a>
        </body>
      </html>
      `
    })

    return
  }

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
    res.setEncoding('utf8')
    res.on('data', chunk => {
      const json = JSON.parse(chunk)

      if (json.error && json.error.status_code === 404) {
        callback(null, {
          statusCode: 200,
          body: `
          <html>
            <head>
              <meta charset="UTF-8">
              <title>Your VRChat rank</title>
            </head>

            <body>
              <p>User ${searchFor} not found. Try entering your user id if your name has some unusual characters in it.</p>

              <form method="GET" action="">
                <label for="user_input">Enter your user name or user ID:</label>
                <input id="user_input" type="text" name="user">
                <button>Submit</button>
              </form>
              <br>
              <br>
              <a href="https://github.com/Ind3xOnGitHub/vrchat_netlify_functions/blob/master/functions/get_vrchat_rank.js" target="_blank" rel="noopener">Source code</a>
            </body>
          </html>
          `
        })

        return
      } else if (json.error) {
        console.error(json.error)
        return
      }

      const ranks = {
        0: 'Visitor',
        1: 'New User',
        2: 'User',
        3: 'Known User',
        4: 'Trusted User',
        5: 'Veteran User'
      }

      let currentRank = 0
      if (json.tags.indexOf('system_trust_basic') >= 0) currentRank = 0
      if (json.tags.indexOf('system_trust_intermediate') >= 0) currentRank = 1
      if (json.tags.indexOf('system_trust_known') >= 0) currentRank = 2
      if (json.tags.indexOf('system_trust_trusted') >= 0) currentRank = 3
      if (json.tags.indexOf('system_trust_veteran') >= 0) currentRank = 4
      if (json.tags.indexOf('system_trust_legend') >= 0) currentRank = 5

      console.log(`${searchFor} (${json.displayName})`, ranks[currentRank])

      callback(null, {
        statusCode: 200,
        body: `
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Your VRChat rank</title>

            <meta property="og:title" content="VRChat rank of ${json.displayName}">
            <meta property="og:description" content="${ranks[currentRank]}${currentRank === 5 ? ' (will be shown as Trusted User ingame)' : ''}\n\nKeep in mind that the Trust and Safety system is still in development and therefore the ranks can change any time and may be not fully reasonable.">
          </head>

          <body>
            <p>Rank of ${json.displayName}: <strong>${ranks[currentRank]}</strong>${currentRank === 5 ? ' (will be shown as Trusted User ingame)' : ''}</p>
            <p><small>Keep in mind that the Trust and Safety system is still in development and therefore the ranks can change any time and may be not fully reasonable.</small></p>
            <br>
            <form method="GET" action="">
              <label for="user_input">Enter your user name or user ID:</label>
              <input id="user_input" type="text" name="user" value="${event.queryStringParameters.user}">
              <button>Submit</button>
            </form>
            <br>
            <p>API response:</p>
            <pre><code>${JSON.stringify(json, null, 4)}</code></pre>
            <br>
            <p>Current mapping (unofficial):</p>
            <code>
              system_trust_legend = Veteran User (will be shown as Trusted User ingame)<br>
              system_trust_veteran = Trusted User<br>
              system_trust_trusted = Known User<br>
              system_trust_known = User<br>
              system_trust_intermediate = New User<br>
              system_trust_basic = Visitor
            </code><br>
            <br>
            <br>
            <a href="https://github.com/Ind3xOnGitHub/vrchat_netlify_functions/blob/master/functions/get_vrchat_rank.js" target="_blank" rel="noopener">Source code</a>
          </body>
        </html>
        `
      })
    })
  })

  req.on('error', function(e) {
    console.error(e)
  })

  req.end()
}
