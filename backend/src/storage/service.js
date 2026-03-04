const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// a function to upload file 
async function uploadFile(file,fileName){
    const response = await imagekit.upload({
        file: file,
        fileName: fileName,
    });
    return response;
}

module.exports = {uploadFile};
