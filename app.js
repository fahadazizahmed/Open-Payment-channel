var express = require('express');

const app = express();
var BN = require('bn.js')
var abi = require('ethereumjs-abi')
const eutil = require('ethereumjs-util');
var nodemailer = require('nodemailer');
let accounts;
let email;
let amount;
let contract;

const exphbs = require('express-handlebars')

var path = require('path')
var bodyParser = require('body-parser')


app.engine('handlebars', exphbs({

  defaultLayout:'main'}));
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname,'public')));


var bchAddress = express.Router();
bchAddress.get('/',function(req,res,next){
   
    
    res.render('index/welcome')

  })
  app.use('/paymentchannel', bchAddress);

//
var bchAddres = express.Router();
bchAddres.get('/',function(req,res,next){
   
    
  res.render('index/sign')

})
app.use('/verify/signature', bchAddres);
//
var checkAddr = express.Router();
checkAddr.post('/',async function(req,res,next){
    email = req.body.email;
    amount = req.body.amount;

    console.log("email ",email)


  var HDWalletProvider = require("truffle-hdwallet-provider");
  var mnemonic = "diet mistake resist blood pool process toss frequent zero judge crime equip"; // 12 word mnemonic
  const Web3 = require('web3');
  const {interface,bytecode}  = require ('./compile');
  //const bytecode = a.contracts[':Inbox'].bytecode;
  
  var provider = new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/4e962d53cc894df2a63436f519d1e9d0");
  
  const web3 = new Web3(provider);

accounts  = await web3.eth.getAccounts();
console.log("used address to deployee contract " ,accounts);



const result = await new web3.eth.Contract(JSON.parse(interface))
.deploy({ data : bytecode, arguments: [req.body.rec,req.body.dur] })//prepare deployee contract
.send({ 
  from: accounts[0], 
  value : web3.utils.toWei(req.body.amount,'ether'),
  gas: '3000000'
});
console.log("result is",result);
console.log("contract deployee to addrsss ", result.options.address);
contract = result.options.address;


a = web3.utils.toWei(req.body.amount,'ether')
console.log("contract deploy successfully",a)




signPayment(result.options.address,a,function(err,signer){

 

});















  res.render('index/welcome')

})
app.use('/open/channel', checkAddr);

function constructPaymentMessage(contractAddress, amount) {
  
  return abi.soliditySHA3(
    ["address", "uint256"],
    [contractAddress, amount],
  );
  
}

async function signMessage(message, callback) {
  var HDWalletProvider = require("truffle-hdwallet-provider");
  var mnemonic = "diet mistake resist blood pool process toss frequent zero judge crime equip"; // 12 word mnemonic
  const Web3 = require('web3');

  //const bytecode = a.contracts[':Inbox'].bytecode;
  
  var provider = new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/4e962d53cc894df2a63436f519d1e9d0");
  
  const web3 = new Web3(provider);
  account = await web3.eth.getAccounts();
 
  console.log("account is",accounts)

web3.eth.sign("0x" + message.toString("hex"), account[0],
callback);
}
function signPayment(contractAddress, amount, callback) {
  var message = constructPaymentMessage(contractAddress,amount);
  console.log("message is",message)
  signMessage(message, async (err,signature)=>{
      try {
         
        console.log("sig",signature);
        //
        //Send email
        const output = `
        <p>Registration Detail</p>
          Hi the signature  ${signature} Has been sent to +${email} click this link <a href="http://localhost:3000/verify/signature">http://localhost:3000/verify/signature</a> to close the channel.Amount sent is ${amount} wei and contract address is ${contract}.Thanks
        `;
    
        let transporter = nodemailer.createTransport({
          host: 'smtp.mailtrap.io',
          port: 2525,
          secure: false, // true for 465, false for other ports
          auth: {
            user: 'ce75c88586356d', // generated ethereal user
            pass: 'e4a41914a5b804'  // generated ethereal password
          },
          tls:{
          rejectUnauthorized:false
          }
          });
    
          let mailOptions = {
            from: '"test@testing.io', // sender address
            to:email, // list of receivers
            subject: 'Regisration Detail', // Subject line
            text: 'Hello world?', // plain text body
            html: output // html body
          };
    
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              
              return console.log(error);
            }
            // Show message here to email send and verify
            console.log('Message sent: %s', info.messageId);   
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            
          });

        //

       
      }
      catch(error){
        console.log("siasdsdg",error.message);

      }

     
  })

  
}

//

























//

// Listening port 3000
if (module === require.main) {
    // Start the server
    var server = app.listen(process.env.PORT || 3000, function () {
        var port = server.address().port;
        console.log('App listening on port %s', port);
    });
  }
  module.exports = app;