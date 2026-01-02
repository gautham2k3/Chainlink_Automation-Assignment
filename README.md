# Automated Greenhouse (Chainlink Keeper Project)

This project demonstrates **Chainlink Automation** (formerly Keepers). It simulates a digital plant that loses moisture over time and uses a smart contract to automatically "water" it when levels drop below a critical threshold.

* **Name:** Bommali Gautham Naidu
* **UID:** 22BCT10003
* **Email:** bgautham27@gmail.com

---

1.  **Install Dependencies**
    ```shell
    npm install
    ```

2.  **Start Local Blockchain** (Keep this terminal open)
    ```shell
    npx hardhat node --hostname 0.0.0.0
    ```

3.  **Deploy Contract** (In a new terminal)
    ```shell
    npx hardhat run scripts/deploy.js --network localhost
    ```

4.  **Run Tests**
    ```shell
    npx hardhat test
    ```

5.  **Start Frontend**
    ```shell
    cd client
    npm start
    ```