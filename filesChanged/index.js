module.exports = async function (context, myBlob) {
    context.log("JavaScript blob trigger function processed blob \n Blob:", context.bindingData.blobTrigger, "\n Blob Size:", myBlob.length, "Bytes");

    const updates = {
        target: 'blob',
        arguments: [context.bindingData.uri]
    };

    context.bindings.signalRMessages = updates;
    context.done();
};