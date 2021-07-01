const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIEN_ID);

const googleverify = async (id_token = '') => 
{
  const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIEN_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const {name:nombre,
        picture:imagen,
        email:correo} = ticket.getPayload();

  return {nombre, imagen, correo}
}

module.exports =
{
    googleverify
}