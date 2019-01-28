
//it compile the solidity contract in contract folder
const path = require('path')//we read the file inbox.sol not use require('path here') it create problem in different linux unix compatibilti
const fs = require('fs');
const
solc = require('solc')
const inboxPath = path.resolve(__dirname,'contracts','SimplePaymentChannel.sol')
const source = fs.readFileSync(inboxPath,'utf8');//byte code we deployee to the ethereum network this byte store and execute on the blockchain it contain our code
//  console.log(solc.compile(source,1));
module.exports = solc.compile(source,1).contracts[':SimplePaymentChannel']


//module.exports = solc.compile(source,1).contracts[':Inbox'];//other file deploy need this so we need to export this file
//Abi is the communication layer between the solidity world and javascript world
// Abi contain all the different function exist in the contract also specify how many argument in function what is return type and all other thing in the contract
