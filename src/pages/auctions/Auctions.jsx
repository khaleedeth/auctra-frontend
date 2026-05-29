import { useEffect, useState } from "react";
import { getAuctions } from "../../api/auction";import AuctionCard from "../../components/AuctionCard";
import {socket} from "../../utils/socket";

export default function Auctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await getAuctions();
        setAuctions(res.data);
      } catch (err) {
        setError("Failed to load auctions");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  useEffect(() => {
  socket.auth.token = localStorage.getItem("token");
  socket.connect();

  socket.on("auction_list_update", (data) => {
    setAuctions((prev) =>
      prev.map((a) =>
        a._id === data.auctionId
          ? {
              ...a,
              currentPrice: data.currentPrice ?? a.currentPrice,
              status: data.status ?? a.status,
            }
          : a
      )
    );
  });

  return () => {
    socket.off("auction_list_update");
    socket.disconnect();
  };
}, []);

  const filtered = filter === "all"
    ? auctions
    : auctions.filter((a) => a.status === filter);

  const counts = {
    all: auctions.length,
    active: auctions.filter((a) => a.status === "active").length,
    pending: auctions.filter((a) => a.status === "pending").length,
    ended: auctions.filter((a) => a.status === "ended").length,
  };

 return (
  <div className="min-h-screen bg-auction-bg">
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="font-display text-3xl md:text-5xl text-auction-text tracking-wider mb-1">
          LIVE AUCTIONS
        </h1>
        <p className="text-auction-muted text-sm">
          {counts.active} active · {counts.pending} upcoming · {counts.ended} ended
        </p>
      </div>

      {/* Filter tabs — scrollable on mobile */}
      <div className="flex gap-1 md:gap-2 mb-6 md:mb-8 border-b border-auction-border pb-4 overflow-x-auto scrollbar-none">
        {["all", "active", "pending", "ended"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium uppercase tracking-widest transition-colors duration-200 whitespace-nowrap ${
              filter === tab
                ? "text-auction-accent border-b-2 border-auction-accent -mb-[17px]"
                : "text-auction-muted hover:text-auction-text"
            }`}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-5 bg-auction-border rounded w-3/4 mb-3" />
              <div className="h-3 bg-auction-border rounded w-full mb-2" />
              <div className="h-3 bg-auction-border rounded w-2/3 mb-6" />
              <div className="h-7 bg-auction-border rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-red-400 bg-red-400/10 border border-red-400/20 px-4 md:px-6 py-4">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-auction-muted text-lg">No {filter} auctions found</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {filtered.map((auction) => (
            <AuctionCard key={auction._id} auction={auction} />
          ))}
        </div>
      )}

    </main>
  </div>
);
}