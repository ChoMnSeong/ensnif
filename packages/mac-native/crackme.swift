// LanimePass — a tiny Swift "crackme" for practicing native (Mach-O) reverse engineering.
//
// It mimics a classic license-key check: enter a serial, the app says granted/denied.
// The valid key is NOT stored as plain text — only a hash of it is baked in — so you
// can't just `strings` it out. That's the whole point: learn to read the compiled
// logic (the hash loop + the magic comparison constant) in the disassembly.
//
// Build:   swiftc crackme.swift -o lanimepass
// Run:     ./lanimepass LANI-XXXXXXXX
//
// RE goal: figure out what key passes — either by (a) understanding the djb2 hash and
// the target constant you see in the asm, or (b) patching the compare/branch so any
// key is accepted (patch vs keygen — the two classic approaches).

import Foundation

// djb2-style string hash. Seeded at 0x1505, multiply by 33, add each byte.
// In the disassembly you'll see this as a loop with a `* 33` (really `x<<5 + x`)
// and an add — a textbook hash to recognize.
func keyHash(_ s: Substring) -> UInt32 {
    var acc: UInt32 = 0x1505
    for byte in s.utf8 {
        acc = (acc &* 33) &+ UInt32(byte)
    }
    return acc
}

// The real check. Valid keys look like "LANI-XXXXXXXX" (8-char body).
// Only the body's hash must match the magic constant below.
func isValidKey(_ key: String) -> Bool {
    guard key.hasPrefix("LANI-") else { return false }
    let body = key.dropFirst(5)        // strip the "LANI-" prefix
    guard body.count == 8 else { return false }

    // ⬇️ This magic number is what you'll hunt for in the Mach-O disassembly.
    let target: UInt32 = 0xE60EAD02
    return keyHash(body) == target
}

// ---- entry point ----
let args = CommandLine.arguments
guard args.count == 2 else {
    print("LanimePass 🔒  —  unlock lanime premium")
    print("usage: \(args[0]) <license-key>")
    print("example: \(args[0]) LANI-XXXXXXXX")
    exit(2)
}

if isValidKey(args[1]) {
    print("✅ Access granted — welcome to lanime premium!")
    exit(0)
} else {
    print("❌ Invalid license key.")
    exit(1)
}
