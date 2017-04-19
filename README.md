# loopback-lookup-server

Objective - Create a lookup server with in-memory caching for a REST API using [loopback](https://loopback.io/)

# Overview
This example demonstrates the use of loopback for creating REST services. It also demonstrates the basic usage of [loopback-connector-rest](https://github.com/strongloop/loopback-connector-rest). 

The example has two servers
# api-server
This is a REST service that doles out a product catalog. Using loopback to create a REST application for the products is quite simple, the following are the commands that were used in getting this setup. 
1. ### `lb app api-server`
Creates api-server application with the requisite node-js code. A series of questions regarding config are requested - for the type of application we use the hello-world which will generate the requisite REST and Datasource related code.
![lb app api-server](https://github.com/spkash-co-in/loopback-lookup-server/blob/master/lbapp.png)

2. ### `lb model` 
Creates the model objects, a simple product object would look like below
![lb app model](https://github.com/spkash-co-in/loopback-lookup-server/blob/master/lbmodel.png)

3. ### REST endpoint generated
We can run the server at this stage with `node .` command in the api-server folder. Accessing `http://localhost:3000/explorer/#/product` gives us the explorer that we can use to work with the REST endpoint generated for the model. 
![product REST endpoint](https://github.com/spkash-co-in/loopback-lookup-server/blob/master/productsREST.png)

# api-gateway
This is a look-up service that demonstrates the usage of [loopback-connector-rest](https://github.com/strongloop/loopback-connector-rest). It exposes a single GET endpoint to the external user for looking up a product by id. On the back-end it connects to the `api-service` using the rest-connector loopback provides.  

1. ## `lb app api-gateway`
This time we will create an api-server that will connect to our products service. The config options will look as shown below. One point to note is that the generated code here will also be using port 3000, but we change this to 3020 in config.json as our products service already runs on port 3000.
![lb app gw](https://github.com/spkash-co-in/loopback-lookup-server/blob/master/lbapp-gw.png)

2. ## `lb datasource`
The next step is to create a datasource that will hook on to our products service. The config options should look as shown below
![lb gw datasource](https://github.com/spkash-co-in/loopback-lookup-server/blob/master/lbdatasource.png)

3. ## Exposing our datasource
The datasource we created needs to be updated to expose the GET method of our products service. This is done by updating the `operations` section of the datasource. There are two points to note 
* ### template
This section details the outbound REST connection that will be made from this service. We provide it with the GET as method and the url we will be using.
* ### functions
This section details the internal nodejs handle that will can be used to operate the REST endpoint exposed in the template section. In this example we are exposing `getProducts` method which takes in a `productId` which is passed a part of the url path as defined in the template section. 
![product REST datasource](https://github.com/spkash-co-in/loopback-lookup-server/blob/master/productDataSource.png)

4. ## ProductWrapper
We now create the model that exposes a remote method on this api-gateway. While generating this model we use the config options to mention that it is not connected to any datasource and will use the generic Model type provided by loopback. This will help create a non-persistent model object that work well for our look-up purpose. Again there are two points to note
* ### lookup 
We create our lookup function which essentially calls the productService.getProducts datasource method we defined in last section. A simple in-memory cache map serves our purpose of caching a first-time lookup on a productId.  

![lookup method](https://github.com/spkash-co-in/loopback-lookup-server/blob/master/lookup.png)

* ### remoteMethod
Now we create the remote method that hooks with our lookup function that we want expose on the gateway

![lookup method remote](https://github.com/spkash-co-in/loopback-lookup-server/blob/master/lookup-remote.png)

# Run Instructions
## Run api-server
1. Go to api-server folder
2. Run `npm install`
3. Run `node .`
4. Browse `http://localhost:3000/explorer` for products REST service

## Run api-gateway
1. Go to api-gateway folder
2. Run `npm install`
3. Run `node .`
4. Browse `http://localhost:3020/explorer` for products lookup service
5. Use the only exposed GET lookup method by providing the productId 

![prod lookup GET ](https://github.com/spkash-co-in/loopback-lookup-server/blob/master/prodLookupGET.png)

On the terminal you can check that the REST endpoint is called only one the first lookup, any further lookups are doled out from the cache.

![product lookup from gateway](https://github.com/spkash-co-in/loopback-lookup-server/blob/master/productLookup.png)
