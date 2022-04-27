import crypto from "crypto";

class Block<T = string> {
  public index: number;
  public timestamp: number;
  public proof: number;
  public prevHash: string;
  public data?: T;

  constructor(
    index: number,
    timestamp: number,
    proof: number,
    prevHash: string,
    data?: T
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.proof = proof;
    this.prevHash = prevHash;
    if (data !== undefined) this.data = data;
  }
}

class Blockchain<T = string> {
  public chain: Block<T>[];

  public constructor() {
    this.chain = [];
    this.createBlock(1, "0");
  }

  public createBlock(proof: number, prevHash: string, data?: T): Block<T> {
    const block = new Block<T>(
      this.chain.length + 1,
      Date.now(),
      proof,
      prevHash,
      data
    );
    this.chain.push(block);
    return block;
  }

  public getPrevBlock(): Block<T> | undefined {
    return this.chain[this.chain.length - 1];
  }

  public isProofValid(proof: number, prevProof: number) {
    const hash = crypto
      .createHash("sha256")
      .update((proof ** 2 - prevProof ** 2).toString())
      .digest("hex");
    return hash.substring(0, 4) === "0000";
  }

  public proofOfWork(prevProof: number): number {
    let newProof = 1;
    let hasProof = false;
    while (!hasProof) {
      if (this.isProofValid(newProof, prevProof)) {
        hasProof = true;
      } else {
        newProof++; // try with next value
      }
    }
    return newProof;
  }

  public isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];
      if (currBlock.prevHash !== this.hashBlock(prevBlock)) return false; // check if the block's prevHash links to previous block's hash
      if (!this.isProofValid(currBlock.proof, prevBlock.proof)) return false; // check if the the proof of the block fits requirement
    }
    return true;
  }

  public hashBlock(block: Block<T>): string {
    const blockJson = JSON.stringify(block);
    const blockHash = crypto
      .createHash("sha256")
      .update(blockJson)
      .digest("hex");
    return blockHash;
  }
}

// const blockchian = new Blockchain();

// const proof = blockchian.proofOfWork(
//   blockchian.chain[blockchian.chain.length - 1].proof
// );
// console.log({ proof });
// const block = blockchian.createBlock(
//   proof,
//   blockchian.hashBlock(blockchian.chain[blockchian.chain.length - 1]),
//   "Some data"
// );
// console.log({ block });
// console.log(blockchian);
