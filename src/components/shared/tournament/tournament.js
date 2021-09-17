import "./index.scss";
export const TouramentMobile = (props) => {
  return (
    <>
      <div className="one-tourament-mobile">
        <div className="one one-mint">
          <div className="mint">
            <img src="/images/mint-arrow.svg" className="mint-arrow" alt="" />
            <p className="top">0ne Mint Per Claim</p>

            <div className="mint-top">
              <div className="block card">
                <p>52 Card Deck</p>
                <p>Shuffled On-Chain</p>
              </div>
              <div className="block circle text-center">Mint</div>
              <p className="block price">0.052 Eth</p>
            </div>
          </div>
        </div>

        <img src="/images/ranking-arrow.svg" alt="" />
        <div className="one one-comunity">
          <p>10.000 Hands</p>
          <img src="/images/cards/cards-question.svg" alt="" />
          <p className="last">0ne Community</p>
        </div>
        <div className="one one-champion">
          <div className="line line-center"></div>
          <div className="champion-top">
            <div className="line line-arrow"></div>
            <div className="champion-item">
              <div className="circle">
                <img className="icon-four" src="images/four-icon.svg" alt="" />
              </div>
              <div className="text">
                <p className="text-orange">
                  Free NFT Claims on Upcoming H01d’Em Series
                </p>
                <p className="text-yellow">
                  Skip the queue on future H01d’Em series with free claims +
                  GAS.
                </p>
              </div>
            </div>
            <div className="line line-bottom"></div>

            <div className="champion-item two">
              <div className="circle">
                <img
                  className="icon-club"
                  src="images/icon-club-orange.svg"
                  alt=""
                />
              </div>
              <div className="text">
                <p className="text-orange">
                  VIP Access to the H01d’Em Metaverse Club
                </p>
                <p className="text-yellow">
                  Access to Metaverse Events in the H01d’Em Bar & Lounge + Guest
                  Pass.
                </p>
              </div>
            </div>
            <div className="line line-bottom second"></div>

            <div className="champion-item two">
              <div className="circle">
                <img
                  className="icon-orange"
                  src="images/icon-bowtie.svg"
                  alt=""
                />
              </div>
              <div className="text">
                <p className="text-orange">
                  Wearables for H01d’Em Series One Members
                </p>
                <p className="text-yellow">
                  Look the part in the Metaverse with our gifted H01d’Em themed
                  attire.
                </p>
              </div>
            </div>
          </div>

          <div className="line line-bottom-50"></div>
          <div className="line line-last-arrow"></div>
        </div>
        <div className="nft-airdrop">
          <p className="best-ranking">
            Best Ranking <br /> Hand
          </p>
          <div className="circle">
            <img src="/images/prize-NFT.svg" alt="" />
          </div>
          <p>
            One <br /> Champion
          </p>
        </div>
        <p className="text-orange">1/1 NFT Airdrop</p>
      </div>
    </>
  );
};
