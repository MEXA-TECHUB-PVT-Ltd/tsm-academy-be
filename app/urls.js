// urls.js
const ApiUrl='http://localhost:3000'//website url
const ApiUrl_Admin='http://localhost:3001' //admin url 
 const ApiUrl_User='http://localhost:3002' //admin url 



// const baseUrl='https://64f08b5d1f93a1121bb51a0f--venerable-syrniki-24ae89.netlify.app'


const urls = {
    email_verification_url: `${ApiUrl}/verifyEmail`,
    login_url: `${ApiUrl}/login`,
    login_url_admin: `${ApiUrl_Admin}/login`,
    login_url_user: `${ApiUrl_User}/login`,


    

    // Add more URLs here if needed
  };
  
  module.exports = urls;

