import { useState, useEffect } from "react";
import { X, Gavel, Timer, Trophy, User } from "lucide-react";

const steps = [
  {
    icon: Gavel,
    title: "Browse Auctions",
    desc: "Visit the Auctions page to see all live, upcoming and ended auctions. Each card shows the current bid and time remaining."
  },
  {
    icon: Timer,
    title: "Place a Bid",
    desc: "Enter an auction room and place a bid higher than the current price. Use the quick +50, +100, +200, +500 buttons for fast bidding."
  },
  {
    icon: Trophy,
    title: "Win the Auction",
    desc: "The highest bidder when the timer hits zero wins. You'll see a winner banner on the auction room page."
  },
  {
    icon: User,
    title: "Track Your Activity",
    desc: "Visit your Profile to see all auctions you've won and participated in, along with your highest bids."
  },
];

export default function WelcomeModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = sessionStorage.getItem("auctra_welcome_seen");
    if (!seen) setVisible(true);
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("auctra_welcome_seen", "true");
    setVisible(false);
  };

  if (!visible) return null;

  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center px-4">
      <div className="bg-auction-surface border border-auction-border w-full max-w-md animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-auction-border">
          <div>
            <p className="text-auction-accent text-xs uppercase tracking-widest">
              Welcome to
            </p>
            <h2 className="font-display text-2xl text-auction-text tracking-widest">
              AUCTRA
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-auction-muted hover:text-auction-text transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step content */}
        <div className="px-6 py-8 text-center">
          <div className="w-16 h-16 bg-auction-accent/10 border border-auction-accent/20 flex items-center justify-center mx-auto mb-6">
            <Icon size={28} className="text-auction-accent" />
          </div>

          <h3 className="text-auction-text font-semibold text-lg mb-3">
            {current.title}
          </h3>
          <p className="text-auction-muted text-sm leading-relaxed">
            {current.desc}
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 pb-6">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-2 h-2 transition-all duration-200 ${
                i === step
                  ? "bg-auction-accent w-6"
                  : "bg-auction-border hover:bg-auction-muted"
              }`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={handleClose}
            className="btn-ghost flex-1 text-sm"
          >
            Skip
          </button>
          <button
            onClick={() => isLast ? handleClose() : setStep((s) => s + 1)}
            className="btn-primary flex-1 text-sm"
          >
            {isLast ? "Got it!" : "Next"}
          </button>
        </div>

      </div>
    </div>
  );
}