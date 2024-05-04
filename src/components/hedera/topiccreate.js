const { TopicCreateTransaction } = require("@hashgraph/sdk");
async function topicMintFcn(walletData, accountId) {
  const hashconnect = walletData[0];
  const saveData = walletData[1];
  const provider = hashconnect.getProvider(
    "testnet",
    saveData.topic,
    accountId
  );
  const signer = hashconnect.getSigner(provider);

  //Create the transaction
  const transaction = new TopicCreateTransaction();

  //Sign with the client operator private key and submit the transaction to a Hedera network
  const txResponse = await transaction.executeWithSigner(signer);

  //Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(signer);

  //Get the topic ID
  const newTopicId = receipt.topicId;

  console.log("The new topic ID is " + newTopicId);

  //v2.0.0

  return [newTopicId];
}

export default topicMintFcn;
