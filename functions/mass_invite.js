const fs = require('fs');

exports.handler = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: fs.readFileSync(__dirname + '/mass_invite_template.html', 'utf8')
  })
}
