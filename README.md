<h1>MongoDAO</h1>
<p>This repository provides a FOAM DAO which is backed by a MongoDB database, refered to as a MongoDAO.  Conceptually this is very similar to JDAO which is a DAO backed by a file system journal.</p>

<h2>Important</h2>
A MongoDB is not a journal and hence does not support models which calculate non-persistent property values during replay.

<h2>Requirements</h2>
<p>Obviously, a MongoDB must be accessible.</p>
<h3>MacOS</h3>
<p>MongoDB installation</p>
https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/
<br/>
<p>Compass UI for DB inspection</p>
<code>brew tap mongodb/brew</code><br/>
https://www.geeksforgeeks.org/how-to-install-mongodb-compass-on-macos/

<h2>Configuration</h2>
<p>Connection settings are managed via the MongoDBService, found through CSpec service <b>mongoDBService</b>.<br/>
Edit the <b>url</b> property to add <b>username</b> and <b>password</b>.<br/>
See baseline at <code>src/foam/dao/mongodb/services.jrl</code>
Copy and update in application deployment/, or edit at runtime. Changes to mongoDBService should take effect immediately.
</p>

<h2>Testing</h2>
<p>Run MongoDAO specific tests cases with:<br/>
<code>deployment/test/test.sh</code>
</p>
<p><b>NOTE: This assumes foam3 and foam-mongodb modules are co-located</b>. In other words, your FOAM based application has cloned both foam3 and foam-mongodb at the same level.</p>

<h2>Inclusion in Project</h2>
<p>The repository contains two top level poms:
<ol>
<li><b>pom: explicit configuration</b> - configures the application for MongoDB, but leaves all EasyDAO configuration to caller. See below.</li>
<li><b>pom-all: auto configuration</b> - configures the application for MongoDB, but also refines EasyDAO such that all DAOs are configured to use MongoDAO</li>
</ol>

<h3>pom - explicite configuration</h3>
The normally named pom.js prepares the application to use MongoDB, but leaves EasyDAO configuration to the caller.<br/>
To configure EasyDAO to use a MongoDAO rather than a JDAO:
<ul>
<li>replace setJournalType with setDatabaseType("MONGODB")</li>
<li>replace setJournalName with setDatabaseTableName("some_unique_name")</li>
</ul>

<h3>pom-all - auto configuration</h3>
MongoDAO installs itself via refinement to EasyDAO.<br/>
A MongoDAO will be installed for each EasyDAO setup which satisfies the following:<br/>
<ol>
<li>does not define an InnerDAO</li>
<li>is not ReadOnly</li>
<li>is not WriteOnly</li>
</ol>
</ul>

<h2>DAO Stack Configuration</h2>
The DAO stack consists of an MDAO backed by the MongoDAO.<br/>
Finds and selects are served from the MDAO, puts are written to both.<br/>
This maintains the normal FOAM behaviour of runtime data superseding shipped journal data.<br/>
On startup .0 journals are read into the MDAO, and then the DB is read into the MDAO.

<h2>Ingesting Existing Data</h2>
<p>Run script <b>MongoDBLoad</b> to replay runtime journals into MongoDB.</p>
<ol>
<li>Configure system to use MongoDB by referencing the mongdb pom <b>-Pfoam-mongodb/pom</b> (or pom-all)</li>
<li>Start system</li>
<li>Inspect that system is connected to MongoDB</li>
<li>Execute script <b>MongoDBLoad</b></li>
<li>Restart</li>
</ol>
<p>See further notes in <code>src/foam/dao/mongodb/LoadingAgent</code></p>

<h2>Cluster / Replica Sets</h2>
<p>MongoDB supports change notification.  A listener can be
notified of database or collection changes in a <b>Replica Set</b></p>
see: https://www.mongodb.com/docs/drivers/java/sync/current/usage-examples/watch/
<p>What is unknown is if the event carries information to
distinguish each host, else we'll get events from ourselves.
</p>
<p>Each MongoDAO or DDAO, on startup, could register itself with the MongoDBService.
The MongoDBService could implement the <b>watch</b> operation and update
the appropriate MDAO.</p>
