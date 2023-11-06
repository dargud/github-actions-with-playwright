// const continueUri = {
//     "dev": "https://connect-int.unity.com/ed-pd/login",
//     "stage": "https://connect-staging.unity.com/ed-pd/login"
// };

// Login to get the Admin idToken
// First step
// const responseFirstStep = await request.post(`https://identitytoolkit.googleapis.com/v1/accounts:createAuthUri?key=${key.stage}`, {
//     headers: {
//         authority: "identitytoolkit.googleapis.com",
//         origin: origin.stage
//     },
//     data: {
//         "identifier": adminCredentials.email,
//         "continueUri": continueUri.stage
//     }
// });
// expect(responseFirstStep.status()).toBe(200);

// Third step 
// const responseThirdStep = await request.post(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${key.stage}`, {
//     headers: {
//         authority: "identitytoolkit.googleapis.com",
//         origin: origin.stage
//     },
//     data: {
//         "idToken": idToken
//     }
// });
// expect(responseThirdStep.status()).toBe(200);   

// function getRandomInt(max) {
//     return Math.floor(Math.random() * max);
// };