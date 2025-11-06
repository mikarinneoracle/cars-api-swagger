const identity = require("oci-identity");
const common = require("oci-common");
const objectstorage = require("oci-objectstorage");

const fs = require("fs");

async function start() {
    const configPath = process.env.config_path;
    console.log("PATH:" + configPath);
    const bucket = process.env.config_bucket;
    console.log("BUCKET:" + bucket);
    const reloadDelay = process.env.reload_delay;
    console.log("OS BUCKET CONFIG RELOAD (ms):" + reloadDelay);

    //const provider = new common.ConfigFileAuthenticationDetailsProvider("~/.oci/config");
    const provider = common.ResourcePrincipalAuthenticationDetailsProvider.builder();

    const osClient = new objectstorage.ObjectStorageClient({ authenticationDetailsProvider: provider });
    
    const nsRequest = {};
    const nsResponse = await osClient.getNamespace(nsRequest);
    const namespace = nsResponse.value;

    mount(osClient, namespace, bucket, configPath, reloadDelay);
}

async function mount(osClient, namespace, bucket, path, reloadDelay)
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
    await downloadFile(osClient, namespace, bucket, files[i], path);
 }
 if(parseInt(reloadDelay) > 0) {
  setTimeout(function() {
    mount(osClient, namespace, bucket, path, reloadDelay);
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
      console.log(file.name + " is a directory, creating .. ");
      fs.mkdir(path + "/" + file.name, (err) => {
        //if (err) console.log(err);
      });
    } else {
     var chunks = [];
     for await (let chunk of getObjectResponse.value) {
         chunks.push(chunk);
     }
     var buffer = Buffer.concat(chunks);
     await fs.writeFile(path + "/" + file.name, buffer, null, (err) => {
       if (err) {
         //console.log('Error writing file:', err);
         return;
       }
       console.log('File written successfully to' + path + "/" + file.name);
     });
  } 
}

start();