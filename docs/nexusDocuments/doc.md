# Nexus Sync Engine: Technical Architecture

**Version:** 1.0
**Date:** October 4, 2025

---

### 1. Vision and Core Principles

#### 1.1. Vision

The **Nexus Sync Engine** is a decentralized backend infrastructure designed for a modern application ecosystem (desktop, mobile, and smartwatches). It ensures data consistency by enabling direct, peer-to-peer communication between devices, eliminating the need to store sensitive user data on a central server. This system serves as a powerful alternative to traditional cloud backends, with a primary focus on maximizing **user privacy** and **offline-first functionality**.

#### 1.2. Core Principles

-   **Privacy-First:** User data is never transmitted to a central server in plaintext. All communication is secured with **end-to-end encryption**. The user retains complete ownership and control of their data.
-   **Local-First:** The "source of truth" for the application is always the device's local database. The application is designed to be fully functional without an internet connection.
-   **Serverless Data:** The system operates without dependency on a central server for data storage or business logic. Servers are only used as "dumb" relays for device discovery and communication, handling no user data.
-   **Resilience & Availability:** The decentralized nature of the architecture eliminates single points of failure. The system remains operational as long as devices can communicate with each other.

---

### 2. System Architecture Overview

The system is composed of four distinct layers, creating a modular and maintainable structure.

1.  **Core Library (`Nexus Core`):** A platform-independent, shared library containing all business logic and data models.
2.  **Storage Layer:** The local database responsible for persisting data on each device.
3.  **Sync Engine (`Nexus P2P`):** The engine that manages peer-to-peer communication and data synchronization between devices.
4.  **UI Layer:** The platform-specific or cross-platform user interface that the user interacts with.

---

### 3. Layer 1: The Core Library ("Nexus Core")

The Core Library is the heart and brain of the entire system, compiled from a single Rust codebase to target all platforms.

-   **Technology:** `Rust`
-   **Rationale:**
    -   **Performance:** Achieves C/C++ level speed, ensuring maximum efficiency for local database operations and complex algorithms.
    -   **Memory Safety:** Rust's compiler prevents common concurrency issues like race conditions and null pointer errors at compile-time, guaranteeing system stability.
    -   **Portability:** The Rust codebase can be compiled for all target platforms (Windows, macOS, Linux, iOS, Android, watchOS, WearOS) and can be easily called from other languages (Dart, Swift, Kotlin) via a C-compatible Foreign Function Interface (FFI). This realizes the "write once, run anywhere" ideal.
-   **Components:**
    -   **Data Models:** The application's ~12 tables are defined as serializable Rust `structs` using the `serde` library.
    -   **Business Logic:** All rules governing application behavior and data manipulation reside here.
    -   **Database Interface:** A dedicated module manages all interactions with SQLite, exposing a simple API (e.g., `get_user_settings`).
    -   **CRDT Engine:** Every change to the database is recorded as a Conflict-Free Replicated Data Type (CRDT) operation in a transaction log (`oplog`). This is the foundation for conflict-free synchronization.
    -   **FFI (Foreign Function Interface):** A public API for the UI layer to consume. Example functions include `initialize_core()`, `get_all_data_as_json()`, and `trigger_sync()`.

---

### 4. Layer 2: The Storage Layer

-   **Technology:** `SQLite`
-   **Rationale:** SQLite is the industry-standard embedded database—universal, serverless, lightweight, fast, and stable across all target platforms.
-   **Database Schema:**
    -   **Application Tables:** 10-12 tables that store the user's data (notes, settings, etc.) and represent the application's current state.
    -   **`oplog` (Operation Log Table):** This table is the true source of truth for synchronization. It stores every change as an operation (e.g., "set title of note X to Y"), which is then shared with other devices.
    -   **`peers` (Peer Devices Table):** Contains the identities and last known connection details of the user's other trusted devices.

---

### 5. Layer 3: The Sync Engine ("Nexus P2P")

This layer, part of the `Nexus Core` library, manages peer-to-peer communication, similar to tools like Syncthing.

-   **Technology:** `libp2p` (Rust implementation)
-   **Rationale:** `libp2p` is a proven, modular framework for building P2P network applications (used by projects like IPFS and Ethereum). It solves complex problems like device discovery, NAT traversal (hole punching), and encrypted transport out of the box.
-   **Workflow:**
    1.  **Identity:** On first launch, each device generates a cryptographically unique `DeviceID` (a key pair).
    2.  **Discovery:**
        -   **Local Network (LAN):** Devices automatically find each other on the same Wi-Fi network using the mDNS protocol.
        -   **Wide Area Network (WAN):** For discovery over the internet, a simple, stateless **Bootstrap Server** (managed by you) acts like a phonebook, helping devices find each other's public IP addresses without storing any user data.
    3.  **Connection & Transport:**
        -   `libp2p` first attempts a direct peer-to-peer connection using NAT traversal techniques.
        -   If a direct connection fails, communication is tunneled through a **Relay Server** (also managed by you). This server is a "dumb" intermediary and cannot see the data, as all traffic is end-to-end encrypted.
    4.  **Synchronization Protocol:**
        -   When two devices connect, they query each other's `oplog` status (e.g., "what's the last operation you've seen?").
        -   They exchange any missing operations.
        -   Each device applies the new operations to its local SQLite database via its CRDT engine, updating its state.

---

### 6. Security Model

-   **End-to-End Encryption (E2EE):** All communication between devices is encrypted using device-specific keys. No intermediary, including the Bootstrap and Relay servers, can read the data.
-   **Device Authorization:** A new device must be approved by an existing trusted device to join the sync network. This is typically achieved by scanning a QR code containing the new device's `DeviceID`.

---

### 7. A Practical Analogy: How It Works

#### Step 1: Recording "Commands," Not Changes

This is the most fundamental and intelligent part of the system.

When you change a note's title from "Shopping List" to "Tasks," the system doesn't just erase the old title and write the new one. Instead, it adds a new entry to a special "command log" (`oplog`):

> **Command #101:** "Issue command to change the title of note `abc-123` to 'Tasks'."

Every modification you make is recorded as such a command. When you mark a task as complete, another command is logged:

> **Command #102:** "Issue command to set the 'completed' value of task `xyz-456` to 'true'."

This gives you not just the final state of your data, but an ordered list of commands that describes how it got there. **What gets synchronized is this list of commands, not the data itself.**

#### Step 2: Device Introduction and the "Gossip Network"

How do your devices talk to each other to share these commands?

-   **In the Same Room (Local Network):** They broadcast "Hello, I'm here!" to each other (using the mDNS protocol). They find each other instantly and start talking directly, with no need for an internet connection.

-   **In Different Cities (Internet):**
    1.  Each device calls a very simple "phonebook" server you manage (the **Bootstrap Server**).
    2.  Your phone tells the phonebook, "My name is X, and this is my number (IP address)." Your computer asks the phonebook, "My name is Y, I'm looking for X. What's their number?"
    3.  The phonebook gives your computer your phone's number.
    4.  Your computer calls your phone directly. This conversation is fully encrypted; the phonebook can never listen in.
    5.  If the line is busy or a connection can't be established (due to firewalls), the phonebook acts as an "operator" (a **Relay Server**). Your computer gives the message to the operator, who passes it to the phone. The operator still can't read the message because it's inside an encrypted envelope.

#### Step 3: Sharing Commands ("What's the Latest?")

When two devices start talking, the first thing they do is catch up:

-   **Computer:** "Hey Phone! The last command I heard was #102. Do you have anything newer?"
-   **Phone:** "Hi Computer! I have commands #103 and #104. Here you go."
-   **Computer:** "Great, I've received them and updated my records. I also have a new command, #105. You should take it."

Through this exchange, both devices quickly possess the complete list of commands. Since everyone has the same command list, their data becomes identical.

#### Why Don't Conflicts Happen? (The Magic of CRDTs)

What if you edit the same note on your phone and computer at the same time? Traditional systems would throw an error. In this system, each device simply creates a command:

-   **Phone:** Command #106a: "Set the note title to 'Important Tasks'."
-   **Computer:** Command #106b: "Set the note title to 'Urgent Work'."

When the devices sync, they exchange commands. The system then uses a simple, predetermined rule (e.g., "the newer timestamp wins" or "merge the two changes") to decide which command takes precedence. This decision is made independently on each device, but the outcome is always consistent.

Because both devices will choose the same winner, their data remains perfectly in sync.

---

In short, the system works by recording the **commands that change the data**, sharing them over a secure gossip network, and applying them on each device in a way that is mathematically guaranteed to produce a consistent result.
