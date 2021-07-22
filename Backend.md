# Robin Backend

## Rest API
The backend is hosted on [Heroku](https://robinrestapi.herokuapp.com/api-docs/#/). Currently, all of the requests are wrappers to Github's api. However, further development of Robin across multiple platforms can greatly benefit from this. Specifically, generalized requests and actions can be created as API for different implementations on different platforms.

## Authorization
Github requests require a Personal Access Token that can be generated in developper settings when logged into a Github account. Robin has its own Personal Access Token that was generated from a Github account that is meant to repersent Robin on Github. However, Robin's token is only valid public requests. For more requests that require user authentication, Robin will need the user's Personal Access Token. There were two implementations but OAuth was ultimately the final choice:

#### Initial Design
This design comes with a higher risk and responsbility to keep the user's Personal Access Token safe.
- Token was directly inputted from the user through the Discord interaction between the user and Robin.
- The token was then encrypted using AES-256 and sent to Heroku where the wrapper API was hosted.
- The token was then decrypted and used in the request to Github's API.


#### Current Design
This design relays the responsbility and risk to Github.
- Through Github, Robin was registered as an OAuth app in the developper settings.
- The client ID and Secret for the app was stored in Heroku.
- A response route was made for the Authorization callback after the user signed in through the Github link.
- The Github link to sign in, which included the client_id and permissions was given to the user through the Discord interaction between the user and Robin.
- Once the user signed in, the only place that the token is stored is in the backend once it is recieved through the Authorization callback url.


## Limitations
The backend does not have any database support so it can not handle more than one user at a time. Future work would include:
- Setting up a database to store user to personal access tokens.
- Creating logic for switching between tokens when making requests
- Moving storage of repo name and owner name per user to newly created database.
