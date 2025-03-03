function Profile(){
    return (
    <div className="container">
        <div className="profile-header">
            <div className="nft-section">
                <img src="nft-placeholder.jpg" alt="NFT" className="nft-image" />
            </div>
            <div className="user-info">
                <h1>Anon Name <span className="username">@anonuser</span></h1>
                <div className="badges">
                    <span>Player One</span>
                    <span>Rare Collector</span>
                    <span>Sage Traveler</span>
                </div>
            </div>
            <div className="stats">
                <div className="level">LV3</div>
                <div className="balance">
                    Balance: $890.00<br />
                    Referrals: 99
                </div>
                <div className="code">
                    Code: AUG7H<br />
                    <a href="https://example.com" target="_blank">https://example.com</a>
                </div>
            </div>
        </div>

        <div className="tabs">
            <button>Tab One</button>
            <button>Tab One</button>
            <button>Tab One</button>
        </div>

        <div className="content">
            <section className="collectibles">
                <h2>Rare Collectibles</h2>
                <div className="collectible-grid">
                    <div className="collectible">Player One</div>
                    <div className="collectible">Rare Collector</div>
                    <div className="collectible">Sage Traveler</div>
                </div>
            </section>

            <section className="collectibles">
                <h2>In-game Collectibles</h2>
                <div className="collectible-grid">
                    <div className="collectible meh">?</div>
                    <div className="collectible meh">?</div>
                    <div className="collectible meh">?</div>
                    <div className="collectible meh">?</div>
                    <div className="collectible meh">?</div>
                    <div className="collectible meh">?</div>
                    <div className="collectible meh">?</div>
                    <div className="collectible meh">?</div>
                    <div className="collectible meh">?</div>
                </div>
            </section>

            <section className="collectibles">
                <h2>Rewards</h2>
                <div className="collectible-grid">
                    <div className="collectible meh">?</div>
                    <div className="collectible meh">?</div>
                    <div className="collectible meh">?</div>
                    <div className="collectible meh">?</div>
                    <div className="collectible meh">?</div>
                    <div className="collectible meh">?</div>
                </div>
            </section>
        </div>
    </div>
    );
}

export default Profile;