# organitza
REST API that lets you track the organizations in your world

## Live Demo

Send HTTP requests to `http://mysterious-chamber-36083.herokuapp.com` using the information below.

# API Documentation
## List organizations
`GET /v1/organizations`

Response: HTTP Status Code `200`
```
[
    {
        "_id": "5bbcf9f859801305c1ee0e12",
        "name": "University of Rochester"
    },
    {
        "_id": "5bbcf9f859801305c1ee0e14",
        "name": "United Healthcare of Arizona"
    },
]
```
When you use `code` and/or `name` as parameters, the API filters by those parameters. 
It also returns the `url` and `code` of each organization.

`GET /v1/organizations?code=UR`

Response: HTTP Status Code `200`
```
[
    {
        "_id": "5bbcf9f859801305c1ee0e12",
        "name": "University of Rochester",
        "code": "UR",
        "type": "health system",
        "url": "http://waterboy.com"
    }
]
```

`GET /v1/organizations?name=University of Rochester`

`GET /v1/organizations?code=UR&name=University of Rochester`

## Create a new organization

`type` must be one of the following values: 'employer', 'insurance', 'health system'

`name` and `code` are required

`POST /v1/organizations`
```
{
    "name": "University of Rochester",
    "description": "U of R Health System",
    "code": "UR",
    "type": "health system",
    "url": "http://rochester.edu"
}
```

Response: HTTP Status Code `200`
```
{
    "message": "success",
    "organization": {
        "_id": "5bbd3fd096362152d218fcde",
        "name": "University of Rochester",
        "description": "U of R Health System",
        "url": "http://rochester.edu",
        "code": "UR",
        "type": "health system"
    }
}
```

## Update an organization
`PUT /v1/organizations/${organizationID}`
```
{
    "name": "University of Rochester",
    "description": "U of R Health System",
    "code": "UR",
    "type": "health system",
    "url": "http://rochester.edu"
}
```

Response: HTTP Status Code `200`

`{ message: 'success' }`

## Delete an organization
`DELETE /v1/organizations/${organizationID}`

Response: HTTP Status Code `200`

`{ message: 'success' }`

# Local Development

Copy the `.env.example` file to `.env` and fill in with the appropriate values.

To run:

`node server.js`

The above command will output the local URL. You can now use HTTP requests on endpoints on that URL.

To test:

`node node_modules/lab/bin/lab -m 99999 tests/tests.js`

This repo is also a docker environment meant to be deployed to a Heroku container registry.
See https://devcenter.heroku.com/articles/container-registry-and-runtime
