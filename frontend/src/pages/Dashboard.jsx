import { useEffect, useState } from "react";
import Chat from "../components/Chat";
import "./Dashboard.css";

function Dashboard() {

    const [account, setAccount] = useState(null);
    const [error, setError] = useState("");
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {

        const token = localStorage.getItem("access_token");

        fetch("http://127.0.0.1:8000/accounts/my-account", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(async (response) => {

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail || "Failed to fetch account"
                    );
                }

                return data;
            })
            .then((data) => {

                setAccount(data);

                return fetch(
                    `http://127.0.0.1:8000/transactions/${data.account_id}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );
            })
            .then(async (response) => {

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail || "Failed to fetch transactions"
                    );
                }

                return data;
            })
            .then((data) => {

                setTransactions(data.transactions);

            })
            .catch((error) => {

                setError(error.message);

            });

    }, []);

    const logout = () => {
        localStorage.removeItem("access_token");
        window.location.href = "/";
    };

    return (
        <div className="dashboard">

            {/* NAVBAR */}

            <header className="navbar">

                <div className="brand">

                    <div className="brand-icon">
                        N
                    </div>

                    <div>
                        <h2>NexaBank</h2>
                        <span>AI Banking</span>
                    </div>

                </div>

                <div className="nav-right">

                    <div className="secure-badge">
                        <span className="secure-dot"></span>
                        Secure
                    </div>

                    <button
                        className="logout-btn"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* MAIN */}

            <main className="dashboard-content">

                {/* HEADER */}

                <section className="welcome-section">

                    <div>

                        <p className="small-label">
                            PERSONAL BANKING
                        </p>

                        <h1>
                            Good evening 👋
                        </h1>

                        <p className="subtitle">
                            Here's your financial overview.
                        </p>

                    </div>

                    <div className="live-status">
                        <span></span>
                        Account Active
                    </div>

                </section>


                {/* ERROR */}

                {error && (
                    <div className="error-box">
                        ⚠ {error}
                    </div>
                )}


                {/* ACCOUNT CARDS */}

                {account && (

                    <section className="stats-grid">

                        <div className="balance-card">

                            <div className="card-top">

                                <span>
                                    TOTAL BALANCE
                                </span>

                                <div className="balance-icon">
                                    ₹
                                </div>

                            </div>

                            <h2>
                                ₹{account.balance.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2
                                })}
                            </h2>

                            <div className="account-number">
                                •••• •••• {account.account_number.slice(-4)}
                            </div>

                        </div>


                        <div className="info-card">

                            <div className="info-icon">
                                ◈
                            </div>

                            <div>

                                <span>ACCOUNT TYPE</span>

                                <strong>
                                    {account.account_type}
                                </strong>

                            </div>

                        </div>


                        <div className="info-card">

                            <div className="info-icon">
                                ₹
                            </div>

                            <div>

                                <span>CURRENCY</span>

                                <strong>
                                    {account.currency}
                                </strong>

                            </div>

                        </div>


                        <div className="info-card">

                            <div className="info-icon">
                                ✓
                            </div>

                            <div>

                                <span>STATUS</span>

                                <strong className="active-text">
                                    {account.status}
                                </strong>

                            </div>

                        </div>

                    </section>

                )}


                {/* CONTENT GRID */}

                <section className="main-grid">


                    {/* TRANSACTIONS */}

                    <div className="transactions-card">

                        <div className="section-heading">

                            <div>

                                <p className="small-label">
                                    ACTIVITY
                                </p>

                                <h2>
                                    Recent Transactions
                                </h2>

                            </div>

                            <div className="transaction-count">
                                {transactions.length} transactions
                            </div>

                        </div>


                        {transactions.length === 0 ? (

                            <div className="empty-state">
                                <div className="empty-icon">
                                    ↗
                                </div>

                                <p>
                                    No transactions found
                                </p>
                            </div>

                        ) : (

                            <div className="transaction-list">

                                {transactions.map((transaction) => (

                                    <div
                                        className="transaction-row"
                                        key={transaction.transaction_id}
                                    >

                                        <div className="transaction-icon">
                                            {transaction.from_account_id ===
                                            account?.account_id
                                                ? "↗"
                                                : "↙"}
                                        </div>


                                        <div className="transaction-info">

                                            <strong>
                                                {transaction.description ||
                                                    transaction.transaction_type}
                                            </strong>

                                            <span>
                                                ID #{transaction.transaction_id}
                                            </span>

                                        </div>


                                        <div className="transaction-type">
                                            {transaction.transaction_type}
                                        </div>


                                        <div
                                            className={
                                                transaction.from_account_id ===
                                                account?.account_id
                                                    ? "amount outgoing"
                                                    : "amount incoming"
                                            }
                                        >

                                            {transaction.from_account_id ===
                                            account?.account_id
                                                ? "-"
                                                : "+"}
                                            ₹{transaction.amount.toLocaleString(
                                                "en-IN"
                                            )}

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>


                    {/* AI CHAT */}

                    <div className="ai-card">

                        <Chat
                            accountId={account?.account_id}
                        />

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;