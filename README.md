# OAuthv2.0 Token Dispensing Proxy

This is an example proxy that illustrates how to use Apigee Edge to dispense tokens,
for the password grant_type and also for client_credentials grant_type.

This proxy runs in Apigee and relies on a mock database of users.

The tokens dispensed here are opaque OAuth 2.0 tokens. They are not JWT.

## Using the proxy

1. Import the proxy into any Apigee organization

2. Create an API product. The API product normally wraps API proxies with metadata.
For the purposes of this example, your API product need not contain any API proxies.

3. Create a Developer within Apigee 

4. Create a Developer App within Apigee, associated to the new Developer, and with
   authorization to use the API product.

5. View and copy the client_id and client_secret

6. invoke the API proxy to retrieve a token via password grant_type as:
   ```
   ORG=myorg
   ENV=myenv
   curl -i -X POST \
     -H 'content-type: application/x-www-form-urlencoded' \
     -u ${client_id}:${client_secret} \
     https://$ORG-$ENV.apigee.net/oauth2/pwd/token \
     -d 'grant_type=password&username=dino@apigee.com&password=IloveAPIs'
   ```

   The username and password are validated against a static list of
   users, implemented in a JS callout. In a real system, you will replace this with a
   callout to a remote system (LDAP or other) to validate the credentials.


   The response you see will look like this:
   ```json
   {
     "refresh_token_expires_in": 28799,
     "user_roles": "read,edit",
     "issued_at": 1599168472769,
     "client_id": "FbqTatIjiSCqhC3zGrdqSGFGiHlE8MKY",
     "access_token": "Iibt41rSAH3RLAsbtBbyOL4OFdjw",
     "refresh_token": "gpYZY5IA5V0lm6ACVmwi67LsfLwV2Gjf",
     "grant_type": "password",
     "refresh_token_issued_at": 1599168472769,
     "authenticated_user": "dino@apigee.com",
     "expires_in": 1799,
     "issued": "2020-09-03T21:27:52.769Z",
     "refresh_token_issued": "2020-09-03T21:27:52.769Z",
     "expires_at": 1599170271769,
     "expires": "2020-09-03T21:57:51.769Z",
     "refresh_token_expires_at": 1599197271769,
     "refresh_token_expires": "2020-09-04T05:27:51.769Z"
   }
   ```

   The available username and password that you pass can be one of these pairs:

   * dino@apigee.com: IloveAPIs
   * don@knuth.com: Recursion1
   * albert@einstein.us: Relativity

   When you login as different users, you will see different roles returned in the user-roles property of the response payload.

7. invoke the API proxy to retrieve a token via client_credentials grant_type as:
   ```
   curl -i -X POST \
     -H 'content-type: application/x-www-form-urlencoded' \
     -u ${client_id}:${client_secret} \
     https://$ORG-$ENV.apigee.net/oauth2/cc/token \
     -d 'grant_type=client_credentials'
   ```
   You will see similar responses to the above, but without the user-specific
   information in the response payload. It will look like this:
   ```json
   {
     "issued_at": 1599168711253,
     "client_id": "FbqTatIjiSCqhC3zGrdqSGFGiHlE8MKY",
     "access_token": "Vp4u5Rmp22OnXshf5EA6gRGbNH2i",
     "grant_type": "client_credentials",
     "expires_in": 1799,
     "issued": "2020-09-03T21:31:51.253Z",
     "expires_at": 1599170510253,
     "expires": "2020-09-03T22:01:50.253Z"
   }
   ```


## Modifying the proxy

You can modify the API proxy to extend the mock database of users, adding users or adding fields for each user.  See
[userDB.js](apiproxy/resources/jsc/userDb.js) for information. It should be obvious.
If you want additional fields to appear in the OAuth token response, then you also need to
modify [validateUser.js](apiproxy/resources/jsc/validateUser.js) to set the appropriate variable into the context, and also modify [OAuthV2-GenerateAccessToken-PG.xml](apiproxy/policies/OAuthV2-GenerateAccessToken-PG.xml) to set an additional custom attribute. this should also be pretty obvious.

## Commentary

This API proxy dispenses opaque oauth tokens. The attributes associated to the
dispensed tokens are stored in the key-management database within Apigee
Edge. The API publisher has the ability to curate or adjust the response to
requests for tokens. You could, for example, deliver a JSON payload with only
the token and the expiry. This example provides lots of additional
information in the response.

These tokens are not JWT. JWT describes a standard way to format self-describing
tokens.  Apigee can generate and return JWT; that function in much the same
way as the opaque oauth tokens shown here. I haven't implemented that in this
example API Proxy.

These tokens are not delivered via an OpenID Connect flow. OpenID connect
describes an authentication flow on top of the OAuth 2.0 authorization
framework. You can configure Apigee to render JWT as a result of an OpenID Connect
flow. I haven't implemented that in this example API Proxy.
