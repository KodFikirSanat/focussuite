# Project: Nexus Sync Engine - Step-by-Step Development Roadmap

This roadmap is designed to build the project from the ground up, progressively increasing complexity. At the end of each phase, the goal is to have a testable and functional prototype.

---

### 🏗️ PHASE 1: Building the Core (Single-Player Mode)

**Goal:** Create a platform-independent "brain" that contains all business logic and runs perfectly offline on a single device. No networking or synchronization in this phase.

-   [x] **Step 1.1: Project Setup and Dependencies**
    -   Initialize a new Rust "library" project (`cargo new nexus-core --lib`).
    -   Add essential libraries (crates):
        -   `rusqlite`: For SQLite database operations.
        -   `serde`: For serializing data structures (e.g., to JSON).
        -   `chrono`: For date and time management.

-   [x] **Step 1.2: Define Data Models**
    -   Create Rust `structs` to represent all 12 database tables. Make these structs serializable with `serde`.
    -   Write the database schema (SQL `CREATE TABLE` commands) in a separate `.sql` file.

-   [x] **Step 1.3: Code the Database Layer**
    -   Write functions to establish a database connection, execute the schema, and perform basic CRUD (Create, Read, Update, Delete) operations.
    -   Example functions: `initialize_database`, `create_note`, `update_note_content`, `get_all_notes`.

-   [ ] **Step 1.4: Integrate Business Logic**
    -   Implement the core "smart" logic of the application. This is where you'll add the rules that define how user data affects program behavior.
    -   Ensure this logic correctly calls the functions in the database layer.

-   [ ] **Step 1.5: Write Unit Tests**
    -   Write tests for every function. Is data being added correctly? Updated? Does the business logic produce the correct output? This ensures a solid foundation.

-   **✅ Phase 1 Completion Criteria:** A standalone, fully tested Rust library that performs all core business functions.

---

### 🖥️ PHASE 2: The First UI and FFI Bridge (The First Body)

**Goal:** Prove that the Rust "brain" can control a "body" (the user interface) on a single chosen platform.

-   [ ] **Step 2.1: Choose a Platform**
    -   Select a single platform for rapid development and testing. **Recommendation:** Desktop (Windows/macOS/Linux).

-   [ ] **Step 2.2: Create the FFI Interface**
    -   In the Rust code, create a C-compatible API layer by marking the functions the UI will need with `extern "C"`.
    -   **Important:** Write "translator" code to convert complex Rust types (like `String`, `Vec`) into simple types that C can understand (`*const c_char`). JSON is your best friend here.

-   [ ] **Step 2.3: Create the UI Project**
    -   **Recommendation:** Use Flutter. It allows for rapid prototyping on the desktop and will simplify the transition to other platforms in Phase 4.
    -   Create the Flutter project and compile the Rust code into a shared library (`.dll`, `.so`, `.dylib`) for the target platform.

-   [ ] **Step 2.4: Build the FFI Bridge**
    -   Use Flutter's `dart:ffi` library (or a tool like `flutter_rust_bridge`) to load the compiled Rust library.
    -   Call the Rust functions from your Dart code.

-   [ ] **Step 2.5: Develop a Basic UI**
    -   Create simple screens to list, add, and update data from the database. Ensure all UI buttons trigger the correct Rust functions.

-   **✅ Phase 2 Completion Criteria:** A functional desktop application with a UI that performs all data operations through the Rust core.

---

### 🔄 PHASE 3: Local Network Sync (The First Conversation)

**Goal:** Enable two devices on the same Wi-Fi network to discover each other and synchronize data.

-   [ ] **Step 3.1: Integrate CRDTs and the Oplog**
    -   Add a CRDT library to the Rust core.
    -   Update the database layer so that every change is written not only to the main tables but also to an `oplog` (operation log) table.

-   [ ] **Step 3.2: Add a P2P Library**
    -   Add the `libp2p` library to the Rust project.

-   [ ] **Step 3.3: Code Local Discovery Logic**
    -   Use `libp2p`'s mDNS module to enable the application to find other instances of itself on the same network.

-   [ ] **Step 3.4: Develop the Synchronization Protocol**
    -   When two devices discover each other, implement a protocol where they ask, "What's the last operation you've seen?"
    -   Enable them to send and receive the missing "commands" (oplog entries).
    -   Apply the newly received commands to the local database via the CRDT engine.

-   **✅ Phase 3 Completion Criteria:** When two computers are connected to the same Wi-Fi, a change made on one appears on the other within seconds.

---

### 📱 PHASE 4: Cross-Platform Expansion (New Bodies)

**Goal:** Port the core system, which now syncs on a local network, to other platforms (mobile, watches).

-   [ ] **Step 4.1: Compile for Mobile and Watches**
    -   Compile the Rust core into shared libraries for Android (`.so`) and iOS (`.a`).
    -   If necessary, create build configurations that disable certain features to accommodate the limited resources of smartwatches.

-   [ ] **Step 4.2: Develop the UIs**
    -   If you used Flutter, adapt the existing codebase to mobile and watch form factors. This is a major advantage.
    -   If you chose to go native, write the UIs from scratch in Swift (iOS/watchOS) and Kotlin (Android/WearOS).

-   [ ] **Step 4.3: Build FFI Bridges for Each Platform**
    -   Add the compiled Rust library to each new project and implement the FFI calls (see Phase 2).

-   [ ] **Step 4.4: Implement Device Authorization (Onboarding)**
    -   Define a secure process for a new phone or watch to join the sync network (e.g., scanning a QR code from an existing device). Add this logic to the Rust core and the UIs.

-   **✅ Phase 4 Completion Criteria:** A full application ecosystem running on all target platforms, capable of syncing seamlessly with each other over a local network.
