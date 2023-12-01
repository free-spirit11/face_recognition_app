const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const makeClarifaiRequest = (imageUrl) => {
    return new Promise((resolve, reject) => {

        const PAT = '6b5531d9b2f14276a32e427457a4bb8c';

        const USER_ID = '4uf03bwvpmyq';
        const APP_ID = 'my-first-application';
        const MODEL_ID = 'face-detection';
        const IMAGE_URL = imageUrl;


        const stub = ClarifaiStub.grpc();

        const metadata = new grpc.Metadata();
        metadata.set("authorization", "Key " + PAT);

        stub.PostModelOutputs(
            {
                user_app_id: {
                    "user_id": USER_ID,
                    "app_id": APP_ID
                },
                model_id: MODEL_ID,
                inputs: [
                    { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } }
                ]
            },
            metadata,
            (err, response) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (response.status.code !== 10000) {
                    reject("Post model outputs failed, status: " + response.status.description);
                    return;
                }

                // Since we have one input, one output will exist here
                const output = response;
                resolve(output);
            }
        );
    });
}

module.exports = {
    makeClarifaiRequest: makeClarifaiRequest
}