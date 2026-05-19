import { useNavigate } from "react-router-dom";
import useCountdown from "../hooks/useCountdown";

const STATUS_STYLES = {
  active: "bg-green-400/10 text-green-400 border border-green-400/20",
  pending: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
  ended: "bg-auction-muted/10 text-auction-muted border border-auction-muted/20",
};

export default function AuctionCard({ auction }) {
  const navigate = useNavigate();
  const timeLeft = useCountdown(auction.endTime);

  const formatTime = (t) => {
    if (!t) return "Ended";
    if (t.hours > 0) return `${t.hours}h ${t.minutes}m left`;
    if (t.minutes > 0) return `${t.minutes}m ${t.seconds}s left`;
    return `${t.seconds}s left`;
  };

  return (
    <div
      onClick={() => navigate(`/auction/${auction._id}`)}
      className="card p-6 cursor-pointer hover:border-auction-accent/50 transition-all duration-200 group"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-auction-text font-semibold text-lg group-hover:text-auction-accent transition-colors line-clamp-1">
          {auction.title}
        </h2>
        <span className={`text-xs px-2 py-1 font-mono uppercase tracking-wider ml-3 shrink-0 ${STATUS_STYLES[auction.status]}`}>
          {auction.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-auction-muted text-sm mb-5 line-clamp-2">
        {auction.description}
      </p>

      {/* Bottom row */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-auction-muted text-xs uppercase tracking-widest mb-1">
            Current Bid
          </p>
          <p className="font-mono text-2xl text-auction-accent font-medium">
            ${auction.currentPrice.toLocaleString()}
          </p>
        </div>

        <div className="text-right">
          {auction.status === "active" && (
            <p className="text-auction-text-dim text-sm font-mono">
              ⏳ {formatTime(timeLeft)}
            </p>
          )}
          {auction.status === "pending" && (
            <p className="text-yellow-400/70 text-sm">
              Starts soon
            </p>
          )}
          {auction.status === "ended" && (
            <p className="text-auction-muted text-sm">
              Winner: {auction.highestBidder?.username || "—"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}