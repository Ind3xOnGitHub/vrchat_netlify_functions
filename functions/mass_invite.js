exports.handler = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: `
    <html>
      <head>
        <meta charset="UTF-8">
        <title>VRChat mass invite</title>
        <meta property="og:title" content="VRChat mass invite">
        <meta property="og:description" content="Invite all your friends with a custom message.">
      </head>
      
      <body>
        <h1>Mass invite</h1>
        <p>Invite all your friends with a custom message.</p>
        <p><small>Disclaimer: The API neeeds your VRChat credentials to be able to see your friends. This site therefore asks for them. None of your input will be send to my servers since this site completely runs in your browser locally. The credentials are only getting used to directly communicate with the VRChat API. You can check the source code of this site yourself or ask any of your developer friends if it can be trusted or not.</small></p>
        <br>
        <p>1. To be able to use this API you have to friend yourself. Enter your VRChat credentials and click on "friend yourself". Then accept the friend request ingame.</p>
        <form method="GET" action="#" onsubmit="formSubmitted()">
          <label for="username_email">Enter your user name or e-mail address</label>
          <input id="username_email" type="text" name="username">
          <label for="password">Enter your password</label>
          <input id="password" type="text" name="password">
          <button>Friend yourself</button>
        </form>
        <br>
        <p>2. Show online friends</p>
        <button onclick="showOnlineFriends()"></button>
        <br>
        <p>3. Enter your custom message and select the friends you want to invite</p>
        <form method="GET" action="#" onsubmit="invite()">
        <button>Invite</button>
        </form>
        <br>
        <p>Log:</p>
        <textarea cols="30" rows="10" readonly></textarea>
        <br>
        <br>
        <a href="https://github.com/Ind3xOnGitHub/vrchat_netlify_functions/blob/master/functions/mass_invite.js" target="_blank" rel="noopener">Source code</a>

        <script>
          function formSubmitted(e) {
            e.preventDefault()
            console.log(e)

            // const data = new URLSearchParams();
            // data.append('username_email', e);
            // data.append('password', e);
            
            // fetch('https://api.vrchat.cloud/login', {
            //   method: 'POST',
            //   body: data,
            //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            //   credentials: 'include'
            // })
            //   .then(response => {
            //     const rawCookies = document.cookie.split(';')
            //     const cookies = {}
            //     rawCookies.forEach(cookie => {
            //       cookie.split('=')
            //       cookies[cookie[0]] = cookie[1]
            //     })
            //   })
          }

          function showOnlineFriends(e) {
            e.preventDefault()
            console.log(e)
            
          }

          function invite(e) {
            e.preventDefault()
            console.log(e)
            
          }
        </script>
      </body>
    </html>
    `
  })
}
