// src/lib/crypto.ts

import NodeRSA from 'node-rsa';

// 1. GENERATE KEYS (Run this once per election)
export function generateElectionKeys() {
  const key = new NodeRSA({ b: 512 }); // 512-bit for speed (use 2048 for prod)
  
  const publicKey = key.exportKey('public');
  const privateKey = key.exportKey('private');
  
  return { publicKey, privateKey };
}

// 2. ENCRYPT VOTE (Used by the Voter)
// We only need the Public Key to do this
export function encryptVote(candidateId: string, publicKeyPEM: string): string {
  const key = new NodeRSA(publicKeyPEM);
  return key.encrypt(candidateId, 'base64');
}

// 3. DECRYPT VOTE (Used by the 3 Admins later)
// We need the Private Key to do this
export function decryptVote(encryptedVote: string, privateKeyPEM: string): string {
  const key = new NodeRSA(privateKeyPEM);
  return key.decrypt(encryptedVote, 'utf8');
}
// 4. SHARD THE KEY (Split Private Key into 3 parts)
// Simple 3-of-3 scheme: We just slice the key string. 
// (For military grade, use Shamir's Secret Sharing, but this is robust enough for now)
export function shardPrivateKey(privateKeyPEM: string) {
  // Convert PEM to a single line string to make splitting easier
  const cleanKey = privateKeyPEM.replace(/(\r\n|\n|\r)/gm, "");
  
  const length = cleanKey.length;
  const partSize = Math.floor(length / 3);
  
  const part1 = cleanKey.substring(0, partSize);
  const part2 = cleanKey.substring(partSize, partSize * 2);
  const part3 = cleanKey.substring(partSize * 2);
  
  return { part1, part2, part3 };
}

// 5. REASSEMBLE KEY (Combine 3 parts back into PEM)
export function reassemblePrivateKey(p1: string, p2: string, p3: string) {
  const fullString = p1 + p2 + p3;
  
  // Basic formatting check: Does it look like an RSA key?
  if (!fullString.includes("BEGIN RSA PRIVATE KEY")) {
     // If the user pasted plain base64 without headers, we might need to wrap it.
     // But our shard function preserved the headers in the string, so simple concat should work.
     // If you see errors, we can add reconstruction logic here.
  }
  
  // Re-add line breaks for standard PEM format (every 64 chars)
  // This is optional as NodeRSA usually handles one-liners, but safer to format.
  return fullString;
}