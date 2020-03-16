# Nodejs test

## Info

This app has been developed using [Express.js](https://expressjs.com/) as js [Node.js](https://nodejs.org/en/) server framework to create the REST API.
It also uses two [Firebase](https://firebase.google.com/) utils:

- Firestore NoSQL database to store clients and policies data retrieved from the services provided.
- Google Cloud Functions to host and expose the express app API root endpoint.
  Data from the services is fetched using **_[Axios](https://github.com/axios/axios)_**.
  Database queries is done with the admin API from **_firebase-admin_**.

## Installing the app

The API root endpoint is exposed at [Google Cloud Functions](https://europe-west1-nodejs-test-99e75.cloudfunctions.net/api). From there you can reach the different endpoints described below.

If you want to download it just clone the repo and npm install inside the function folder of the project.
To use locally and not in a Google Cloud function you will have to add

```
app.listen(3000, () => {
  console.log(`app is running on port 3000`);
});

```

at the end of the index.js file and execute it with node index.js at the terminal. Also keep in mind that the app uses firestore NoSQL database and firebase-admin api to handle the stored data so you will have to create a firebase project, initialize firestore, create a serviceAccount inside the project settings and [initialize firebase admin](https://firebase.google.com/docs/admin/setup).

## Using the app

The app has 8 exposed endpoints 4 gets and 2 deletes. Every endpoint is reached by adding the following routes to the Google Cloud Function endpoint **_https://europe-west1-nodejs-test-99e75.cloudfunctions.net/api_**

#### Support related endpoints

**_- "/clients/store" - GET -_** This endpoint is used to fetch the clients data from the provider and store each client as a document with the client id as document id inside clients db collection.
**_- "/clients/delete" - DELETE -_** This endpoint is used to delete all the clients from the clients collection in the db.
**_- "/policies/store" - GET -_** This endpoint is used to fetch the policies data from the provider and store each policy as a document with the policy id as document id inside policies db collection.
**_- "/policies/delete" - DELETE -_** This endpoint is used to delete all the policies from the policies collection in the db.

Both clients and policies collections are already stored in the db so there is no need to delete / store in order to test the services endpoints

#### Services endpoints

##### Authentication and authorization

As stated in the code assessment, authentication and authorization is done using the user role. In order to achieve this custom middleware has been developed and it’s located at helpers/middleware.
Since there is not a real authentication server to get a token from the logged user the method that has been used is to send the user id as headers.authorization in the request (req) object when the GET request is done. The middleware intercepts the request and gets the clientId and searches for the user in the db. If the user is not in the db or the clientId has not been provided as headers.authorization a response status 401 is sent back. The middleware takes 1 argument, the role needed to access the endpoint it secures. This is a string parameter that accepts "user", "admin" and "both".
If the user is registered in the db but the role is not sufficent for the specific route a response status 403 is sent back with the insufficient authorization message.
If the user has the expected role the middleware appends the rol to the req and passes it to the endpoint handler. Each endpoint has its own handler inside the handlers.js file in handlers folder.

##### Endpoints

- **"/clients/clientId/:clientId" - GET -** This endpoint is accessible by users with the role user and admin. The :clientId section has to be an id of a registered user. Upon successful authorization the handler first checks if the user role is "user". If that's the case, it compares the user from the request with the user requested and it only responds with the user data if that is the case. Users can only get their own information. If a user is requesting another’s user information a response with error code 403 insufficient authorizations. Next the handler checks if the requested user exists in the db. If that's not the case it responds with a 404 error. If the user has admin role, the data will be delivered regardless of being the same user as the requested.
  **- "/clients/clientName/:clientName" - GET -** This endpoint has the same functionality and restrictions than the one before but this time the parameter we pass to the route is the client name of the user we want to retrieve the data.
  **- "/clients/policyId/:policyId" - GET -** This endpoint is only accessible by admins. It takes a policyId as parameter and queries the db to get first the document of the policy to extract from there the clientId related to that policy. Once the clientId is retrieved it gets the client data to sent it back. Prior to all, it checks if the policy exists.
  **- "/policies/clientName/:clientName" - GET -** The last endpoint is also only accessible by admins. As the previous ones it first checks if the param is valid, in this case if the client with the provided name exists. If it does, it gets the client id from the client document and then queries the policies collection to find the documents that matches the key clientId with the id from the client name. It returns an array with the policies related to that client name.
