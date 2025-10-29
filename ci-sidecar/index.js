const tailfile = require('@logdna/tail-file')
const identity = require("oci-identity");
const common = require("oci-common");
const loggingingestion = require("oci-loggingingestion");
const objectstorage = require("oci-objectstorage");
const fs = require("fs");

async function start() {

const log_ocid = process.env.log_ocid;
console.log("OCI LOG:" + log_ocid);

const log_file = process.env.log_file;
console.log("LOG FILE:" + log_file);

const www_path = process.env.www_path;
console.log("WWW DATA:" + www_path);

const bucket = process.env.os_bucket;
console.log("OS BUCKET:" + bucket);

const reloadDelay = process.env.www_reload_delay;
console.log("OS BUCKET RELOAD (ms):" + reloadDelay);

const logHeader = process.env.log_header;
console.log("LOG HEADER:" + logHeader);

//const provider = new common.ConfigFileAuthenticationDetailsProvider("~/.oci/config");
const provider = common.ResourcePrincipalAuthenticationDetailsProvider.builder();

const logClient = new loggingingestion.LoggingClient({ authenticationDetailsProvider: provider });

const osClient = new objectstorage.ObjectStorageClient({ authenticationDetailsProvider: provider });

const nsRequest = {};
const nsResponse = await osClient.getNamespace(nsRequest);
const namespace = nsResponse.value;

mount(osClient, namespace, bucket, www_path, reloadDelay);
    
startTail(logClient, log_ocid, log_file, logHeader);

async function startTail(logClient, log_ocid, log_file, logHeader)
{
  const tail = new tailfile(log_file, {encoding: 'utf8'})
  .on('data', (chunk) => {
    //console.log(`${chunk}`)
    writeLog(logClient, logHeader, logHeader, log_file, `${chunk}`)
  })
  .on('tail_error', (err) => {
    console.error('TailFile had an error!', err)
  })
  .on('error', (err) => {
    console.error('A TailFile stream error was likely encountered', err)
  })
  .start()
  .catch((err) => {
    console.log("Cannot start.  Does " + log_file + "  exist?")
    setTimeout(function() {
        console.log("Trying again to open " + log_file + " ..");
        startTail(logClient, log_ocid, log_file, logHeader);
    }, 5000);
  });
 }
}

async function mount(osClient, namespace, bucket, www_path, reloadDelay)
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
    await downloadFile(osClient, namespace, bucket, files[i], www_path);
 }
 if(parseInt(reloadDelay) > 0) {
  setTimeout(function() {
    mount(osClient, namespace, bucket, www_path, reloadDelay);
  }, parseInt(reloadDelay));   
 } else {
    console.log("No reloading of bucket " + bucket + " since reload delay was " + reloadDelay);
 }
}

async function downloadFile(osClient, namespace, bucket, file, path)
{
   const getObjectRequest = {
            namespaceName: namespace,
            bucketName: bucket,
            objectName: file.name
    };
    const getObjectResponse = await osClient.getObject(getObjectRequest);
    //console.log(getObjectResponse);
    if(getObjectResponse.contentType.indexOf("directory") > 0) {
      //console.log(file.name + " is a directory, creating .. ");
      //console.log(path + "/" + file.name);
      fs.mkdir(path + "/" + file.name, (err) => {
        //if (err) console.log(err);
      });
    } else {
     var chunks = [];
     for await (let chunk of getObjectResponse.value) {
         chunks.push(chunk);
     }
     var buffer = Buffer.concat(chunks);
     //console.log(buffer.toString());
     //console.log(path + "/" + file.name);
     if(file.name.indexOf(".htm") >  0)
     {
      await fs.writeFile(path + "/" + file.name, buffer.toString(), 'utf8', (err) => {
       if (err) {
         //console.log('Error writing file:', err);
         return;
       }
       //console.log('File written successfully to' + path + "/" + file.name);
       });
     } else {
       await fs.writeFile(path + "/" + file.name, buffer, null, (err) => {
       if (err) {
         //console.log('Error writing file:', err);
         return;
       }
       //console.log('File written successfully to' + path + "/" + file.name);
       });
     }
  } 
}

async function writeLog(logClient, log_ocid, subject, type, data)
{
  try {
        const putLogsDetails = {
          specversion: "1.0",
          logEntryBatches: [
            {
              entries: [
                {
                  id: subject,
                  data: data
                }
              ],
              source: "nginx-logging-sidecar",
              type: type,
              subject: subject
            }
          ]
        };
        var putLogsRequest = loggingingestion.requests.PutLogsRequest = {
          logId: log_ocid,
          putLogsDetails: putLogsDetails,
          timestampOpcAgentProcessing: new Date()
        };
        const putLogsResponse = await logClient.putLogs(putLogsRequest);
        //console.log("Wrote to log succesfully");
  } catch (err) {
    console.error('Log error: ' + err.message);
  }
}

start(); 
