/**
 * @license
 * Copyright 2025 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.dao.mongodb',
  name: 'MongoDBService',

  documentation: 'Context service for MongoDAOs to acquire connection specs.',

  // Future: MongoDB supports change notification.  A listener can be
  // notified of database or collection chaanges.  This can be used
  // in a cluster setting to update the MDAOs when an change is
  // reported.  
  // see: https://www.mongodb.com/docs/drivers/java/sync/current/usage-examples/watch/
  // When the MongoDAOs startup they could register themselves with this
  // service which could in turn issue the appropriate find and put
  // operations with the updated data. 
  
  implements: [
    'foam.core.COREService'
  ],

  javaImports: [
    'foam.core.logger.Logger',
    'foam.core.logger.Loggers',
    'foam.lang.X',
    'com.mongodb.*',
    'com.mongodb.client.MongoDatabase',
    'com.mongodb.client.MongoClient',
    'com.mongodb.client.MongoClients',
    'org.bson.BsonDocument',
    'org.bson.BsonInt64',
    'org.bson.Document',
    'org.bson.conversions.Bson',
  ],

  javaCode: `
    private MongoClient client_;
    private void setClient(MongoClient client) { client_ = client; }
    private MongoClient getClient() { return client_; }
  `,

  properties: [
    {
      name: 'dbName',
      class: 'String',
      value: 'foam'
    },
    {
      name: 'url',
      class: 'String',
      value: 'mongodb://localhost:27017/'
    }
  ],

  methods: [
    {
      documentation: `Acquire a database connection.
collectionName is optional, and intended for systems which may
route particular collections to different databases.`,
      name: 'getDatabase',
      args: 'X x, String collectionName',
      javaType: 'MongoDatabase',
      javaCode: `
      return getClient().getDatabase(getDbName());
      `
    },
    {
      name: 'start',
      javaCode: `
        initialize(getX());
      `
    },
    {
      name: 'reload',
      javaCode: `
        MongoClient client = getClient();
        initialize(getX());
        if ( client != null ) {
          client.close();
        }
      `,
    },
    {
      name: 'stop',
      javaCode: `
        MongoClient client = getClient();
        if ( client != null ) {
          client.close();
        }
      `,
    },
    {
      name: 'initialize',
      args: 'X x',
      javaCode: `
        Logger logger = Loggers.logger(x, this, getDbName());
        ServerApi serverApi = ServerApi.builder()
                .version(ServerApiVersion.V1)
                .build();
        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(getUrl()))
                .serverApi(serverApi)
                .build();

        // Create a new client and connect to the server
        MongoClient mongoClient = null;
        try {
          mongoClient = MongoClients.create(settings);
          MongoDatabase database = mongoClient.getDatabase(getDbName());
          try {
            // Send a ping to confirm a successful connection
            Bson command = new BsonDocument("ping", new BsonInt64(1));
            Document commandResult = database.runCommand(command);
            logger.info("UP");
            setClient(mongoClient);
          } catch (MongoException e) {
            logger.error("DOWN, ping command failed", e);
            mongoClient.close();
          }
        } catch (Exception e) {
          Loggers.logger(x, this).error("DOWN", e);
          if ( mongoClient != null ) {
            mongoClient.close();
          }
        }
      `
    }
  ]
})
