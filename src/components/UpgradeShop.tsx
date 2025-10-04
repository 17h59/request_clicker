import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { upgradeCategories } from '../data/upgrades';
import { formatNumber } from '../utils/formatNumber';
import * as Icons from 'lucide-react';

export function UpgradeShop() {
  const [selectedCategory, setSelectedCategory] = useState('clicking');
  const { totalRequests, purchaseUpgrade, ownedUpgrades, getCostForStackable } = useGameStore();

  const currentCategory = upgradeCategories.find((c) => c.id === selectedCategory);

  const handlePurchase = (upgrade: any) => {
    const cost = upgrade.stackable ? getCostForStackable(upgrade) : upgrade.baseCost;
    const success = purchaseUpgrade(upgrade.id, cost, upgrade.effect, upgrade.stackable);
    if (!success) {
      // Optional: Add visual feedback for failed purchase
    }
  };

  const canAfford = (upgrade: any) => {
    const cost = upgrade.stackable ? getCostForStackable(upgrade) : upgrade.baseCost;
    return totalRequests >= cost;
  };

  const isOwned = (upgrade: any) => {
    return ownedUpgrades[upgrade.id] > 0;
  };

  const isPurchased = (upgrade: any) => {
    return (!upgrade.stackable && isOwned(upgrade)) || upgrade.defaultUnlocked;
  };

  return (
    <div className="flex flex-col h-full border-2 rounded-lg bg-black/60 border-primary/30">
      <h2 className="p-4 text-xl font-bold border-b-2 text-primary neon-text border-primary/30">
        UPGRADE SHOP
      </h2>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 p-4 border-b-2 border-primary/30">
        {upgradeCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1 text-sm border-2 rounded transition-all ${
              selectedCategory === category.id
                ? 'bg-primary/20 border-primary text-primary'
                : 'border-primary/30 text-gray-400 hover:border-primary/50'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Upgrades List */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {currentCategory?.upgrades.map((upgrade) => {
          const cost = upgrade.stackable ? getCostForStackable(upgrade) : upgrade.baseCost;
          const affordable = canAfford(upgrade);
          const purchased = isPurchased(upgrade);
          const owned = ownedUpgrades[upgrade.id] || 0;

          return (
            <div
              key={upgrade.id}
              className={`p-4 border-2 rounded-lg transition-all ${
                purchased
                  ? 'border-primary/20 bg-primary/5'
                  : affordable
                  ? 'border-primary/50 bg-black/40'
                  : 'border-primary/20 bg-black/20 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-secondary">
                    {upgrade.name}
                    {upgrade.stackable && owned > 0 && (
                      <span className="ml-2 text-sm text-primary">x{owned}</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-400">{upgrade.description}</p>
                </div>
                <button
                  onClick={() => handlePurchase(upgrade)}
                  disabled={!affordable || purchased}
                  className={`ml-4 px-4 py-2 text-sm font-bold border-2 rounded transition-all ${
                    purchased
                      ? 'border-primary/20 text-primary/40 cursor-not-allowed'
                      : affordable
                      ? 'border-primary text-primary hover:bg-primary/20 hover:shadow-glow cursor-pointer'
                      : 'border-primary/30 text-primary/40 cursor-not-allowed'
                  }`}
                >
                  {purchased ? 'OWNED' : formatNumber(cost)}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
