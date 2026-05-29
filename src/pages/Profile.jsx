import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/user";
import { useAuth } from "../context/AuthContext";

const STATUS_STYLES = {
  active: "bg-green-400/10 text-green-400 border border-green-400/20",
  pending: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
  ended: "bg-auction-muted/10 text-auction-muted border border-auction-muted/20",
};

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("won");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-auction-bg">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-4 animate-pulse">
          <div className="h-24 bg-auction-card rounded border border-auction-border" />
          <div className="h-48 bg-auction-card rounded border border-auction-border" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-auction-bg">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10">
          <p className="text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3">
            {error}
          </p>
        </div>
      </div>
    );
  }

  const { auctionsWon, auctionsParticipated, stats } = profile;

  return (
    <div className="min-h-screen bg-auction-bg">
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10 animate-fade-in">

        {/* Profile Header — stacks on mobile */}
        <div className="card p-5 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">

            {/* Avatar */}
            <div className="w-14 h-14 md:w-16 md:h-16 bg-auction-accent/10 border border-auction-accent/30 flex items-center justify-center shrink-0">
              <span className="font-display text-3xl md:text-4xl text-auction-accent">
                {user?.username?.[0]?.toUpperCase()}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-display text-3xl md:text-4xl text-auction-text tracking-wide">
                {user?.username}
              </h1>
              <p className="text-auction-muted text-sm mt-1">{user?.email}</p>
              {user?.role === "admin" && (
                <span className="text-xs px-2 py-0.5 bg-auction-accent/10 text-auction-accent border border-auction-accent/20 mt-2 inline-block font-mono uppercase tracking-wider">
                  Admin
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6 md:gap-8 text-center">
              <div>
                <p className="font-mono text-2xl md:text-3xl text-auction-accent">
                  {stats.totalWon}
                </p>
                <p className="text-auction-muted text-xs uppercase tracking-widest mt-1">
                  Won
                </p>
              </div>
              <div className="w-px bg-auction-border" />
              <div>
                <p className="font-mono text-2xl md:text-3xl text-auction-text">
                  {stats.totalParticipated}
                </p>
                <p className="text-auction-muted text-xs uppercase tracking-widest mt-1">
                  Participated
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-auction-border mb-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setTab("won")}
            className={`px-4 md:px-5 py-3 text-xs md:text-sm uppercase tracking-widest transition-colors duration-200 whitespace-nowrap ${
              tab === "won"
                ? "text-auction-accent border-b-2 border-auction-accent -mb-px"
                : "text-auction-muted hover:text-auction-text"
            }`}
          >
            🏆 Won ({stats.totalWon})
          </button>
          <button
            onClick={() => setTab("participated")}
            className={`px-4 md:px-5 py-3 text-xs md:text-sm uppercase tracking-widest transition-colors duration-200 whitespace-nowrap ${
              tab === "participated"
                ? "text-auction-accent border-b-2 border-auction-accent -mb-px"
                : "text-auction-muted hover:text-auction-text"
            }`}
          >
            📋 Participated ({stats.totalParticipated})
          </button>
        </div>

        {/* Auctions Won */}
        {tab === "won" && (
          <div className="space-y-3 animate-fade-in">
            {auctionsWon.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-auction-muted text-lg">No auctions won yet</p>
                <button
                  onClick={() => navigate("/auctions")}
                  className="btn-primary mt-4 inline-block"
                >
                  Browse Auctions
                </button>
              </div>
            ) : (
              auctionsWon.map((auction) => (
                <div
                  key={auction._id}
                  onClick={() => navigate(`/auction/${auction._id}`)}
                  className="card p-4 md:p-5 flex items-center justify-between cursor-pointer hover:border-auction-accent/40 transition-colors group"
                >
                  <div>
                    <h3 className="text-auction-text font-medium group-hover:text-auction-accent transition-colors text-sm md:text-base">
                      {auction.title}
                    </h3>
                    <p className="text-auction-muted text-xs mt-1">
                      Ended {new Date(auction.endTime).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-auction-muted text-xs uppercase tracking-widest mb-1">
                      Final Price
                    </p>
                    <p className="font-mono text-lg md:text-xl text-auction-accent font-medium">
                      ${auction.finalPrice?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Auctions Participated */}
        {tab === "participated" && (
          <div className="space-y-3 animate-fade-in">
            {auctionsParticipated.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-auction-muted text-lg">
                  You haven't bid on any auctions yet
                </p>
                <button
                  onClick={() => navigate("/auctions")}
                  className="btn-primary mt-4 inline-block"
                >
                  Browse Auctions
                </button>
              </div>
            ) : (
              auctionsParticipated.map((auction) => (
                <div
                  key={auction._id}
                  onClick={() => navigate(`/auction/${auction._id}`)}
                  className="card p-4 md:p-5 cursor-pointer hover:border-auction-accent/40 transition-colors group"
                >
                  {/* Top row — title + status */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-auction-text font-medium group-hover:text-auction-accent transition-colors text-sm md:text-base">
                        {auction.title}
                      </h3>
                      <p className="text-auction-muted text-xs mt-1">
                        Ended {new Date(auction.endTime).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 font-mono uppercase tracking-wider shrink-0 ml-3 ${STATUS_STYLES[auction.status]}`}>
                      {auction.status}
                    </span>
                  </div>

                  {/* Bottom row — bids */}
                  <div className="flex gap-6">
                    <div>
                      <p className="text-auction-muted text-xs uppercase tracking-widest mb-1">
                        Your Bid
                      </p>
                      <p className="font-mono text-base md:text-lg text-auction-text">
                        ${auction.highestBid?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-auction-muted text-xs uppercase tracking-widest mb-1">
                        Final Price
                      </p>
                      <p className="font-mono text-base md:text-lg text-auction-accent">
                        ${auction.currentPrice?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </main>
    </div>
  );
}