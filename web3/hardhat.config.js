// require("@matterlabs/hardhat-zksync-solc");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.17",
        defaultNetwork: 'sepolia',
        networks: {
            hardhat: {},
            sepolia: {
                url: 'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
                accounts: [process.env.NEXT_PRIVATE_KEY]
            }
        },
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
};
