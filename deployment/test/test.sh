#!/bin/bash
node foam3/tools/build.js -Pfoam3/pom,pom -Jtest --java-tests:MongoDAOTest,MongoDAOTestBenchmark --log-level:INFO -c "$@"
