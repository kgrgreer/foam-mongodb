/**
 * @license
 * Copyright 2025 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.POM({
  name: 'foam-mongodb',

  projects: [
    { name: 'src/foam/dao/mongodb/pom' }
  ],

  javaDependencies: [
    'org.mongodb:mongodb-driver-sync:5.3.1'
  ]
})
