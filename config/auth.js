module.exports = {
  facebook_auth: {
    client_id: process.env.FB_CLIENT_ID,
    client_secret: process.env.FB_CLIENT_SECRET,
    callback_url: '/auth/facebook/callback'
  }
}