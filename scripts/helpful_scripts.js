const MockV3Aggregator = artifacts.require('MockV3Aggregator')
const MockDAIToken = artifacts.require('MockDAIToken')
const Web3 = require("web3");
const web3 = new Web3();
var Eth = require('web3-eth');
var eth = new Eth(Eth.givenProvider || 'ws://some.local-or-remote.node:8546');

let deployed = false;
let tokenDai = {} ;
let mockV3 = {};

const token_address = {

  //addresses of Chainlink smart contracts for token prices

    "dai_usd_price_feed_address": '0x14866185B1962B63C3Ea9E03Bc1da838bab34C19',
    "eth_usd_price_feed_address": '0x694AA1769357215DE4FAC081bf1f309aDC325306',
    "link_usd_price_feed_address": '0xc59E3633BAAC79493d908e63626716e204A45EdF',
    "fau_usd_price_feed_address": '0x777A68032a88E5A84678A77Af2CD65A7b3c0775a',
    
    "dai_token_address": '0x94791765486dE01BDFed2c66d2e1123c519b37E1',
    "weth_token_address": '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
    "link_token_address": '0xa36085F69e2889c224210F603D836748e7dC0088',
    "fau_token_address": '0xFab46E002BbF0b4509813474841E0716E6730136',
    "dapp_token_address": '0x984a0522DdF80dC80286e8540479B74548f7013a'
}

function toWei(amount){
  return web3.utils.toWei(amount, "ether")
}

const contract_to_mock = {
    "dai_usd_price_feed_address": MockV3Aggregator,
    "dapp_usd_price_feed_address": MockV3Aggregator,
    "eth_usd_price_feed_address": MockV3Aggregator,
    "link_usd_price_feed_address": MockV3Aggregator,
    "fau_usd_price_feed_address": MockV3Aggregator,
    "dai_token_address": MockDAIToken,
    "weth_token_address": MockDAIToken,
    "link_token_address": MockDAIToken,
    "fau_token_address": MockDAIToken,
    "dapp_token_address": MockDAIToken
}

const deploy_mocks = async(deployer) =>{
  await deployer.deploy(MockDAIToken)
  await deployer.deploy(MockV3Aggregator, 8, 2 * 10**8)
  tokenDai = await MockDAIToken.deployed()
  mockV3 = await MockV3Aggregator.deployed()
  deployed = true;
  return [tokenDai.address,mockV3._address]
}


const get_contract = async(contract_name, current_network, current_deployer)=>{
    //If we are on a local network, deploy a mock contract and return the contract
    //If we are on a real network, Obtain a contract from abi and name of that mock contract.
    let contract_addr;
    let contract_type = contract_to_mock[contract_name]
    if(current_network == "development"){
        console.log("DEVELOPMENT")
        if (deployed)
        {
          contract_addr = contract_type["contractName"] == "MockDAIToken" ? tokenDai.address : mockV3.address
        }
        else{
          var token = await deploy_mocks(current_deployer)
          contract_addr = contract_type["contractName"] == "MockDAIToken" ? token[0]: token[1]
        }
    }
    else //for Production
    {
      console.log("PRODUCTION")
        contract = new web3.eth.Contract(contract_type.abi, token_address[contract_name])
        contract_addr = contract._address
    }
    return contract_addr
}

module.exports = { get_contract, deploy_mocks, contract_to_mock, toWei }
