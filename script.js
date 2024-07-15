class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return CryptoJS.SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("** Block Mined **\n");
    }
}

class Blockchain {
    constructor() {
        this.chain = [];
        this.difficulty = 2;
        this.pendingTransactions = [];
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        if (this.chain.length > 0) {
            newBlock.previousHash = this.getLatestBlock().hash;
        }
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        this.displayBlockchain();
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    displayBlockchain() {
        document.getElementById('blockchain').textContent = JSON.stringify(this, null, 4);
        document.getElementById('validity').textContent = 'Is Blockchain valid? ' + this.isChainValid();
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    minePendingTransactions() {
        if (this.pendingTransactions.length === 0) {
            alert("No transactions to mine.");
            return;
        }
        const index = this.chain.length;
        const newBlock = new Block(index, new Date().toLocaleString(), this.pendingTransactions, this.chain.length > 0 ? this.getLatestBlock().hash : '');
        this.addBlock(newBlock);
        this.pendingTransactions = [];
    }
}

let bch = new Blockchain();

function addTransaction() {
    const sender = document.getElementById('sender').value;
    const receiver = document.getElementById('receiver').value;
    const amount = document.getElementById('amount').value;
    
    if (!sender || !receiver || !amount) {
        alert("Please fill in all fields.");
        return;
    }

    bch.createTransaction({ sender: sender, receiver: receiver, amount: parseInt(amount) });
    document.getElementById('sender').value = "";
    document.getElementById('receiver').value = "";
    document.getElementById('amount').value = "";
    alert("Transaction added. Now you can mine the block.");
}

function mineBlock() {
    bch.minePendingTransactions();
}

document.addEventListener('DOMContentLoaded', () => {
    bch.displayBlockchain();
});
