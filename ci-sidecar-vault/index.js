const identity = require("oci-identity");
const common = require("oci-common");
const secrets = require("oci-secrets");
const fs = require("fs");
const objectstorage = require("oci-objectstorage");
const pg = require('pg');
const format = require('pg-format');

const { Pool, Client } = pg;
var pool; 

var connectionString ;

async function start() {

    const secretOCID = process.env.secret_ocid;
    console.log("OCI VAULT SECRET:" + secretOCID);
    
    const secretsFile = process.env.secrets_file;
    console.log("SECRETS FILE:" + secretsFile);
    
    const bucket = process.env.os_bucket;
    console.log("OS BUCKET:" + bucket);

    const reloadDelay = process.env.datapump_reload_delay;
    console.log("OS BUCKET DATAPUMP RELOAD (ms):" + reloadDelay);
    
    //const provider = new common.ConfigFileAuthenticationDetailsProvider("~/.oci/config");
    const provider = common.ResourcePrincipalAuthenticationDetailsProvider.builder();
    //const provider = await new common.InstancePrincipalsAuthenticationDetailsProviderBuilder().build();

    const secretsClient = new secrets.SecretsClient({ authenticationDetailsProvider: provider });
    const osClient = new objectstorage.ObjectStorageClient({ authenticationDetailsProvider: provider });

    const nsRequest = {};
    const nsResponse = await osClient.getNamespace(nsRequest);
    const namespace = nsResponse.value;

    await mount(secretsClient, secretOCID, secretsFile);
    datapump(osClient, namespace, bucket, reloadDelay);
}

async function mount(secretsClient, secretOCID, secretsFile)
{
    try {
        const getSecretBundleRequest = {
            secretId: secretOCID,
            // Optional: specify the stage (CURRENT, PENDING, LATEST) or version number
            stage: "CURRENT" 
        };
        const response = await secretsClient.getSecretBundle(getSecretBundleRequest);
        const secretBundleContent = response.secretBundle.secretBundleContent;
        if (secretBundleContent.content) {
            const decodedContent = Buffer.from(secretBundleContent.content, 'base64').toString('utf8');
            console.log("Successfully retrieved and decoded secret content:");
            console.log(decodedContent);
            await fs.writeFile(secretsFile, decodedContent, null, (err) => {
                if (err) {
                 console.log('Error writing file:', err);
                 return;
                }
                console.log('File written successfully to ' + secretsFile);
                var connectionString = decodedContent;
                try  {

                   pool = new Pool({
                      connectionString, // Connection URL to PG
                      ssl: { rejectUnauthorized: false }
                   });
                } catch (ex)
                {
                    console.log(ex.message);
                }
            });
        } else {
            console.log("Secret content format not recognized or empty.");
        }
    } catch (error) {
        console.error("Failed to retrieve secret content:", error);
    }
}

async function datapump(osClient, namespace, bucket, reloadDelay)
{
 const listObjectsRequest = {
      namespaceName: namespace,
      bucketName:  bucket
 };
 const listObjectsResponse = await osClient.listObjects(listObjectsRequest);
 //console.log(listObjectsResponse.listObjects.objects);
 files = listObjectsResponse.listObjects.objects;
 for(i=0; i < files.length; i++) {
    //console.log(files[i].name);
    await processDataFile(osClient, namespace, bucket, files[i]);
 }
 if(parseInt(reloadDelay) > 0) {
  setTimeout(function() {
    datapump(osClient, namespace, bucket, reloadDelay);
  }, parseInt(reloadDelay));   
 } else {
    console.log("No reloading of data files from bucket  " + bucket + " since reload delay was " + reloadDelay);
 }
}

async function processDataFile(osClient, namespace, bucket, file)
{
   const getObjectRequest = {
            namespaceName: namespace,
            bucketName: bucket,
            objectName: file.name
    };
    const getObjectResponse = await osClient.getObject(getObjectRequest);
    //console.log(getObjectResponse);
    var chunks = [];
    for await (let chunk of getObjectResponse.value) {
         chunks.push(chunk);
    }
    var buffer = Buffer.concat(chunks);
    //console.log(path + "/" + file.name);
    if(pool)
    {
        const client = await pool.connect()
        try {
          await client.query('BEGIN');
          client.query('DELETE FROM CARS');

          var data = buffer.toString();
          var values = data.split('\n') // split string to lines
                       .map(e => e.trim()) // remove white spaces for each line
                       .map(e => e.split(',').map(e => e.trim())); // split each line to array
          console.log("Importing data to DB:");
          console.log(values);
          client.query(format('INSERT INTO cars (id, name, price) VALUES %L', values),[], (err, result)=>{
              if(err) console.log(err);
              if(result) console.log("Rows processed:" + result.rowCount);
              if(!err) console.log('File ' + file.name + ' processed successfully to database');
          });
          await client.query('COMMIT');
        } catch (e) {
          await client.query('ROLLBACK');
          throw e
        } finally {
          client.release();
        }
    } else {
        console.log('ERROR: No pooled database connection available');
    }
}

start();