#!/bin/bash
node foam3/tools/build.js -Pfoam3/pom,pom -Jtest -TMongoDAOTest,MongoDAOTestBenchmark -LINFO -c "$@"
