import axios from 'axios';

export const SSOAuth = {
  // Returns a promise that fulfills if this user mail is valid.
  validateAuthData: async authData => {
    try {
      const response = await axios.get('https://osl-jacksonv2.vercel.app/api/oauth/userinfo', {
        headers: {
          Authorization: `Bearer ${authData.access_token}`,
        },
      });
      console.log('response.data.id ', response.data.email);
      console.log('authData.id', authData.id);
      if (response.data && response.data.id && response.data.email === authData.id) {
        return;
      }
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'SSO auth is invalid for this user.');
    } catch (error) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'SSO auth is invalid for this user.');
    }
    // return request('userinfo', authData.access_token).then(response => {
    //   if (response && response.id && response.id == authData.id) {
    //     return;
    //   }
    //   throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'SSO auth is invalid for this user.');
    // });
  },

  // Returns a promise that fulfills if this app id is valid.
  validateAppId: () => {
    return Promise.resolve();
  },
};
// A promisey wrapper for api requests
// function request(path, access_token) {
//   return httpsRequest.get({
//     host: 'https://osl-jacksonv2.vercel.app',
//     path: '/api/oauth/' + path,
//     headers: {
//       Authorization: 'Bearer ' + access_token,
//     },
//   });
// }
