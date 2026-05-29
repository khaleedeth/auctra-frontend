import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";

const initialForm = {
  title: "",
  description: "",
  startingPrice: "",
  startTime: "",
  endTime: "",
};

export default function AdminDashboard() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const { title, description, startingPrice, startTime, endTime } = form;

    if (!title || !description || !startingPrice || !startTime || !endTime) {
      setError("All fields are required");
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      setError("End time must be after start time");
      return;
    }

    if (Number(startingPrice) <= 0) {
      setError("Starting price must be positive");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/auctions/create", {
        ...form,
        startingPrice: Number(startingPrice),
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      });

      setSuccess(`Auction "${res.data.title}" created successfully!`);
      setForm(initialForm);

      setTimeout(() => navigate("/auctions"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create auction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-auction-bg">

      <main className="max-w-2xl mx-auto px-4 md:px-6 py-6 md:py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-auction-accent text-xs uppercase tracking-widest mb-1">
            Admin Panel
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-auction-text tracking-wider">
            CREATE AUCTION
          </h1>
        </div>

        <div className="card p-4 md:p-8 space-y-6">

          {/* Title */}
          <div>
            <label className="text-auction-text-dim text-xs uppercase tracking-widest block mb-2">
              Auction Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. Vintage Rolex Submariner"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-auction-text-dim text-xs uppercase tracking-widest block mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="input-field resize-none"
              placeholder="Describe the item being auctioned..."
            />
          </div>

          {/* Starting Price */}
          <div>
            <label className="text-auction-text-dim text-xs uppercase tracking-widest block mb-2">
              Starting Price ($)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-auction-muted font-mono">
                $
              </span>
              <input
                name="startingPrice"
                type="number"
                value={form.startingPrice}
                onChange={handleChange}
                className="input-field pl-8 font-mono"
                placeholder="100"
              />
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-auction-text-dim text-xs uppercase tracking-widest block mb-2">
                Start Time
              </label>
              <input
                name="startTime"
                type="datetime-local"
                value={form.startTime}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-auction-text-dim text-xs uppercase tracking-widest block mb-2">
                End Time
              </label>
              <input
                name="endTime"
                type="datetime-local"
                value={form.endTime}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          {/* Error / Success */}
          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-3">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 px-4 py-3">
              ✓ {success}
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Auction"}
          </button>

        </div>
      </main>
    </div>
  );
}