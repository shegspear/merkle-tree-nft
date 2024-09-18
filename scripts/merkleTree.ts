import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";
import csv from "csv-parser";

const values:any = [];
fs.createReadStream("feed-files/raw-data.csv")
  .pipe(csv())
  .on("data", (row) => {
    values.push([row.address, row.amount]);
  })
  .on("end", () => {
    const tree = StandardMerkleTree.of(values, ["address", "uint256"]);
    console.log("Merkle Root:", tree.root);

    // Write the tree to a JSON file
    fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));

    // Initialize an object to store proofs for all addresses
    const proofs = {};

    try {
      const loadedTree = StandardMerkleTree.load(JSON.parse(fs.readFileSync("tree.json", "utf8")));
      for (const [i, v] of loadedTree.entries()) {
        // Get the proof for each address
        const proof:any = loadedTree.getProof(i);
        proofs[v[0]] = proof; // Store the proof with the address as the key
      }

      // Write all proofs to a JSON file
      fs.writeFileSync("proofs7.json", JSON.stringify(proofs, null, 2));
      console.log("All proofs have been saved to 'proofs.json'.");
      
    } catch (err) {
      console.error("Error reading or processing 'tree.json':", err);
    }
  })
  .on("error", (err) => {
    console.error("Error reading 'airdrop.csv':", err);
  });

  // BAYC NFT ADDRESS: 0xaBA7161A7fb69c88e16ED9f455CE62B791EE4D03
 // MERKLE TREE 0x13dbf15cb11aa819912f79df9027e4c225ad4543a5a19c4bff1e9e5b694b01e6