"use client";

import { Header } from "@/components/layout";
import { Card } from "@/components/ui";

const DISTRIBUTION = [
  { label: "Mining Rewards", percentage: 50, color: "from-orange-500 to-red-600", description: "Earned by CoreMiners through active mining cycles" },
  { label: "Ecosystem Fund", percentage: 15, color: "from-cyan-500 to-blue-600", description: "Development, partnerships, and ecosystem growth" },
  { label: "Staking Rewards", percentage: 10, color: "from-purple-500 to-pink-600", description: "Distributed to Axie stakers generating Resonance Power" },
  { label: "Team & Advisors", percentage: 10, color: "from-green-500 to-emerald-600", description: "Vested over 3 years with 6-month cliff" },
  { label: "Treasury", percentage: 10, color: "from-yellow-500 to-amber-600", description: "Protocol buybacks, liquidity, and emergency reserves" },
  { label: "Community Airdrop", percentage: 5, color: "from-rose-500 to-red-600", description: "Rewards for early adopters and active community members" },
];

const KEY_METRICS = [
  { label: "Total Supply", value: "2.1B", unit: "$CORE" },
  { label: "Halving Cycle", value: "Annual", unit: "-50% emission" },
  { label: "Initial Emission", value: "TBD", unit: "$CORE/day" },
  { label: "Burn Mechanism", value: "Deflationary", unit: "on every forge" },
];

const HALVING_SCHEDULE = [
  { year: "Year 1", emission: "100%", cumulative: "~50%" },
  { year: "Year 2", emission: "50%", cumulative: "~75%" },
  { year: "Year 3", emission: "25%", cumulative: "~87.5%" },
  { year: "Year 4", emission: "12.5%", cumulative: "~93.75%" },
  { year: "Year 5+", emission: "6.25%", cumulative: "→ 100%" },
];

const UTILITY = [
  { icon: "⚒️", title: "Upgrades", description: "Spend $CORE to upgrade CoreMiner stats, unlock abilities, and enhance mining power." },
  { icon: "🔧", title: "Repairs", description: "CoreMiners degrade over time. Use $CORE to repair and maintain peak mining efficiency." },
  { icon: "🗳️", title: "Governance", description: "Stake $CORE to vote on protocol proposals, emission rates, and ecosystem decisions." },
  { icon: "💎", title: "Staking", description: "Lock $CORE for additional yield and protocol benefits including boosted TrustScore." },
  { icon: "🔥", title: "Forge Fuel", description: "$CORE is consumed during the Forge process, creating constant buy pressure." },
  { icon: "🎮", title: "Minigames", description: "Entry fees and rewards in protocol minigames, creating circular token flow." },
];

export default function TokenomicsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            Tokenomics
          </h1>
          <p className="text-gray-400 text-lg">
            A deflationary Forge & Collect-to-Earn Protocol with programmed
            scarcity inspired by Bitcoin.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {KEY_METRICS.map((metric) => (
            <Card key={metric.label} variant="glass" className="p-6 text-center">
              <p className="text-sm text-gray-500 mb-1">{metric.label}</p>
              <p className="text-3xl font-bold text-orange-500">{metric.value}</p>
              <p className="text-xs text-gray-400 mt-1">{metric.unit}</p>
            </Card>
          ))}
        </div>

        {/* Distribution */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            Token Distribution
          </h2>
          <div className="max-w-4xl mx-auto">
            {/* Bar visualization */}
            <div className="flex h-8 rounded-full overflow-hidden mb-8">
              {DISTRIBUTION.map((item) => (
                <div
                  key={item.label}
                  className={`bg-linear-to-r ${item.color} relative group`}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.label}: ${item.percentage}%`}
                />
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DISTRIBUTION.map((item) => (
                <Card key={item.label} variant="bordered" className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full bg-linear-to-r ${item.color}`} />
                    <span className="font-semibold text-white">{item.label}</span>
                    <span className="ml-auto text-orange-400 font-bold">
                      {item.percentage}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Halving Schedule */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            Halving Schedule
          </h2>
          <div className="max-w-2xl mx-auto">
            <Card variant="glass" className="overflow-hidden p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-4 text-left text-gray-400 font-medium">
                      Period
                    </th>
                    <th className="px-6 py-4 text-center text-gray-400 font-medium">
                      Emission Rate
                    </th>
                    <th className="px-6 py-4 text-right text-gray-400 font-medium">
                      Cumulative Supply
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {HALVING_SCHEDULE.map((row, idx) => (
                    <tr
                      key={row.year}
                      className={`border-b border-gray-800 ${idx === 0 ? "bg-orange-500/5" : ""}`}
                    >
                      <td className="px-6 py-4 text-white font-medium">
                        {row.year}
                      </td>
                      <td className="px-6 py-4 text-center text-orange-400 font-mono">
                        {row.emission}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-300">
                        {row.cumulative}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <p className="text-center text-sm text-gray-500 mt-4">
              Emission rate is halved every 12 months, creating increasing
              scarcity over time.
            </p>
          </div>
        </section>

        {/* Token Utility */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            $CORE Utility
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {UTILITY.map((item) => (
              <Card key={item.title} variant="glass" hover className="p-6">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-orange-500 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Deflationary Flywheel */}
        <section className="max-w-3xl mx-auto">
          <Card variant="gradient" className="p-8 md:p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-6">
              The Deflationary Flywheel
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <div className="text-4xl">🔥</div>
                <p className="text-sm font-medium text-orange-400">Forge Burns</p>
                <p className="text-xs text-gray-400">
                  Axies + SLP permanently burned during transmutation
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl">📉</div>
                <p className="text-sm font-medium text-orange-400">Halving</p>
                <p className="text-xs text-gray-400">
                  Annual 50% reduction in new $CORE emission
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl">💸</div>
                <p className="text-sm font-medium text-orange-400">Buybacks</p>
                <p className="text-xs text-gray-400">
                  Treasury buys and burns $CORE from the market
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Multiple deflationary forces work together to create sustainable
              long-term value. As supply decreases and utility grows, $CORE
              becomes increasingly scarce.
            </p>
          </Card>
        </section>
      </main>
    </div>
  );
}
