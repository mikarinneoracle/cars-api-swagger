const identity = require("oci-identity");
const common = require("oci-common");
const secrets = require("oci-secrets");
const fs = require("fs");

async function start() {
    const secretOCID = process.env.secret_ocid;
    console.log("OCI VAULT SECRET:" + secretOCID);
    
    const secretsFile = process.env.secrets_file;
    console.log("SECRETS FILE:" + secretsFile);
    
    //const provider = new common.ConfigFileAuthenticationDetailsProvider("~/.oci/config");
    const provider = common.ResourcePrincipalAuthenticationDetailsProvider.builder();

    const secretsClient = new secrets.SecretsClient({ authenticationDetailsProvider: provider });
    mount(secretsClient, secretOCID, secretsFile);  
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
            });
        } else {
            console.log("Secret content format not recognized or empty.");
        }
    } catch (error) {
        console.error("Failed to retrieve secret content:", error);
    }
}

start();
