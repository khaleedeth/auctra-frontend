import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../../utils/socket";
import { api } from "../../api/axios";
import useCountdown from "../../hooks/useCountdown";
import { useAuth } from "../../context/AuthContext";

export default function AuctionRoom() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [auction, setAuction] = useState(null);
  const [bid, setBid] = useState("");
  const [highestBidder, setHighestBidder] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [ended, setEnded] = useState(false);
  const [bidLoading, setBidLoading] = useState(false);

  const timeLeft = useCountdown(auction?.endTime);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await api.get(`/auctions/${id}`);
        setAuction(res.data);
        setHighestBidder(res.data.highestBidder);
        setBidHistory([...(res.data.bidHistory || [])].reverse());
        if (res.data.status === "ended") setEnded(true);
      } catch (err) {
        setError("Failed to load auction");
      } finally {
        setLoading(false);
      }
    };
    fetchAuction();
  }, [id]);

  useEffect(() => {
    socket.auth.token = localStorage.getItem("token");
    socket.connect();
    socket.emit("join_auction", id);

    socket.on("bid_update", (data) => {
      setAuction((prev) => ({ ...prev, currentPrice: data.currentPrice }));
      setHighestBidder(data.highestBidder);
      setBidHistory((prev) => [data.latestBid, ...prev]);
      setBidLoading(false);
    });

    socket.on("auction_ended", () => {
      setEnded(true);
      setAuction((prev) => ({ ...prev, status: "ended" }));
    });

    socket.on("bid_error", (msg) => {
      setError(msg);
      setBidLoading(false);
      setTimeout(() => setError(""), 3000);
    });

    return () => {
      socket.off("bid_update");
      socket.off("auction_ended");
      socket.off("bid_error");
      socket.disconnect();
    };
  }, [id]);

  const placeBid = () => {
    const amount = Number(bid);
    if (!amount || amount <= 0) {
      setError("Enter a valid bid amount");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setBidLoading(true);
    socket.emit("place_bid", { auctionId: id, amount });
    setBid("");
  };

  const formatTime = (t) => {
    if (!t) return "00:00:00";
    const h = String(t.hours).padStart(2, "0");
    const m = String(t.minutes).padStart(2, "0");
    const s = String(t.seconds).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const isWinner = ended && highestBidder?.userId === user?.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-auction-bg">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-auction-card rounded w-1/3" />
            <div className="h-4 bg-auction-card rounded w-2/3" />
            <div className="h-32 bg-auction-card rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !auction) {
    return (
      <div className="min-h-screen bg-auction-bg">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-auction-bg">
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">

        {/* Back */}
        <button
          onClick={() => navigate("/auctions")}
          className="text-auction-muted text-sm hover:text-auction-text transition-colors mb-4 md:mb-6 flex items-center gap-2"
        >
          ← Back to Auctions
        </button>

        {/* Winner Banner */}
        {isWinner && (
          <div className="bg-auction-accent/10 border border-auction-accent/30 px-4 md:px-6 py-3 md:py-4 mb-4 md:mb-6 animate-fade-in">
            <p className="text-auction-accent font-semibold text-base md:text-lg">
              Congratulations! You won this auction for ${auction.currentPrice.toLocaleString()}
            </p>
          </div>
        )}

        {ended && !isWinner && (
          <div className="bg-auction-surface border border-auction-border px-4 md:px-6 py-3 md:py-4 mb-4 md:mb-6">
            <p className="text-auction-text-dim text-sm md:text-base">
              🔔 Auction ended · Winner:{" "}
              <span className="text-auction-accent font-medium">
                {highestBidder?.username || "No winner"}
              </span>
              {" "}· Final price:{" "}
              <span className="font-mono text-auction-text">
                ${auction.currentPrice.toLocaleString()}
              </span>
            </p>
          </div>
        )}

        {/* Main grid — stacks on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

          {/* LEFT — Main info */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">

            {/* Title & status */}
            <div className="card p-4 md:p-6">
              <div className="flex items-start justify-between mb-3">
                <h1 className="font-display text-2xl md:text-4xl text-auction-text tracking-wide pr-2">
                  {auction.title}
                </h1>
                <span className={`text-xs px-2 md:px-3 py-1 font-mono uppercase tracking-wider shrink-0 ${
                  auction.status === "active"
                    ? "bg-green-400/10 text-green-400 border border-green-400/20"
                    : auction.status === "pending"
                    ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                    : "bg-auction-muted/10 text-auction-muted border border-auction-muted/20"
                }`}>
                  {auction.status}
                </span>
              </div>
              <p className="text-auction-muted text-sm leading-relaxed">
                {auction.description}
              </p>
            </div>

            {/* Price + Countdown — stacks on small mobile */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="card p-4 md:p-6">
                <p className="text-auction-muted text-xs uppercase tracking-widest mb-2">
                  Current Bid
                </p>
                <p className="font-mono text-2xl md:text-4xl text-auction-accent font-medium">
                  ${auction.currentPrice.toLocaleString()}
                </p>
                <p className="text-auction-muted text-xs mt-1">
                  Started at ${auction.startingPrice.toLocaleString()}
                </p>
              </div>

              <div className="card p-4 md:p-6">
                <p className="text-auction-muted text-xs uppercase tracking-widest mb-2">
                  {ended ? "Ended" : auction.status === "pending" ? "Starts" : "Time Left"}
                </p>
                {!ended && auction.status === "active" && (
                  <p className={`font-mono text-2xl md:text-4xl font-medium ${
                    timeLeft && timeLeft.hours === 0 && timeLeft.minutes < 5
                      ? "text-red-400"
                      : "text-auction-text"
                  }`}>
                    {formatTime(timeLeft)}
                  </p>
                )}
                {auction.status === "pending" && (
                  <p className="font-mono text-sm md:text-xl text-yellow-400">
                    {new Date(auction.startTime).toLocaleString()}
                  </p>
                )}
                {ended && (
                  <p className="text-auction-muted text-base md:text-lg">Auction closed</p>
                )}
              </div>
            </div>

            {/* Highest Bidder */}
            <div className="card p-4 md:p-6 flex items-center gap-3 md:gap-4">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-auction-accent/10 border border-auction-accent/20 flex items-center justify-center text-auction-accent font-display text-lg md:text-xl shrink-0">
                {highestBidder?.username?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <p className="text-auction-muted text-xs uppercase tracking-widest">
                  Highest Bidder
                </p>
                <p className="text-auction-text font-medium">
                  {highestBidder?.username || "No bids yet"}
                </p>
              </div>
            </div>

            {/* Place Bid */}
            {auction.status === "active" && !ended && (
              <div className="card p-4 md:p-6">
                <h3 className="text-auction-text font-semibold mb-4 uppercase tracking-widest text-sm">
                  Place Your Bid
                </h3>

                {error && (
                  <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-2 mb-4">
                    {error}
                  </p>
                )}

                {/* Quick bid buttons */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[50, 100, 200, 500].map((increment) => (
                    <button
                      key={increment}
                      onClick={() => setBid(String(auction.currentPrice + increment))}
                      className="py-2 text-sm font-mono border border-auction-border text-auction-text-dim hover:border-auction-accent hover:text-auction-accent transition-all duration-200"
                    >
                      +{increment}
                    </button>
                  ))}
                </div>

                {/* Bid input — stacks on mobile */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-auction-muted font-mono">
                      $
                    </span>
                    <input
                      type="number"
                      value={bid}
                      onChange={(e) => setBid(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && placeBid()}
                      placeholder={`Min. $${auction.currentPrice + 1}`}
                      className="input-field pl-8 font-mono"
                    />
                  </div>
                  <button
                    onClick={placeBid}
                    disabled={bidLoading}
                    className="btn-primary sm:px-8 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    {bidLoading ? "Placing..." : "Bid Now"}
                  </button>
                </div>
              </div>
            )}

            {auction.status === "pending" && (
              <div className="card p-4 md:p-6 text-center">
                <p className="text-yellow-400">⏳ This auction hasn't started yet</p>
              </div>
            )}
          </div>

          {/* RIGHT — Bid History */}
          <div className="card p-4 md:p-6 flex flex-col">
            <h3 className="text-auction-text font-semibold uppercase tracking-widest text-sm mb-4 pb-4 border-b border-auction-border">
              Bid History
              <span className="text-auction-muted font-normal ml-2">
                ({bidHistory.length})
              </span>
            </h3>

            {bidHistory.length === 0 ? (
              <p className="text-auction-muted text-sm text-center py-8">
                No bids placed yet
              </p>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[300px] lg:max-h-[500px] pr-1">
                {bidHistory.map((b, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between py-3 border-b border-auction-border/50 ${
                      i === 0 ? "animate-slide-up" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-auction-surface border border-auction-border flex items-center justify-center text-auction-accent text-xs font-display shrink-0">
                        {b.username?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-auction-text-dim text-sm">
                        {b.username}
                      </span>
                    </div>
                    <span className="font-mono text-auction-accent font-medium">
                      ${b.amount?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}